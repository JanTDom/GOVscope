"""Gemini-powered semantic cohesion and political risk auditor for KPRM."""

from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, Optional
import httpx
from pydantic import BaseModel, Field

from govscope.models.entities import ConflictType, Severity

logger = logging.getLogger("govscope.engine.gemini")


class GeminiAuditResult(BaseModel):
    """Structured audit response from Gemini AI reasoning engine."""

    is_conflict: bool
    conflict_type: Optional[ConflictType] = None
    severity: Optional[Severity] = None
    core_contradiction: str = Field(description="Sedno sprzeczności merytorycznej lub politycznej")
    coalition_risk: str = Field(description="Ocena ryzyka dla stabilności koalicji i wizerunku premiera")
    recommended_action: str = Field(description="Zalecane natychmiastowe działanie KPRM")
    confidence_score: float = Field(ge=0.0, le=1.0, default=0.9)


class GeminiCohesionAuditor:
    """Performs deep logical contradiction analysis using Gemini generative models."""

    GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")

    def build_system_prompt(self) -> str:
        return (
            "Jesteś starszym doradcą ds. spójności komunikacyjnej i ryzyka politycznego w Kancelarii Prezesa Rady Ministrów (KPRM). "
            "Twoim zadaniem jest bezstronna ocena czy dwie wypowiedzi lub inicjatywy członków rządu są ze sobą sprzeczne, "
            "czy stanowią balon próbny bez zgody KPRM, czy generują kakofonię resortową lub kolidują z polskim stanowiskiem w Brukseli. "
            "Odpowiedz wyłącznie w formacie JSON zgodnym ze schematem: "
            "{'is_conflict': bool, 'conflict_type': str, 'severity': str, 'core_contradiction': str, 'coalition_risk': str, 'recommended_action': str, 'confidence_score': float}."
        )

    def heuristic_audit(
        self,
        text_a: str,
        speaker_a: str,
        party_a: str,
        text_b: str,
        speaker_b: str,
        party_b: str,
        topic: str,
    ) -> GeminiAuditResult:
        """Deterministic fallback analysis when Gemini API key is absent or unreachable."""
        combined = f"{text_a} {text_b}".lower()
        is_different_party = party_a != party_b

        has_negation = any(
            pair[0] in combined and pair[1] in combined
            for pair in [
                ("kredyt", "nie ma środków"),
                ("będzie", "nie ma zgody"),
                ("obniżka", "brak poparcia"),
                ("podatki", "nie poprzemy"),
                ("ets2", "odrzucenie"),
                ("dyrektyw", "zignorujemy"),
            ]
        )

        if has_negation:
            conflict_type = (
                ConflictType.ROZDZWIEK_Z_BRUKSELA
                if "ets2" in combined or "dyrektyw" in combined
                else (ConflictType.NAPIECIE_KOALICYJNE if is_different_party else ConflictType.KAKOFONIA_RESORTOWA)
            )
            severity = (
                Severity.P1_CRITICAL
                if is_different_party or conflict_type == ConflictType.ROZDZWIEK_Z_BRUKSELA
                else Severity.P2_HIGH
            )
            return GeminiAuditResult(
                is_conflict=True,
                conflict_type=conflict_type,
                severity=severity,
                core_contradiction=f"Zderzenie deklaracji w temacie {topic}: {speaker_a} ({party_a}) vs {speaker_b} ({party_b}).",
                coalition_risk="Wysokie ryzyko eskalacji sporu w mediach przed posiedzeniem Rady Ministrów.",
                recommended_action="Zwołanie pilnego spotkania koordynacyjnego na szczeblu KPRM.",
                confidence_score=0.92,
            )

        return GeminiAuditResult(
            is_conflict=False,
            core_contradiction="Brak bezpośrednich sprzeczności logicznych.",
            coalition_risk="Brak istotnego ryzyka narracyjnego.",
            recommended_action="Dalszy rutynowy monitoring.",
            confidence_score=0.85,
        )

    async def analyze_conflict(
        self,
        text_a: str,
        speaker_a: str,
        party_a: str,
        text_b: str,
        speaker_b: str,
        party_b: str,
        topic: str,
    ) -> GeminiAuditResult:
        """Audits potential clash between two statements asynchronously."""
        if not self.api_key:
            return self.heuristic_audit(text_a, speaker_a, party_a, text_b, speaker_b, party_b, topic)

        prompt = (
            f"Oceń spójność dwóch wypowiedzi na temat: {topic}.\n\n"
            f"Wypowiedź 1 ({speaker_a}, partia {party_a}):\n\"{text_a}\"\n\n"
            f"Wypowiedź 2 ({speaker_b}, partia {party_b}):\n\"{text_b}\"\n"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": self.build_system_prompt()},
                        {"text": prompt},
                    ]
                }
            ],
            "generationConfig": {"temperature": 0.1, "responseMimeType": "application/json"},
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.GEMINI_ENDPOINT}?key={self.api_key}",
                    json=payload,
                )
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        raw_json_str = candidates[0]["content"]["parts"][0]["text"]
                        parsed = json.loads(raw_json_str)
                        return GeminiAuditResult.model_validate(parsed)
                logger.warning("Gemini API error %d. Falling back to deterministic auditor.", res.status_code)
        except Exception as exc:
            logger.warning("Gemini call failed (%s). Using fallback auditor.", exc)

        return self.heuristic_audit(text_a, speaker_a, party_a, text_b, speaker_b, party_b, topic)
