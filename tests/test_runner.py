"""Unit tests for the autonomous IngestionPipelineRunner."""

from datetime import datetime, timezone
import pytest

from govscope.models.entities import RoleCategory, SourceType, OfficialStatement
from ingest.runner import IngestionPipelineRunner


@pytest.mark.asyncio
async def test_runner_routine_filtering_and_clash_detection():
    runner = IngestionPipelineRunner()
    now = datetime.now(timezone.utc)

    kprm = runner.ministries.get("KPRM")
    mf = runner.ministries.get("MF")
    mrit = runner.ministries.get("MRiT")

    domanski = next((o for o in runner.officials.values() if o.full_name == "Andrzej Domański"), None)
    paszyk = next((o for o in runner.officials.values() if o.full_name == "Krzysztof Paszyk"), None)
    tusk = next((o for o in runner.officials.values() if o.role_category == RoleCategory.PREMIER), None)

    assert domanski is not None
    assert paszyk is not None
    assert tusk is not None

    batch = [
        # 1. Routine statement - should be filtered
        OfficialStatement(
            official_id=tusk.id,
            ministry_id=kprm.id,
            source_type=SourceType.GOV_PL,
            title="Życzenia okolicznościowe",
            content="Najserdeczniejsze życzenia z okazji Dnia Edukacji Narodowej.",
            published_at=now,
        ),
        # 2. Substantive Statement A
        OfficialStatement(
            official_id=domanski.id,
            ministry_id=mf.id,
            source_type=SourceType.MEDIA_INTERVIEW,
            title="Wywiad MF",
            content="Nie poprzemy kredytu 0% w obecnym kształcie, nie ma środków w rezerwie budżetowej.",
            published_at=now,
        ),
        # 3. Conflicting Statement B
        OfficialStatement(
            official_id=paszyk.id,
            ministry_id=mrit.id,
            source_type=SourceType.PRESS_CONFERENCE,
            title="Konferencja MRiT",
            content="Będzie kredyt 0%, program ruszy zgodnie z ustaleniami koalicji w pierwszym kwartale.",
            published_at=now,
        ),
    ]

    conflicts = await runner.process_statements(batch)

    # 1 routine was filtered, so 2 substantive remain
    assert len(runner.stored_statements) == 2
    # Clash between MF (KO) and MRiT (PSL) should be identified
    assert len(conflicts) >= 1
    assert any(c.severity.value == "P1_CRITICAL" for c in conflicts)
    # Alert should be generated
    assert len(runner.active_alerts) >= 1
    assert runner.active_alerts[0].priority == "P1"
