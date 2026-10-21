"""Multi-source ingestion workers and collectors for Polish government OSINT."""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

import httpx

from govscope.models.entities import (
    LegislativeInitiative,
    LegislativeStage,
    OfficialStatement,
    SourceType,
)

logger = logging.getLogger("govscope.ingest")


class IngestClient:
    """Async HTTP client wrapper with exponential backoff and rate-limit awareness."""

    def __init__(self, timeout: float = 10.0, max_retries: int = 3) -> None:
        self.timeout = timeout
        self.max_retries = max_retries

    async def fetch(self, url: str, headers: Optional[Dict[str, str]] = None) -> Optional[str]:
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(1, self.max_retries + 1):
                try:
                    response = await client.get(url, headers=headers)
                    if response.status_code == 200:
                        return response.text
                    elif response.status_code == 429:
                        retry_after = int(response.headers.get("Retry-After", 2 * attempt))
                        logger.warning("Rate limited (429) on %s. Sleeping for %ss", url, retry_after)
                        await asyncio.sleep(retry_after)
                    else:
                        logger.warning("HTTP %d for URL %s on attempt %d", response.status_code, url, attempt)
                except (httpx.RequestError, httpx.TimeoutException) as err:
                    logger.error("Request error %s on attempt %d for %s", err, attempt, url)
                    if attempt == self.max_retries:
                        return None
                    await asyncio.sleep(1.5 * attempt)
            return None


class RCLCollector:
    """Collector for Government Legislation Center (RCL) and Wykaz prac rządu."""

    def __init__(self, client: Optional[IngestClient] = None) -> None:
        self.client = client or IngestClient()

    def parse_initiative(self, raw_item: Dict[str, Any]) -> LegislativeInitiative:
        stage_str = raw_item.get("stage", "WYKAZ_PRAC_RM")
        try:
            stage = LegislativeStage(stage_str)
        except ValueError:
            stage = LegislativeStage.WYKAZ_PRAC_RM

        return LegislativeInitiative(
            rcl_number=raw_item.get("rcl_number"),
            title=raw_item["title"],
            sponsor_ministry_id=raw_item.get("sponsor_ministry_id"),
            lead_official_id=raw_item.get("lead_official_id"),
            stage=stage,
            has_skrm_approval=raw_item.get("has_skrm_approval", False),
            summary=raw_item.get("summary"),
            key_assumptions=raw_item.get("key_assumptions", []),
            source_url=raw_item.get("source_url"),
        )


class MediaInterviewWireCollector:
    """Monitors morning (07:00-09:30) and evening (17:00-19:00) broadcast interview quotes."""

    def parse_quote(
        self,
        official_id: UUID,
        ministry_id: UUID,
        outlet_name: str,
        title: str,
        quote_text: str,
        published_at: Optional[datetime] = None,
        source_url: Optional[str] = None,
    ) -> OfficialStatement:
        return OfficialStatement(
            official_id=official_id,
            ministry_id=ministry_id,
            source_type=SourceType.MEDIA_INTERVIEW,
            title=title,
            content=quote_text,
            published_at=published_at or datetime.now(timezone.utc),
            source_url=source_url,
            raw_metadata={"outlet_name": outlet_name, "wire_type": "BROADCAST_INTERVIEW"},
        )


class EUSignalsCollector:
    """Ingests Brussels council conclusions, commission communications, and infringement notices."""

    def create_eu_notice(
        self,
        title: str,
        content: str,
        eu_institution: str,
        topic: str,
        source_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {
            "id": str(uuid4()),
            "title": title,
            "content": content,
            "institution": eu_institution,
            "topic": topic,
            "source_url": source_url,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
