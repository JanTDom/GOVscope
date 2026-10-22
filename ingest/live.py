"""Live public-source ingestion with provenance and idempotent Supabase writes."""

from __future__ import annotations

import asyncio
import hashlib
import logging
import os
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from html import unescape
from typing import Any, Iterable, Optional
from urllib.parse import urljoin
from xml.etree import ElementTree

import asyncpg

from ingest.engine import AsyncIngestEngine

logger = logging.getLogger("govscope.ingest.live")


@dataclass(frozen=True)
class PublicSource:
    key: str
    name: str
    kind: str
    url: str


DEFAULT_SOURCES: tuple[PublicSource, ...] = (
    PublicSource("sejm_api", "API Sejmu", "JSON_API", "https://api.sejm.gov.pl/sejm/term10/prints"),
    PublicSource("sejm_eli_api", "ELI / akty prawne", "JSON_API", "https://api.sejm.gov.pl/eli/acts"),
    PublicSource("rcl_wpl_rm", "Wykaz prac legislacyjnych RM", "HTML", "https://www.gov.pl/web/premier/wplip-rm"),
    PublicSource("rcl_wpl_prm", "Wykaz prac legislacyjnych PRM", "HTML", "https://www.gov.pl/web/premier/wpl-prm"),
    PublicSource("govpl_premier", "Gov.pl KPRM", "DISCOVER_RSS", "https://www.gov.pl/web/premier"),
    PublicSource("consilium_rss", "Rada Unii Europejskiej", "DISCOVER_RSS", "https://www.consilium.europa.eu/en/about-site/rss/"),
    PublicSource("gus_rss", "Główny Urząd Statystyczny", "DISCOVER_RSS", "https://stat.gov.pl/rss/"),
    PublicSource("uokik_rss", "UOKiK", "DISCOVER_RSS", "https://www.uokik.gov.pl/public/rss"),
    PublicSource("cuw_rss", "Centralny Urząd Administracji", "DISCOVER_RSS", "https://bip.centrum.gov.pl/cuw/rss"),
    PublicSource("pap_mediaroom", "PAP MediaRoom", "DISCOVER_RSS", "https://pap-mediaroom.pl/rss"),
    PublicSource("pap_samorzad", "Serwis Samorządowy PAP", "RSS", "https://samorzad.pap.pl/rss.xml"),
    PublicSource("rmf24", "RMF24", "RSS", "https://www.rmf24.pl/fakty/polska/feed"),
    PublicSource("tvn24", "TVN24", "RSS", "https://tvn24.pl/wiadomosci-z-kraju,3.xml"),
    PublicSource("polsat_news", "Polsat News", "RSS", "https://www.polsatnews.pl/rss/wszystkie.xml"),
    PublicSource("rzeczpospolita", "Rzeczpospolita", "RSS", "https://www.rp.pl/rss_main"),
    PublicSource("wirtualne_media", "Wirtualne Media", "RSS", "https://www.wirtualnemedia.pl/rss/wirtualnemedia_rss.xml"),
)


def _hash(*parts: str) -> str:
    return hashlib.sha256("\x1f".join(parts).encode("utf-8")).hexdigest()


def _text(value: Optional[str]) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def discover_feeds(html: str, base_url: str) -> list[str]:
    links = re.findall(r"<link[^>]+(?:href|url)=[\"']([^\"']+)[\"'][^>]*>", html, flags=re.I)
    hrefs = [urljoin(base_url, unescape(link)) for link in links]
    hrefs.extend(urljoin(base_url, match) for match in re.findall(r"https?://[^\"'<>\s]+(?:rss|feed)[^\"'<>\s]*", html, flags=re.I))
    return list(dict.fromkeys(url for url in hrefs if re.search(r"rss|feed|atom|xml", url, flags=re.I)))


def parse_rss(xml: str, source_key: str, source_name: str) -> list[dict[str, Any]]:
    try:
        root = ElementTree.fromstring(xml)
    except ElementTree.ParseError:
        return []
    items = root.findall(".//item") or root.findall(".//{*}entry")
    result: list[dict[str, Any]] = []
    for item in items:
        def child(*names: str) -> str:
            for name in names:
                node = item.find(name) or item.find(f".//{{*}}{name}")
                if node is not None and node.text:
                    return _text(node.text)
            return ""

        title = child("title") or "Komunikat urzędowy"
        link = child("link", "guid")
        published = child("pubDate", "published", "updated")
        result.append({
            "source_key": source_key,
            "source_name": source_name,
            "title": title,
            "content": child("description", "summary", "content") or title,
            "source_url": link,
            "published_at": published,
            "content_hash": _hash(source_key, link or title, title),
        })
    return result


class LiveIngestionRunner:
    """Fetches public sources and writes only source-backed rows to Supabase."""

    def __init__(self, engine: Optional[AsyncIngestEngine] = None, sources: Iterable[PublicSource] = DEFAULT_SOURCES) -> None:
        self.engine = engine or AsyncIngestEngine()
        self.sources = tuple(sources)

    async def _fetch_source(self, source: PublicSource) -> list[dict[str, Any]]:
        if source.kind == "JSON_API":
            payload = await self.engine.fetch_json(source.url)
            if not isinstance(payload, list):
                payload = payload.get("items", []) if isinstance(payload, dict) else []
            return [{
                "source_key": source.key,
                "source_name": source.name,
                "title": str(item.get("title") or item.get("name") or item.get("id") or "Rekord urzędowy"),
                "content": str(item.get("description") or item.get("title") or item),
                "source_url": source.url,
                "published_at": str(item.get("date") or item.get("published_at") or ""),
                "content_hash": _hash(source.key, str(item)),
            } for item in payload if isinstance(item, dict)]
        page = await self.engine.fetch(source.url)
        if not page:
            return []
        if source.kind == "DISCOVER_RSS":
            feeds = discover_feeds(page, source.url)
            records: list[dict[str, Any]] = []
            for feed in feeds[:8]:
                xml = await self.engine.fetch(feed)
                if xml:
                    records.extend(parse_rss(xml, source.key, source.name))
            return records
        return parse_rss(page, source.key, source.name)

    async def run_once(self) -> dict[str, int]:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise RuntimeError("DATABASE_URL is required for live ingestion")
        pool = await asyncpg.create_pool(database_url, min_size=1, max_size=3)
        seen = written = 0
        try:
            for source in self.sources:
                started = datetime.now(timezone.utc)
                try:
                    records = await self._fetch_source(source)
                    seen += len(records)
                    async with pool.acquire() as connection:
                        await connection.execute(
                            """INSERT INTO ingestion_runs (source_key, status, records_seen, records_written, finished_at)
                               VALUES ($1, 'SUCCEEDED', $2, 0, NOW())""", source.key, len(records)
                        )
                        for record in records:
                            if not record["source_url"]:
                                continue
                            result = await connection.execute(
                                """INSERT INTO official_statements
                                   (official_id, ministry_id, source_type, title, content, published_at, source_url,
                                    raw_metadata, source_key, content_hash, verified, fetched_at)
                                   VALUES (NULL, NULL, $8, $1, $2, COALESCE(NULLIF($3, '')::timestamptz, NOW()),
                                           $4, jsonb_build_object('source_name', $5), $6, $7, TRUE, NOW())
                                   ON CONFLICT (source_key, content_hash) DO NOTHING""",
                                record["title"], record["content"], record["published_at"], record["source_url"],
                                record["source_name"], record["source_key"], record["content_hash"],
                                "MEDIA_INTERVIEW" if source.key.startswith(("pap_", "rmf", "tvn", "polsat", "rzecz", "wirtualne")) else "GOV_PL",
                            )
                            if result.endswith("1"):
                                written += 1
                        await connection.execute(
                            "UPDATE ingestion_sources SET last_success_at = NOW(), last_error = NULL, records_ingested = records_ingested + $2, updated_at = NOW() WHERE source_key = $1",
                            source.key, len(records),
                        )
                except Exception as exc:
                    logger.exception("Source %s failed", source.key)
                    async with pool.acquire() as connection:
                        await connection.execute(
                            "UPDATE ingestion_sources SET last_error_at = NOW(), last_error = $2, updated_at = NOW() WHERE source_key = $1",
                            source.key, str(exc)[:1000],
                        )
                logger.info("Source %s completed in %.1fs", source.key, (datetime.now(timezone.utc) - started).total_seconds())
        finally:
            await pool.close()
            await self.engine.close()
        return {"records_seen": seen, "records_written": written}


async def main() -> None:
    result = await LiveIngestionRunner().run_once()
    logger.info("Live ingestion completed: %s", result)


if __name__ == "__main__":
    asyncio.run(main())
