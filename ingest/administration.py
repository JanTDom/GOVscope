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
OFFICIAL_NAMESPACE = uuid.UUID("6f9b5b16-8ef8-4ae8-a17b-1ab6b0d7df42")


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


async def sync_administration(engine: AsyncIngestEngine | None = None) -> int:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required for administration sync")
    client = engine or AsyncIngestEngine()
    html = await client.fetch(KPRM_ROSTER_URL)
    officials = parse_roster(html or "")
    if len(officials) < 10:
        raise RuntimeError("Official roster response was incomplete; refusing to change active officials")
    pool = await asyncpg.create_pool(database_url, min_size=1, max_size=2)
    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                await connection.execute(
                    "UPDATE officials SET is_active = FALSE, updated_at = NOW() WHERE role_category IN ('MINISTER', 'WICEPREMIER')"
                )
                for official in officials:
                    official_id = uuid.uuid5(OFFICIAL_NAMESPACE, official.full_name)
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
    finally:
        await pool.close()
        await client.close()
    return len(officials)


async def main() -> None:
    count = await sync_administration()
    print(f"Administration sync completed: {count} officials")


if __name__ == "__main__":
    asyncio.run(main())
