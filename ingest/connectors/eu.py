"""European Union signals and infringement monitor for the Minister for EU Affairs."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from ingest.engine import AsyncIngestEngine

logger = logging.getLogger("govscope.ingest.eu")


class EUSignalsCollector:
    """Monitors European Council conclusions, Commission infringement packets, and directives."""

    def __init__(self, engine: Optional[AsyncIngestEngine] = None) -> None:
        self.engine = engine or AsyncIngestEngine()

    def parse_infringement_signal(self, raw_item: Dict[str, Any]) -> Dict[str, Any]:
        """Parses EU formal notice or reasoned opinion."""
        directive = raw_item.get("directive_ref", "Brak numeru")
        title = raw_item.get("title", "Postępowanie naruszeniowe")
        area = raw_item.get("policy_area", "Środowisko i klimat")
        is_urgent = raw_item.get("stage") in ("REASONED_OPINION", "REFERRAL_CJEU")

        return {
            "id": str(uuid4()),
            "title": title,
            "directive_ref": directive,
            "policy_area": area,
            "stage": raw_item.get("stage", "LETTER_FORMAL_NOTICE"),
            "is_urgent_risk": is_urgent,
            "summary": raw_item.get("summary", ""),
            "deadline": raw_item.get("deadline"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "source_system": "EU_COMMISSION_INFRINGEMENTS",
        }

    def parse_council_conclusion(self, raw_item: Dict[str, Any]) -> Dict[str, Any]:
        """Parses conclusions of the Council of the European Union."""
        return {
            "id": str(uuid4()),
            "council_configuration": raw_item.get("configuration", "General Affairs Council"),
            "title": raw_item.get("title", "Konkluzje Rady"),
            "adopted_at": raw_item.get("adopted_at", datetime.now(timezone.utc).isoformat()),
            "key_commitments": raw_item.get("key_commitments", []),
            "polish_negotiation_mandate": raw_item.get("pl_mandate", "Zgodny z linią KPRM"),
        }
