"""Comprehensive tests for Phase 2 (Gemini & Semantic Engine) and Phase 3 (Agency Wires & EU signals)."""

from datetime import datetime, timezone
from uuid import uuid4
import pytest

from govscope.engine.gemini_analyzer import GeminiCohesionAuditor
from govscope.engine.semantic import SemanticVectorIndex, cosine_similarity
from govscope.models.entities import ConflictType, Severity
from ingest.connectors.eu import EUSignalsCollector
from ingest.connectors.wires import AgencyWireCollector


@pytest.mark.asyncio
async def test_gemini_auditor_heuristic_conflict():
    auditor = GeminiCohesionAuditor()

    result = await auditor.analyze_conflict(
        text_a="Nie poprzemy kredytu 0% w obecnym kształcie, nie ma środków w rezerwie.",
        speaker_a="Andrzej Domański",
        party_a="KO",
        text_b="Kredyt 0% zostanie uruchomiony zgodnie z umową koalicyjną.",
        speaker_b="Krzysztof Paszyk",
        party_b="PSL",
        topic="kredyt mieszkaniowy",
    )

    assert result.is_conflict is True
    assert result.conflict_type == ConflictType.NAPIECIE_KOALICYJNE
    assert result.severity == Severity.P1_CRITICAL
    assert "Zderzenie deklaracji w temacie kredyt mieszkaniowy" in result.core_contradiction
    assert "Zwołanie pilnego spotkania" in result.recommended_action
    assert result.confidence_score >= 0.85


@pytest.mark.asyncio
async def test_gemini_auditor_eu_infringement():
    auditor = GeminiCohesionAuditor()

    result = await auditor.analyze_conflict(
        text_a="Wiceminister zapowiada całkowite odrzucenie i zignorowanie dyrektywy ETS2.",
        speaker_a="Miłosz Motyka",
        party_a="PSL",
        text_b="Polska prowadzi negocjacje w Radzie UE zgodnie z procedurami.",
        speaker_b="Adam Szłapka",
        party_b="KO",
        topic="ets2 i dyrektywa klimatyczna",
    )

    assert result.is_conflict is True
    assert result.conflict_type in (ConflictType.ROZDZWIEK_Z_BRUKSELA, ConflictType.NAPIECIE_KOALICYJNE)
    assert result.severity == Severity.P1_CRITICAL


def test_semantic_vector_similarity():
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    v3 = [0.0, 1.0, 0.0]

    assert pytest.approx(cosine_similarity(v1, v2), 0.001) == 1.0
    assert pytest.approx(cosine_similarity(v1, v3), 0.001) == 0.0

    index = SemanticVectorIndex(similarity_threshold=0.8)
    id1 = uuid4()
    id2 = uuid4()

    index.add(id1, "kredyt", [0.9, 0.1, 0.0])
    index.add(id2, "klimat", [0.0, 0.1, 0.9])

    matches = index.search_similar([0.95, 0.05, 0.0], top_k=2)
    assert len(matches) == 1
    assert matches[0][0] == id1
    assert matches[0][1] == "kredyt"


def test_agency_wire_broadcast_window_and_parsing():
    collector = AgencyWireCollector()

    # 1. Check time windows
    dt_morning = datetime(2026, 10, 21, 8, 15, tzinfo=timezone.utc)
    dt_evening = datetime(2026, 10, 21, 18, 0, tzinfo=timezone.utc)
    dt_noon = datetime(2026, 10, 21, 12, 0, tzinfo=timezone.utc)

    assert collector.determine_interview_window(dt_morning) == "MORNING_INTERVIEW_WINDOW"
    assert collector.determine_interview_window(dt_evening) == "EVENING_INTERVIEW_WINDOW"
    assert collector.determine_interview_window(dt_noon) == "GENERAL_DAILY_WIRE"

    # 2. Parse raw wire
    raw_wire = {
        "headline": "Minister Finansów o budżecie",
        "body": "Nie ma zgody na dodatkowe wydatki poza limitem ostrożnościowym.",
        "source_outlet": "PAP",
        "published_at": "2026-10-21T08:20:00Z",
        "category": "GOSPODARKA",
    }
    stmt = collector.parse_wire_item(raw_wire, official_id=uuid4(), ministry_id=uuid4())
    assert stmt.raw_metadata["broadcast_window"] == "MORNING_INTERVIEW_WINDOW"
    assert stmt.raw_metadata["is_prime_time_interview"] is True
    assert "Nie ma zgody" in stmt.content


def test_eu_signals_collector():
    collector = EUSignalsCollector()

    raw_infringement = {
        "title": "Uzasadniona opinia Komisji w sprawie jakości powietrza",
        "directive_ref": "2008/50/EC",
        "stage": "REASONED_OPINION",
        "policy_area": "Środowisko",
        "summary": "Komisja wzywa do pełnego wdrożenia standardów pyłów zawieszonych.",
        "deadline": "2026-12-15",
    }

    signal = collector.parse_infringement_signal(raw_infringement)
    assert signal["is_urgent_risk"] is True
    assert signal["directive_ref"] == "2008/50/EC"
    assert signal["source_system"] == "EU_COMMISSION_INFRINGEMENTS"
