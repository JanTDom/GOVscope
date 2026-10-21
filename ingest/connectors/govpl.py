"""Connector for official gov.pl news, announcements and RSS feeds."""

from __future__ import annotations

import logging
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from govscope.models.entities import OfficialStatement, SourceType
from ingest.engine import AsyncIngestEngine

logger = logging.getLogger("govscope.ingest.govpl")


class GovPlCollector:
    """Ingests official ministerial announcements and KPRM press releases from gov.pl."""

    def __init__(self, engine: Optional[AsyncIngestEngine] = None) -> None:
        self.engine = engine or AsyncIngestEngine()

    def parse_rss_feed(
        self,
        xml_content: str,
        ministry_id: UUID,
        default_official_id: UUID,
    ) -> List[OfficialStatement]:
        """Parses standard RSS 2.0 / Atom feed from gov.pl portal."""
        statements: List[OfficialStatement] = []
        try:
            root = ET.fromstring(xml_content)
        except ET.ParseError as err:
            logger.error("Failed to parse RSS XML: %s", err)
            return statements

        # Handle standard RSS channel items
        channel = root.find("channel")
        items = channel.findall("item") if channel is not None else root.findall(".//item")

        for item in items:
            title_elem = item.find("title")
            desc_elem = item.find("description")
            link_elem = item.find("link")
            pub_date_elem = item.find("pubDate")

            title = (title_elem.text or "").strip() if title_elem is not None else "Komunikat rządowy"
            desc = (desc_elem.text or "").strip() if desc_elem is not None else ""
            link = (link_elem.text or "").strip() if link_elem is not None else None

            pub_date: datetime = datetime.now(timezone.utc)
            if pub_date_elem is not None and pub_date_elem.text:
                try:
                    pub_date = parsedate_to_datetime(pub_date_elem.text.strip())
                    if pub_date.tzinfo is None:
                        pub_date = pub_date.replace(tzinfo=timezone.utc)
                except Exception:
                    pub_date = datetime.now(timezone.utc)

            content = desc if desc else title
            stmt = OfficialStatement(
                official_id=default_official_id,
                ministry_id=ministry_id,
                source_type=SourceType.GOV_PL,
                title=title,
                content=content,
                summary=desc[:280] if desc else None,
                published_at=pub_date,
                source_url=link,
                raw_metadata={"source_system": "GOV_PL_RSS", "guid": link},
            )
            statements.append(stmt)

        return statements

    def parse_announcement_dict(
        self,
        raw_data: Dict[str, Any],
        ministry_id: UUID,
        official_id: UUID,
    ) -> OfficialStatement:
        """Parses a structured announcement item received from gov.pl API or web scraper."""
        title = raw_data.get("title", "Komunikat")
        body = raw_data.get("content") or raw_data.get("lead") or title
        pub_raw = raw_data.get("published_at")

        published_at = datetime.now(timezone.utc)
        if pub_raw:
            try:
                published_at = datetime.fromisoformat(pub_raw)
                if published_at.tzinfo is None:
                    published_at = published_at.replace(tzinfo=timezone.utc)
            except Exception:
                published_at = datetime.now(timezone.utc)

        return OfficialStatement(
            official_id=official_id,
            ministry_id=ministry_id,
            source_type=SourceType.GOV_PL,
            title=title,
            content=body,
            summary=raw_data.get("lead"),
            topic_category=raw_data.get("category"),
            published_at=published_at,
            source_url=raw_data.get("url"),
            raw_metadata=raw_data,
        )

    async def fetch_feed(
        self,
        feed_url: str,
        ministry_id: UUID,
        official_id: UUID,
    ) -> List[OfficialStatement]:
        """Asynchronously fetches and parses a gov.pl RSS feed."""
        xml_text = await self.engine.fetch(feed_url)
        if not xml_text:
            return []
        return self.parse_rss_feed(xml_text, ministry_id, official_id)
