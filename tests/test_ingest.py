"""Unit tests for the GOVscope async ingestion engine, connectors, and administration seed."""

from datetime import datetime, timezone
from uuid import UUID, uuid4
import pytest
import httpx

from govscope.models.entities import (
    CoalitionParty,
    LegislativeStage,
    RoleCategory,
    SourceType,
)
from ingest.connectors.govpl import GovPlCollector
from ingest.connectors.rcl import WykazPracCollector
from ingest.engine import AsyncIngestEngine, RateLimiter
from ingest.administration import parse_roster
from ingest.seed import (
    get_reference_ministries,
    get_reference_officials,
)


@pytest.mark.asyncio
async def test_rate_limiter_throttling():
    limiter = RateLimiter(requests_per_second=10.0)
    url = "https://www.gov.pl/web/premier"

    # Rapid calls to the same domain should be throttled smoothly
    t0 = datetime.now(timezone.utc)
    for _ in range(3):
        await limiter.throttle(url)
    t1 = datetime.now(timezone.utc)
    elapsed = (t1 - t0).total_seconds()
    # At 10 req/s, 3 calls take at least ~0.15-0.2s
    assert elapsed >= 0.15


@pytest.mark.asyncio
async def test_ingest_engine_retry_and_backoff(monkeypatch):
    engine = AsyncIngestEngine(max_retries=2, timeout=1.0)
    attempt_count = 0

    async def mock_get(self, url, headers=None):
        nonlocal attempt_count
        attempt_count += 1
        raise httpx.ConnectError("Connection refused by test host")

    monkeypatch.setattr(httpx.AsyncClient, "get", mock_get)

    result = await engine.fetch("https://invalid-host.gov.pl/test")
    assert result is None
    assert attempt_count == 2  # Retried up to max_retries


def test_govpl_rss_parsing():
    sample_rss = """<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
    <channel>
        <title>KPRM - Wiadomości</title>
        <link>https://www.gov.pl/web/premier</link>
        <description>Oficjalne komunikaty KPRM</description>
        <item>
            <title>Posiedzenie Rady Ministrów w sprawie budżetu</title>
            <link>https://www.gov.pl/web/premier/posiedzenie-rm-budzet</link>
            <description>Rząd przyjął wstępne założenia budżetowe na kolejny rok.</description>
            <pubDate>Wed, 21 Oct 2026 14:00:00 +0200</pubDate>
        </item>
        <item>
            <title>Konferencja Premiera po posiedzeniu rządu</title>
            <link>https://www.gov.pl/web/premier/konferencja-premiera</link>
            <description>Premier Donald Tusk przedstawił priorytety inwestycyjne.</description>
            <pubDate>Wed, 21 Oct 2026 16:30:00 +0200</pubDate>
        </item>
    </channel>
    </rss>
    """
    collector = GovPlCollector()
    ministry_id = uuid4()
    official_id = uuid4()

    statements = collector.parse_rss_feed(sample_rss, ministry_id=ministry_id, default_official_id=official_id)
    assert len(statements) == 2

    st1 = statements[0]
    assert st1.title == "Posiedzenie Rady Ministrów w sprawie budżetu"
    assert "przyjął wstępne założenia" in st1.content
    assert st1.source_type == SourceType.GOV_PL
    assert st1.ministry_id == ministry_id
    assert st1.official_id == official_id
    assert st1.source_url == "https://www.gov.pl/web/premier/posiedzenie-rm-budzet"


def test_current_government_roster_parser_is_source_bound():
    html = """
    <div class="title"><a href="/web/premier/milosz-motyka"> Miłosz Motyka </a></div>
    <div class="position">Minister Energii </div>
    <div class="title"><a href="/web/premier/stefan-krajewski"> Stefan Krajewski </a></div>
    <div class="position">Minister Rolnictwa i Rozwoju Wsi </div>
    """
    officials = parse_roster(html)
    assert [(item.full_name, item.ministry_code) for item in officials] == [
        ("Miłosz Motyka", "ME"),
        ("Stefan Krajewski", "MRiRW"),
    ]
    assert parse_roster("<html>upstream changed</html>") == []


def test_wykaz_prac_legislative_parsing():
    collector = WykazPracCollector()
    min_id = uuid4()
    lead_id = uuid4()

    raw_project = {
        "rcl_number": "UD145",
        "title": "Projekt ustawy o zmianie ustawy o podatku od towarów i usług",
        "stage": "SKRM",
        "has_skrm_approval": True,
        "summary": "Doprecyzowanie stawek podatku dla sektora OZE.",
        "key_assumptions": ["Ujednolicenie definicji", "Ulgi dla małych biogazowni"],
        "source_url": "https://legislacja.gov.pl/projekt/UD145",
    }

    initiative = collector.parse_initiative(
        raw_project,
        sponsor_ministry_id=min_id,
        lead_official_id=lead_id,
    )

    assert initiative.rcl_number == "UD145"
    assert initiative.stage == LegislativeStage.SKRM
    assert initiative.has_skrm_approval is True
    assert len(initiative.key_assumptions) == 2
    assert initiative.sponsor_ministry_id == min_id
    assert initiative.lead_official_id == lead_id


def test_deterministic_seed_coverage():
    ministries = get_reference_ministries()
    officials = get_reference_officials()

    # 1. Zero exclusion: KPRM + 19 ministries + committees
    assert len(ministries) == 27
    codes = {m.code for m in ministries}
    expected_core = {"KPRM", "MF", "MSZ", "MON", "MSWiA", "MS", "MAP", "MRiT", "MKiŚ", "MRPiPS", "MZ", "MEN", "MNiSW", "MI", "MRiRW", "MC", "MKiDN", "MSiT", "MP", "M_UE"}
    for exp in expected_core:
        assert exp in codes, f"Missing ministry: {exp}"

    # 2. Coalition parties coverage
    parties = {m.coalition_party for m in ministries if m.coalition_party}
    assert CoalitionParty.KO in parties
    assert CoalitionParty.PSL in parties
    assert CoalitionParty.POLSKA_2050 in parties
    assert CoalitionParty.NOWA_LEWICA in parties

    # 3. Constitutional ministers mapping
    premier = next((o for o in officials if o.role_category == RoleCategory.PREMIER), None)
    assert premier is not None
    assert premier.full_name == "Donald Tusk"
    assert premier.coalition_party == CoalitionParty.KO

    vice_premiers = [o for o in officials if o.role_category == RoleCategory.WICEPREMIER]
    assert len(vice_premiers) >= 2
    vp_names = {vp.full_name for vp in vice_premiers}
    assert "Władysław Kosiniak-Kamysz" in vp_names
    assert "Krzysztof Gawkowski" in vp_names
