"""Synchronise the active Council of Ministers from the official gov.pl roster."""

from __future__ import annotations

import asyncio
import os
import re
import uuid
from dataclasses import dataclass

import asyncpg

from ingest.engine import AsyncIngestEngine

KPRM_ROSTER_URL = "https://www.gov.pl/web/premier/sklad-rady-ministrow"
KPRM_LEADERSHIP_URL = "https://www.gov.pl/web/premier/kierownictwo-kprm5"
OFFICIAL_NAMESPACE = uuid.UUID("6f9b5b16-8ef8-4ae8-a17b-1ab6b0d7df42")

MINISTRY_LEADERSHIP_URLS: dict[str, str] = {
    "MC": "https://www.gov.pl/web/cyfryzacja/kierownictwo",
    "MFiPR": "https://www.gov.pl/web/fundusze-regiony/kierownictwo-ministerstwa",
    "ME": "https://www.gov.pl/web/energia/kierownictwo",
}

ROLE_SOURCE_URLS: dict[str, str] = {
    "KPRM": KPRM_LEADERSHIP_URL,
    **{code: url for code, url in MINISTRY_LEADERSHIP_URLS.items()},
}

KPRM_MINISTERIAL_POSTS: dict[str, str] = {
    "Adam Szłapka": "Minister do spraw Unii Europejskiej",
    "Katarzyna Kotula": "Minister do spraw Równości",
    "Marzena Okła-Drewnowicz": "Minister do spraw Polityki Senioralnej",
    "Adriana Porowska": "Minister do spraw Społeczeństwa Obywatelskiego",
}


@dataclass(frozen=True)
class CurrentOfficial:
    full_name: str
    role_title: str
    ministry_code: str
    role_category: str
    coalition_party: str


MINISTRY_BY_ROLE: tuple[tuple[str, str], ...] = (
    ("Finansów", "MF"),
    ("Spraw Zagranicznych", "MSZ"),
    ("Obrony Narodowej", "MON"),
    ("Cyfryzacji", "MC"),
    ("Aktywów Państwowych", "MAP"),
    ("Kultury i Dziedzictwa Narodowego", "MKiDN"),
    ("Rodziny, Pracy i Polityki Społecznej", "MRPiPS"),
    ("Klimatu i Środowiska", "MKiŚ"),
    ("Zdrowia", "MZ"),
    ("Edukacji", "MEN"),
    ("Nauki i Szkolnictwa Wyższego", "MNiSW"),
    ("Infrastruktury", "MI"),
    ("Rolnictwa i Rozwoju Wsi", "MRiRW"),
    ("Energii", "ME"),
    ("Funduszy i Polityki Regionalnej", "MFiPR"),
    ("Sportu i Turystyki", "MSiT"),
    ("Rozwoju i Technologii", "MRiT"),
    ("Sprawiedliwości", "MS"),
    ("Spraw Wewnętrznych i Administracji", "MSWiA"),
)


def parse_roster(html: str) -> list[CurrentOfficial]:
    """Parse the stable title/position blocks used by gov.pl.

    The parser deliberately returns no records when the page shape changes. This
    prevents a broken upstream page from deactivating the current database roster.
    """
    blocks = re.findall(
        r'<div class="title">\s*<a[^>]*>\s*([^<]+?)\s*</a>\s*</div>\s*'
        r'<div class="position">\s*([^<]+?)\s*</div>',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    result: list[CurrentOfficial] = []
    for raw_name, raw_role in blocks:
        name = re.sub(r"\s+", " ", raw_name).strip()
        role = re.sub(r"\s+", " ", raw_role).strip().rstrip(".")
        if not name or not role:
            continue
        ministry_code = next((code for label, code in MINISTRY_BY_ROLE if label in role), "")
        if not ministry_code and ("Prezes Rady Ministrów" in role or "Szef Kancelarii" in role):
            ministry_code = "KPRM"
        if not ministry_code:
            continue
        role_category = "WICEPREMIER" if "Wiceprezes Rady Ministrów" in role else "MINISTER"
        party = "PSL" if name in {"Władysław Kosiniak-Kamysz", "Dariusz Klimczak", "Stefan Krajewski", "Miłosz Motyka"} else "NON_PARTISAN"
        if name in {"Donald Tusk", "Radosław Sikorski", "Krzysztof Gawkowski", "Marcin Kierwiński", "Waldemar Żurek", "Wojciech Balczun", "Marta Cienkowska", "Andrzej Domański", "Agnieszka Dziemianowicz-Bąk", "Jan Grabiec", "Barbara Nowacka", "Marcin Kulasek", "Krzysztof Paszyk", "Jakub Rutnicki"}:
            party = "KO" if name not in {"Marcin Kulasek"} else "NOWA_LEWICA"
        if name in {"Paulina Hennig-Kloska", "Katarzyna Pełczyńska-Nałęcz"}:
            party = "POLSKA_2050"
        result.append(CurrentOfficial(name, role, ministry_code, role_category, party))
    return result


def _role_category(role: str) -> str:
    normalized = role.casefold()
    if "podsekretarz stanu" in normalized:
        return "WICEMINISTER"
    if "sekretarz stanu" in normalized:
        return "WICEMINISTER"
    if "wicepremier" in normalized or "wiceprezes rady ministrów" in normalized:
        return "WICEPREMIER"
    if "minister" in normalized:
        return "MINISTER"
    if "dyrektor general" in normalized:
        return "DYREKTOR_GENERALNY"
    if "rzecznik" in normalized:
        return "RZECZNIK"
    return ""


def parse_leadership_page(html: str, default_ministry_code: str) -> list[CurrentOfficial]:
    """Parse the leadership cards published on a ministry or KPRM page.

    Gov.pl uses both ``position`` and ``intro`` for the role element. The
    parser is intentionally source-bound: if the card shape changes or a card
    has no governmental role, it is ignored instead of inventing a person.
    """
    blocks = re.findall(
        r'<div class="title">\s*<a[^>]*>\s*([^<]+?)\s*</a>\s*</div>\s*'
        r'<div class="(?:position|intro)">\s*([^<]+?)\s*</div>',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    result: list[CurrentOfficial] = []
    seen: set[str] = set()
    for raw_name, raw_role in blocks:
        name = re.sub(r"\s+", " ", raw_name).strip()
        role = re.sub(r"\s+", " ", raw_role).strip().rstrip(".")
        category = _role_category(role)
        if default_ministry_code == "KPRM" and name in KPRM_MINISTERIAL_POSTS:
            role = KPRM_MINISTERIAL_POSTS[name]
            category = "MINISTER"
        if not name or not role or not category or name in seen:
            continue
        ministry_code = next((code for label, code in MINISTRY_BY_ROLE if label in role), default_ministry_code)
        party = {
            "Krzysztof Gawkowski": "NOWA_LEWICA",
            "Dariusz Standerski": "NOWA_LEWICA",
            "Paweł Olszewski": "KO",
            "Michał Gramatyka": "POLSKA_2050",
            "Katarzyna Pełczyńska-Nałęcz": "POLSKA_2050",
            "Jacek Karnowski": "KO",
            "Jan Szyszko": "POLSKA_2050",
            "Miłosz Motyka": "PSL",
            "Adam Szłapka": "KO",
            "Katarzyna Kotula": "NOWA_LEWICA",
            "Adriana Porowska": "POLSKA_2050",
        }.get(name, "NON_PARTISAN")
        result.append(CurrentOfficial(name, role, ministry_code, category, party))
        seen.add(name)
    return result


async def sync_administration(engine: AsyncIngestEngine | None = None) -> int:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required for administration sync")
    client = engine or AsyncIngestEngine()
    html = await client.fetch(KPRM_ROSTER_URL)
    officials = parse_roster(html or "")
    if len(officials) < 10:
        raise RuntimeError("Official roster response was incomplete; refusing to change active officials")
    leadership_html = await client.fetch(KPRM_LEADERSHIP_URL)
    kprm_leadership = parse_leadership_page(leadership_html or "", "KPRM")
    ministry_leadership: dict[str, list[CurrentOfficial]] = {}
    for ministry_code, url in MINISTRY_LEADERSHIP_URLS.items():
        page = await client.fetch(url)
        parsed = parse_leadership_page(page or "", ministry_code)
        if parsed:
            ministry_leadership[ministry_code] = parsed
    current_officials = {official.full_name: official for official in officials}
    current_officials.update({official.full_name: official for official in kprm_leadership})
    for page_officials in ministry_leadership.values():
        current_officials.update({official.full_name: official for official in page_officials})
    pool = await asyncpg.create_pool(database_url, min_size=1, max_size=2)
    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                previous_rows = await connection.fetch(
                    """SELECT officials.id, officials.full_name, officials.role_title,
                              officials.role_category, officials.ministry_id, officials.is_active,
                              ministries_and_bodies.code AS ministry_code
                       FROM officials
                       LEFT JOIN ministries_and_bodies ON ministries_and_bodies.id = officials.ministry_id
                       WHERE officials.is_active = TRUE"""
                )
                await connection.execute(
                    "UPDATE officials SET is_active = FALSE, updated_at = NOW() WHERE role_category IN ('MINISTER', 'WICEPREMIER')"
                )
                if kprm_leadership:
                    await connection.execute(
                        """UPDATE officials SET is_active = FALSE, updated_at = NOW()
                           WHERE ministry_id = (SELECT id FROM ministries_and_bodies WHERE code = 'KPRM')
                             AND role_category IN ('WICEMINISTER', 'PELNOMOCNIK', 'RZECZNIK', 'DYREKTOR_GENERALNY')"""
                    )
                for ministry_code in ministry_leadership:
                    await connection.execute(
                        """UPDATE officials SET is_active = FALSE, updated_at = NOW()
                           WHERE ministry_id = (SELECT id FROM ministries_and_bodies WHERE code = $1)
                             AND role_category IN ('MINISTER', 'WICEPREMIER', 'WICEMINISTER', 'PELNOMOCNIK', 'RZECZNIK', 'DYREKTOR_GENERALNY')""",
                        ministry_code,
                    )
                for official in current_officials.values():
                    existing_id = await connection.fetchval(
                        "SELECT id FROM officials WHERE full_name = $1 ORDER BY is_active DESC, updated_at DESC LIMIT 1",
                        official.full_name,
                    )
                    official_id = existing_id or uuid.uuid5(OFFICIAL_NAMESPACE, official.full_name)
                    await connection.execute(
                        """INSERT INTO officials
                           (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
                           SELECT $1, id, $2, $3, $4, $5, ARRAY[]::TEXT[], TRUE
                           FROM ministries_and_bodies WHERE code = $6
                           ON CONFLICT (id) DO UPDATE SET ministry_id = EXCLUDED.ministry_id,
                             full_name = EXCLUDED.full_name, role_title = EXCLUDED.role_title,
                             role_category = EXCLUDED.role_category, coalition_party = EXCLUDED.coalition_party,
                             is_active = TRUE, updated_at = NOW()""",
                        official_id, official.full_name, official.role_title, official.role_category,
                        official.coalition_party, official.ministry_code,
                    )

                # Keep an auditable source-bound record whenever the current
                # roster changes. The current tables remain optimized for the
                # live drawer; history explains why someone disappeared from it.
                for previous in previous_rows:
                    current = await connection.fetchrow(
                        """SELECT id, role_title, role_category, ministry_id, is_active
                           FROM officials
                           WHERE full_name = $1
                           ORDER BY is_active DESC, updated_at DESC
                           LIMIT 1""",
                        previous["full_name"],
                    )
                    if not current:
                        continue
                    status_changed = bool(previous["is_active"]) != bool(current["is_active"])
                    role_changed = (
                        previous["role_title"] != current["role_title"]
                        or previous["role_category"] != current["role_category"]
                        or previous["ministry_id"] != current["ministry_id"]
                    )
                    if not status_changed and not role_changed:
                        continue
                    source_code = current_officials[previous["full_name"]].ministry_code \
                        if previous["full_name"] in current_officials else str(previous["ministry_code"] or "KPRM")
                    source_url = ROLE_SOURCE_URLS.get(source_code, KPRM_ROSTER_URL)
                    await connection.execute(
                        """INSERT INTO official_role_history
                           (official_id, ministry_id, full_name, role_title, role_category,
                            status, effective_at, source_url, change_reason)
                           VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)""",
                        current["id"], current["ministry_id"], previous["full_name"],
                        current["role_title"], current["role_category"],
                        "ACTIVE" if current["is_active"] else "INACTIVE", source_url,
                        "Zmiana funkcji lub resortu" if current["is_active"] else "Brak osoby w aktualnym źródle",
                    )
    finally:
        await pool.close()
        await client.close()
    return len(current_officials)


async def main() -> None:
    count = await sync_administration()
    print(f"Administration sync completed: {count} officials")


if __name__ == "__main__":
    asyncio.run(main())
