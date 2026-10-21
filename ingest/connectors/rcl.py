"""Connector for Government Legislation Center (RCL) and Wykaz prac legislacyjnych rządu."""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional
from uuid import UUID

from govscope.models.entities import LegislativeInitiative, LegislativeStage
from ingest.engine import AsyncIngestEngine

logger = logging.getLogger("govscope.ingest.rcl")


class WykazPracCollector:
    """Ingests legislative initiatives and drafts from Wykaz prac legislacyjnych i programowych RM."""

    def __init__(self, engine: Optional[AsyncIngestEngine] = None) -> None:
        self.engine = engine or AsyncIngestEngine()

    def parse_initiative(
        self,
        item: Dict[str, Any],
        sponsor_ministry_id: Optional[UUID] = None,
        lead_official_id: Optional[UUID] = None,
    ) -> LegislativeInitiative:
        """Parses a structured entry from Wykaz prac rządu."""
        raw_stage = str(item.get("stage", "WYKAZ_PRAC_RM")).upper()
        stage_map = {
            "PREKONSULTACJE": LegislativeStage.PREKONSULTACJE if hasattr(LegislativeStage, "PREKONSULTACJE") else LegislativeStage.WYKAZ_PRAC_RM,
            "WYKAZ_PRAC_RM": LegislativeStage.WYKAZ_PRAC_RM,
            "KONSULTACJE": LegislativeStage.KONSULTACJE_PUBLICZNE,
            "KONSULTACJE_PUBLICZNE": LegislativeStage.KONSULTACJE_PUBLICZNE,
            "SKRM": LegislativeStage.SKRM,
            "STAŁY_KOMITET": LegislativeStage.SKRM,
            "RADA_MINISTROW": LegislativeStage.RADA_MINISTROW,
            "SEJM": LegislativeStage.SEJM,
            "ZAPOWIEDŹ_MEDIALNA": LegislativeStage.ZAPOWIEDZ_MEDIALNA,
        }
        stage = stage_map.get(raw_stage, LegislativeStage.WYKAZ_PRAC_RM)

        has_skrm = bool(item.get("has_skrm_approval", False) or raw_stage in ("SKRM", "RADA_MINISTROW", "SEJM"))
        assumptions = item.get("key_assumptions") or []
        if isinstance(assumptions, str):
            assumptions = [assumptions]

        return LegislativeInitiative(
            rcl_number=item.get("rcl_number") or item.get("symbol"),
            title=item.get("title", "Projekt aktu prawnego"),
            sponsor_ministry_id=sponsor_ministry_id or item.get("sponsor_ministry_id"),
            lead_official_id=lead_official_id or item.get("lead_official_id"),
            stage=stage,
            has_skrm_approval=has_skrm,
            summary=item.get("summary") or item.get("description"),
            key_assumptions=assumptions,
            source_url=item.get("source_url") or item.get("url"),
        )

    def parse_initiatives_list(
        self,
        items: List[Dict[str, Any]],
        ministry_id_mapping: Optional[Dict[str, UUID]] = None,
    ) -> List[LegislativeInitiative]:
        """Parses a collection of legislative projects."""
        result: List[LegislativeInitiative] = []
        mapping = ministry_id_mapping or {}
        for item in items:
            code = item.get("ministry_code", "")
            sponsor_id = mapping.get(code)
            initiative = self.parse_initiative(item, sponsor_ministry_id=sponsor_id)
            result.append(initiative)
        return result

    async def fetch_wykaz_feed(self, url: str) -> List[LegislativeInitiative]:
        """Asynchronously fetches entries from the Wykaz prac RM JSON endpoint."""
        data = await self.engine.fetch_json(url)
        if not data:
            return []
        items = data if isinstance(data, list) else data.get("items", [])
        return self.parse_initiatives_list(items)
