"""Wire and interview collectors for morning/evening broadcast interview monitoring."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID

from govscope.models.entities import OfficialStatement, SourceType
from ingest.engine import AsyncIngestEngine

logger = logging.getLogger("govscope.ingest.wires")


class AgencyWireCollector:
    """Monitors news agency wires (PAP, IAR) focusing on morning (07:00-09:30) and evening (17:00-19:00) interviews."""

    def __init__(self, engine: Optional[AsyncIngestEngine] = None) -> None:
        self.engine = engine or AsyncIngestEngine()

    @staticmethod
    def determine_interview_window(dt: datetime) -> str:
        """Categorizes interview into high-sensitivity political broadcast windows."""
        hour = dt.hour
        minute = dt.minute
        time_dec = hour + (minute / 60.0)
        if 7.0 <= time_dec <= 9.5:
            return "MORNING_INTERVIEW_WINDOW"
        elif 17.0 <= time_dec <= 19.0:
            return "EVENING_INTERVIEW_WINDOW"
        return "GENERAL_DAILY_WIRE"

    def parse_wire_item(
        self,
        raw_wire: Dict[str, Any],
        official_id: UUID,
        ministry_id: UUID,
    ) -> OfficialStatement:
        """Parses raw wire feed item into typed OfficialStatement."""
        title = raw_wire.get("headline", "Depesza agencyjna")
        content = raw_wire.get("body", "")
        outlet = raw_wire.get("source_outlet", "PAP")
        published_raw = raw_wire.get("published_at")

        pub_date = datetime.now(timezone.utc)
        if published_raw:
            try:
                pub_date = datetime.fromisoformat(published_raw)
                if pub_date.tzinfo is None:
                    pub_date = pub_date.replace(tzinfo=timezone.utc)
            except Exception:
                pub_date = datetime.now(timezone.utc)

        window = self.determine_interview_window(pub_date)

        return OfficialStatement(
            official_id=official_id,
            ministry_id=ministry_id,
            source_type=SourceType.MEDIA_INTERVIEW,
            title=title,
            content=content,
            summary=content[:250] if len(content) > 250 else content,
            topic_category=raw_wire.get("category", "POLITYKA_KRAJOWA"),
            published_at=pub_date,
            source_url=raw_wire.get("url"),
            raw_metadata={
                "source_outlet": outlet,
                "broadcast_window": window,
                "is_prime_time_interview": window != "GENERAL_DAILY_WIRE",
            },
        )

    def parse_batch_wires(
        self,
        wire_items: List[Dict[str, Any]],
        official_mapping: Dict[str, Tuple[UUID, UUID]],
    ) -> List[OfficialStatement]:
        """Parses batch of wire items mapping names to official and ministry UUIDs."""
        statements: List[OfficialStatement] = []
        for item in wire_items:
            official_name = item.get("official_name", "")
            mapping = official_mapping.get(official_name)
            if mapping:
                off_id, min_id = mapping
                stmt = self.parse_wire_item(item, official_id=off_id, ministry_id=min_id)
                statements.append(stmt)
        return statements
