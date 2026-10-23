"""Comprehensive tests for GOVscope engine, models, and deduplication."""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest

from govscope.dedup.minhash import MinHash, MinHashLSHIndex, shingle
from govscope.engine.cohesion import CohesionEngine
from govscope.ingest.collectors import MediaInterviewWireCollector, RCLCollector
from govscope.models.entities import (
    CoalitionParty,
    ConflictType,
    LegislativeInitiative,
    LegislativeStage,
    Ministry,
    Official,
    OfficialStatement,
    RoleCategory,
    Severity,
    SourceType,
    TargetAudience,
)


def test_minhash_deduplication():
    text_a = "Kancelaria Prezesa Rady Ministrów informuje o zwołaniu posiedzenia rządu w sprawie budżetu państwa."
    text_b = "Kancelaria Prezesa Rady Ministrów informuje o zwołaniu posiedzenia rządu w sprawie budżetu państwa i wydatków."
    text_c = "Ministerstwo Rolnictwa ogłasza dopłaty do nawozów dla producentów zbóż."

    minhash = MinHash(num_perm=64)
    sig_a = minhash.compute_signature(shingle(text_a, k=2))
    sig_b = minhash.compute_signature(shingle(text_b, k=2))
    sig_c = minhash.compute_signature(shingle(text_c, k=2))

    sim_ab = MinHash.jaccard_similarity(sig_a, sig_b)
    sim_ac = MinHash.jaccard_similarity(sig_a, sig_c)

    assert sim_ab > 0.5
    assert sim_ac < 0.2

    index = MinHashLSHIndex(num_perm=64, bands=8, threshold=0.5)
    index.insert("doc_a", sig_a)
    matches = index.query(sig_b)
    assert "doc_a" in matches


def test_routine_announcement_filter():
    engine = CohesionEngine()

    is_routine_1, reason_1 = engine.is_routine_announcement("Życzenia z okazji Dnia Edukacji Narodowej przekazuje minister.")
    assert is_routine_1 is True
    assert reason_1 is not None

    is_routine_2, reason_2 = engine.is_routine_announcement("Wiceminister zapowiada rewolucję w podatkach od nieruchomości.")
    assert is_routine_2 is False
    assert reason_2 is None


def test_trial_balloon_detection():
    engine = CohesionEngine()

    initiative = LegislativeInitiative(
        rcl_number="UD123",
        title="Projekt ustawy o nowym podatku cyfrowym",
        stage=LegislativeStage.ZAPOWIEDZ_MEDIALNA,
        has_skrm_approval=False,
        summary="Jednostronna zapowiedź medialna bez ustaleń z KPRM i MF.",
    )

    conflict = engine.evaluate_legislative_initiative(initiative)
    assert conflict is not None
    assert conflict.conflict_type == ConflictType.BALON_PROBNY
    assert conflict.severity == Severity.P2_HIGH
    assert "bez akceptacji SKRM" in conflict.title


def test_inter_ministerial_coalition_friction():
    engine = CohesionEngine()
    now = datetime.now(timezone.utc)

    min_mf = Ministry(code="MF", name_pl="Ministerstwo Finansów", short_name="MF")
    min_mrit = Ministry(code="MRiT", name_pl="Ministerstwo Rozwoju i Technologii", short_name="MRiT")

    # Official A (KO)
    official_a = Official(
        ministry_id=min_mf.id,
        full_name="Andrzej Domański",
        role_title="Minister Finansów",
        role_category=RoleCategory.MINISTER,
        coalition_party=CoalitionParty.KO,
    )

    # Official B (PSL)
    official_b = Official(
        ministry_id=min_mrit.id,
        full_name="Krzysztof Paszyk",
        role_title="Minister Rozwoju i Technologii",
        role_category=RoleCategory.MINISTER,
        coalition_party=CoalitionParty.PSL,
    )

    stmt_a = OfficialStatement(
        official_id=official_a.id,
        ministry_id=min_mf.id,
        source_type=SourceType.MEDIA_INTERVIEW,
        title="Wywiad w radiu",
        content="Nie poprzemy kredytu 0% w obecnym kształcie, nie ma środków w rezerwie na ten program.",
        published_at=now,
    )

    stmt_b = OfficialStatement(
        official_id=official_b.id,
        ministry_id=min_mrit.id,
        source_type=SourceType.PRESS_CONFERENCE,
        title="Konferencja prasowa",
        content="Będzie kredyt 0%, program ruszy zgodnie z ustaleniami rządu w pierwszym kwartale.",
        published_at=now + timedelta(hours=4),
    )

    conflict = engine.evaluate_inter_ministerial_cohesion(stmt_a, official_a, stmt_b, official_b)
    assert conflict is not None
    assert conflict.conflict_type == ConflictType.NAPIECIE_KOALICYJNE
    assert conflict.severity == Severity.P1_CRITICAL

    alert = engine.generate_alert_for_conflict(conflict)
    assert alert.priority == "P1"
    assert alert.target_audience == TargetAudience.KPRM_PREMIER


def test_current_prime_minister_line_is_primary_baseline():
    engine = CohesionEngine()
    now = datetime.now(timezone.utc)
    pm_ministry = Ministry(code="KPRM", name_pl="Kancelaria Prezesa Rady Ministrów", short_name="KPRM")
    pm = Official(
        ministry_id=pm_ministry.id,
        full_name="Donald Tusk",
        role_title="Prezes Rady Ministrów",
        role_category=RoleCategory.PREMIER,
        coalition_party=CoalitionParty.KO,
    )
    minister = Official(
        ministry_id=uuid4(),
        full_name="Minister Testowy",
        role_title="Minister",
        role_category=RoleCategory.MINISTER,
        coalition_party=CoalitionParty.PSL,
    )
    pm_statement = OfficialStatement(
        official_id=pm.id,
        ministry_id=pm_ministry.id,
        source_type=SourceType.PRESS_CONFERENCE,
        title="Konferencja premiera",
        content="Rząd nie przyjmie relokacji migrantów w ramach paktu migracyjnego.",
        published_at=now - timedelta(days=2),
    )
    minister_statement = OfficialStatement(
        official_id=minister.id,
        ministry_id=minister.ministry_id or uuid4(),
        source_type=SourceType.MEDIA_INTERVIEW,
        title="Wywiad ministra",
        content="Rząd przyjmie relokację migrantów w ramach paktu migracyjnego.",
        published_at=now,
    )

    conflict = engine.evaluate_against_prime_minister_line(
        minister_statement,
        minister,
        prime_minister_statements=[pm_statement],
    )

    assert conflict is not None
    assert conflict.conflict_type == ConflictType.SPRZECZNOSC_Z_EXPOSE
    assert conflict.title == "Sprzeczność z linią premiera: pakt migracyjny"
    assert conflict.severity == Severity.P1_CRITICAL
    assert conflict.gemini_analysis["baseline"] == "CURRENT_PRIME_MINISTER_STATEMENTS"


def test_prime_minister_line_does_not_use_stale_statement():
    engine = CohesionEngine()
    now = datetime.now(timezone.utc)
    official = Official(
        full_name="Minister Testowy",
        role_title="Minister",
        role_category=RoleCategory.MINISTER,
        coalition_party=CoalitionParty.KO,
    )
    old_pm_statement = OfficialStatement(
        official_id=uuid4(),
        ministry_id=uuid4(),
        source_type=SourceType.PRESS_CONFERENCE,
        title="Dawna wypowiedź premiera",
        content="Rząd nie wdroży ETS2.",
        published_at=now - timedelta(days=120),
    )
    statement = OfficialStatement(
        official_id=official.id,
        ministry_id=uuid4(),
        source_type=SourceType.PRESS_CONFERENCE,
        title="Aktualna wypowiedź ministra",
        content="Rząd wdroży ETS2 zgodnie z harmonogramem.",
        published_at=now,
    )

    assert engine.evaluate_against_prime_minister_line(statement, official, [old_pm_statement]) is None


def test_external_attack_is_pressure_signal_not_fact():
    engine = CohesionEngine()
    conflict = engine.evaluate_government_attack(
        article_title="Opozycja mówi o skandalu i żąda dymisji ministra",
        article_content="Materiał zarzuca rządowi kłamstwo i ukrywanie danych dotyczących budżetu.",
        source_name="PAP",
        source_url="https://example.test/article",
    )

    assert conflict is not None
    assert conflict.conflict_type == ConflictType.ATAK_NA_RZAD
    assert conflict.gemini_analysis["allegation_is_not_established_fact"] is True
    assert conflict.gemini_analysis["requires_official_fact_check"] is True


def test_risky_statement_requires_evidence_before_factual_label():
    engine = CohesionEngine()
    official = Official(
        full_name="Minister Testowy",
        role_title="Minister",
        role_category=RoleCategory.MINISTER,
        coalition_party=CoalitionParty.KO,
    )
    statement = OfficialStatement(
        official_id=official.id,
        ministry_id=uuid4(),
        source_type=SourceType.PRESS_CONFERENCE,
        title="Konferencja",
        content="Gwarantuję, że wszyscy dostaną świadczenie bez żadnych kosztów.",
        published_at=datetime.now(timezone.utc),
    )

    risk = engine.evaluate_statement_integrity(statement, official)
    assert risk is not None
    assert risk.conflict_type == ConflictType.RYZYKO_FAKTUALNE
    assert risk.severity == Severity.P2_HIGH
    assert risk.gemini_analysis["claim_status"] == "REQUIRES_VERIFICATION"

    contradiction = engine.evaluate_statement_integrity(
        statement,
        official,
        factual_evidence=[
            {
                "source_name": "Dane publiczne",
                "source_url": "https://example.test/data",
                "supports_claim": "false",
            }
        ],
    )
    assert contradiction is not None
    assert contradiction.severity == Severity.P1_CRITICAL
    assert contradiction.gemini_analysis["claim_status"] == "CONTRADICTED_WITH_EVIDENCE"


def test_eu_alignment_and_infringement_risk():
    engine = CohesionEngine()
    official = Official(
        full_name="Jan Kowalski",
        role_title="Wiceminister Klimatu",
        role_category=RoleCategory.WICEMINISTER,
        coalition_party=CoalitionParty.POLSKA_2050,
    )

    stmt = OfficialStatement(
        official_id=official.id,
        ministry_id=uuid4(),
        source_type=SourceType.MEDIA_INTERVIEW,
        title="Wywiad o ETS2",
        content="Polska całkowicie zignoruje ETS2, to odrzucenie dyrektywy bez względu na decyzje w Brukseli.",
        published_at=datetime.now(timezone.utc),
    )

    conflict = engine.evaluate_eu_alignment(stmt, official)
    assert conflict is not None
    assert conflict.conflict_type == ConflictType.RYZYKO_PROCEDURY_NARUSZENIOWEJ
    assert conflict.severity == Severity.P1_CRITICAL

    alert = engine.generate_alert_for_conflict(conflict)
    assert alert.target_audience == TargetAudience.MINISTER_UE


def test_interview_blunder_and_aggression():
    engine = CohesionEngine()
    official = Official(
        full_name="Piotr Nowak",
        role_title="Podsekretarz Stanu",
        role_category=RoleCategory.WICEMINISTER,
        coalition_party=CoalitionParty.NOWA_LEWICA,
    )

    stmt_blunder = OfficialStatement(
        official_id=official.id,
        ministry_id=uuid4(),
        source_type=SourceType.MEDIA_INTERVIEW,
        title="Poranna rozmowa RMF",
        content="Szczerze mówiąc, nie wiem co mówił premier w tej sprawie na konferencji prasowej.",
        published_at=datetime.now(timezone.utc),
    )

    conflict_blunder = engine.evaluate_interview_risks(stmt_blunder, official)
    assert conflict_blunder is not None
    assert conflict_blunder.conflict_type == ConflictType.BLAD_W_WYWIADZIE

    stmt_aggression = OfficialStatement(
        official_id=official.id,
        ministry_id=uuid4(),
        source_type=SourceType.MEDIA_INTERVIEW,
        title="Wywiad telewizyjny",
        content="Przedsiębiorcy kombinują z podatkami i to jest główny problem budżetu.",
        published_at=datetime.now(timezone.utc),
    )

    conflict_aggr = engine.evaluate_interview_risks(stmt_aggression, official)
    assert conflict_aggr is not None
    assert conflict_aggr.conflict_type == ConflictType.AGRESJA_WOBEC_GRUP_SPOLECZNYCH
    assert conflict_aggr.severity == Severity.P1_CRITICAL


def test_collectors():
    rcl_collector = RCLCollector()
    parsed = rcl_collector.parse_initiative({
        "rcl_number": "UD999",
        "title": "Ustawa o ochronie ludności",
        "stage": "WYKAZ_PRAC_RM",
        "has_skrm_approval": True,
        "key_assumptions": ["Wzmocnienie obrony cywilnej"],
    })
    assert parsed.rcl_number == "UD999"
    assert parsed.stage == LegislativeStage.WYKAZ_PRAC_RM
    assert parsed.has_skrm_approval is True

    wire_collector = MediaInterviewWireCollector()
    quote = wire_collector.parse_quote(
        official_id=uuid4(),
        ministry_id=uuid4(),
        outlet_name="Polskie Radio 24",
        title="Poranek PR24",
        quote_text="Przygotowaliśmy nowe rozwiązania dla rodzin.",
    )
    assert quote.source_type == SourceType.MEDIA_INTERVIEW
    assert quote.raw_metadata["outlet_name"] == "Polskie Radio 24"
