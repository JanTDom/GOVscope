"""Deterministic loader of actual Polish government administration and leadership structure."""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from typing import Any, Dict, List
from uuid import UUID

from govscope.models.entities import (
    CoalitionParty,
    Ministry,
    Official,
    RoleCategory,
)

logger = logging.getLogger("govscope.seed")

# Deterministic UUID namespaces for consistent identity mapping
ADMIN_NAMESPACE = "10000000-0000-0000-0000-"
OFFICIAL_NAMESPACE = "20000000-0000-0000-0000-"

OFFICIAL_MINISTRIES_DATA: List[Dict[str, Any]] = [
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000001"),
        "code": "KPRM",
        "name_pl": "Kancelaria Prezesa Rady Ministrów",
        "short_name": "KPRM",
        "body_type": "COMMITTEE",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000002"),
        "code": "MF",
        "name_pl": "Ministerstwo Finansów",
        "short_name": "MF",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/finanse",
        "bip_url": "https://mf-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000003"),
        "code": "MSZ",
        "name_pl": "Ministerstwo Spraw Zagranicznych",
        "short_name": "MSZ",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/dyplomacja",
        "bip_url": "https://msz-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000004"),
        "code": "MON",
        "name_pl": "Ministerstwo Obrony Narodowej",
        "short_name": "MON",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.PSL,
        "website_url": "https://www.gov.pl/web/obrona-narodowa",
        "bip_url": "https://mon-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000005"),
        "code": "MSWiA",
        "name_pl": "Ministerstwo Spraw Wewnętrznych i Administracji",
        "short_name": "MSWiA",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/mswia",
        "bip_url": "https://mswia-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000006"),
        "code": "MS",
        "name_pl": "Ministerstwo Sprawiedliwości",
        "short_name": "MS",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/sprawiedliwosc",
        "bip_url": "https://ms-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000007"),
        "code": "MAP",
        "name_pl": "Ministerstwo Aktywów Państwowych",
        "short_name": "MAP",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/aktywa-panstwowe",
        "bip_url": "https://map-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000008"),
        "code": "MRiT",
        "name_pl": "Ministerstwo Rozwoju i Technologii",
        "short_name": "MRiT",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.PSL,
        "website_url": "https://www.gov.pl/web/rozwoj-technologia",
        "bip_url": "https://mrit-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000009"),
        "code": "MKiŚ",
        "name_pl": "Ministerstwo Klimatu i Środowiska",
        "short_name": "MKiŚ",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.POLSKA_2050,
        "website_url": "https://www.gov.pl/web/klimat",
        "bip_url": "https://mkis-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000010"),
        "code": "MRPiPS",
        "name_pl": "Ministerstwo Rodziny, Pracy i Polityki Społecznej",
        "short_name": "MRPiPS",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "website_url": "https://www.gov.pl/web/rodzina",
        "bip_url": "https://mrpips-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000011"),
        "code": "MZ",
        "name_pl": "Ministerstwo Zdrowia",
        "short_name": "MZ",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/zdrowie",
        "bip_url": "https://mz-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000012"),
        "code": "MEN",
        "name_pl": "Ministerstwo Edukacji Narodowej",
        "short_name": "MEN",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/edukacja",
        "bip_url": "https://men-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000013"),
        "code": "MNiSW",
        "name_pl": "Ministerstwo Nauki i Szkolnictwa Wyższego",
        "short_name": "MNiSW",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "website_url": "https://www.gov.pl/web/nauka",
        "bip_url": "https://mnisw-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000014"),
        "code": "MI",
        "name_pl": "Ministerstwo Infrastruktury",
        "short_name": "MI",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.PSL,
        "website_url": "https://www.gov.pl/web/infrastruktura",
        "bip_url": "https://mi-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000015"),
        "code": "MRiRW",
        "name_pl": "Ministerstwo Rolnictwa i Rozwoju Wsi",
        "short_name": "MRiRW",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.PSL,
        "website_url": "https://www.gov.pl/web/rolnictwo",
        "bip_url": "https://mrirw-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000016"),
        "code": "MC",
        "name_pl": "Ministerstwo Cyfryzacji",
        "short_name": "MC",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "website_url": "https://www.gov.pl/web/cyfryzacja",
        "bip_url": "https://mc-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000017"),
        "code": "MKiDN",
        "name_pl": "Ministerstwo Kultury i Dziedzictwa Narodowego",
        "short_name": "MKiDN",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/kultura",
        "bip_url": "https://mkidn-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000018"),
        "code": "MSiT",
        "name_pl": "Ministerstwo Sportu i Turystyki",
        "short_name": "MSiT",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/sport",
        "bip_url": "https://msit-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000019"),
        "code": "MP",
        "name_pl": "Ministerstwo Przemysłu",
        "short_name": "MP",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.NON_PARTISAN,
        "website_url": "https://www.gov.pl/web/przemysl",
        "bip_url": "https://mp-bip.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000020"),
        "code": "M_UE",
        "name_pl": "Minister do spraw Unii Europejskiej",
        "short_name": "MdsUE",
        "body_type": "MINISTRY",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier/minister-do-spraw-unii-europejskiej",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000021"),
        "code": "M_ROWNOSC",
        "name_pl": "Minister do spraw Równości",
        "short_name": "MdsR",
        "body_type": "CENTRAL_OFFICE",
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000022"),
        "code": "M_SENIOR",
        "name_pl": "Minister do spraw Polityki Senioralnej",
        "short_name": "MdsPS",
        "body_type": "CENTRAL_OFFICE",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000023"),
        "code": "M_SPOLECZENSTWO",
        "name_pl": "Minister do spraw Społeczeństwa Obywatelskiego",
        "short_name": "MdsSO",
        "body_type": "CENTRAL_OFFICE",
        "coalition_party": CoalitionParty.POLSKA_2050,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    # Komitety Rady Ministrów
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000024"),
        "code": "SKRM",
        "name_pl": "Stały Komitet Rady Ministrów",
        "short_name": "SKRM",
        "body_type": "COMMITTEE",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier/staly-komitet-rady-ministrow",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000025"),
        "code": "KERM",
        "name_pl": "Komitet Ekonomiczny Rady Ministrów",
        "short_name": "KERM",
        "body_type": "COMMITTEE",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000026"),
        "code": "KSE",
        "name_pl": "Komitet do Spraw Europejskich",
        "short_name": "KSE",
        "body_type": "COMMITTEE",
        "coalition_party": CoalitionParty.KO,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
    {
        "id": UUID(ADMIN_NAMESPACE + "000000000027"),
        "code": "KBN",
        "name_pl": "Komitet Rady Ministrów do spraw Bezpieczeństwa Narodowego i spraw Obronnych",
        "short_name": "KBN",
        "body_type": "COMMITTEE",
        "coalition_party": CoalitionParty.PSL,
        "website_url": "https://www.gov.pl/web/premier",
        "bip_url": "https://bip.kprm.gov.pl/",
    },
]

OFFICIALS_DATA: List[Dict[str, Any]] = [
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000001"),
        "ministry_code": "KPRM",
        "full_name": "Donald Tusk",
        "role_title": "Prezes Rady Ministrów",
        "role_category": RoleCategory.PREMIER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@donaldtusk",
        "linkedin_url": "https://pl.linkedin.com/in/donald-tusk",
        "responsibilities": ["Kierowanie pracami Rady Ministrów", "Koordynacja polityki rządu", "Reprezentowanie rządu"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000002"),
        "ministry_code": "MON",
        "full_name": "Władysław Kosiniak-Kamysz",
        "role_title": "Wiceprezes Rady Ministrów, Minister Obrony Narodowej",
        "role_category": RoleCategory.WICEPREMIER,
        "coalition_party": CoalitionParty.PSL,
        "x_handle": "@KosiniakKamysz",
        "linkedin_url": "https://pl.linkedin.com/in/wladyslaw-kosiniak-kamysz",
        "responsibilities": ["Obronność państwa", "Siły Zbrojne RP", "Koordynacja bezpieczeństwa"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000003"),
        "ministry_code": "MC",
        "full_name": "Krzysztof Gawkowski",
        "role_title": "Wiceprezes Rady Ministrów, Minister Cyfryzacji",
        "role_category": RoleCategory.WICEPREMIER,
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "x_handle": "@KGawkowski",
        "linkedin_url": "https://pl.linkedin.com/in/krzysztof-gawkowski",
        "responsibilities": ["Cyfryzacja", "Cyberbezpieczeństwo", "Sztuczna inteligencja"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000004"),
        "ministry_code": "MF",
        "full_name": "Andrzej Domański",
        "role_title": "Minister Finansów",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@Domanski_Andrz",
        "linkedin_url": "https://pl.linkedin.com/in/andrzej-domanski",
        "responsibilities": ["Budżet państwa", "Podatki", "Instytucje finansowe", "Dług publiczny"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000005"),
        "ministry_code": "MSZ",
        "full_name": "Radosław Sikorski",
        "role_title": "Minister Spraw Zagranicznych",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@radeksikorski",
        "linkedin_url": "https://pl.linkedin.com/in/radeksikorski",
        "responsibilities": ["Polityka zagraniczna", "Dyplomacja", "Bezpieczeństwo międzynarodowe"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000006"),
        "ministry_code": "MSWiA",
        "full_name": "Marcin Kierwiński",
        "role_title": "Minister Spraw Wewnętrznych i Administracji",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@MKierwinski",
        "linkedin_url": "https://pl.linkedin.com/in/tomasz-siemoniak",
        "responsibilities": ["Bezpieczeństwo wewnętrzne", "Służby specjalne", "Administracja publiczna"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000007"),
        "ministry_code": "MS",
        "full_name": "Waldemar Żurek",
        "role_title": "Minister Sprawiedliwości, Prokurator Generalny",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@Adbodnar",
        "linkedin_url": "https://pl.linkedin.com/in/adambodnar",
        "responsibilities": ["Wymiar sprawiedliwości", "Sądownictwo", "Praworządność", "Prokuratura"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000008"),
        "ministry_code": "MAP",
        "full_name": "Wojciech Balczun",
        "role_title": "Minister Aktywów Państwowych",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@JaworowskiJ",
        "linkedin_url": "https://pl.linkedin.com/in/jakub-jaworowski",
        "responsibilities": ["Nadzór nad spółkami Skarbu Państwa", "Gospodarka zasobami państwowymi"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000009"),
        "ministry_code": "MRiT",
        "full_name": "Krzysztof Paszyk",
        "role_title": "Minister Rozwoju i Technologii",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.PSL,
        "x_handle": "@KrzysztofPaszyk",
        "linkedin_url": "https://pl.linkedin.com/in/krzysztof-paszyk",
        "responsibilities": ["Gospodarka", "Mieszkalnictwo", "Przedsiębiorczość"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000010"),
        "ministry_code": "MKiŚ",
        "full_name": "Paulina Hennig-Kloska",
        "role_title": "Minister Klimatu i Środowiska",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.POLSKA_2050,
        "x_handle": "@hennigkloska",
        "linkedin_url": "https://pl.linkedin.com/in/paulina-hennig-kloska",
        "responsibilities": ["Klimat", "Energia odnawialna", "Ochrona środowiska"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000011"),
        "ministry_code": "MRPiPS",
        "full_name": "Agnieszka Dziemianowicz-Bąk",
        "role_title": "Minister Rodziny, Pracy i Polityki Społecznej",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "x_handle": "@AgaBak",
        "linkedin_url": "https://pl.linkedin.com/in/agnieszka-dziemianowicz-bak",
        "responsibilities": ["Praca", "Zabezpieczenie społeczne", "Polityka rodzinna"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000012"),
        "ministry_code": "MZ",
        "full_name": "Jolanta Sobierańska-Grenda",
        "role_title": "Ministra Zdrowia",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.NON_PARTISAN,
        "x_handle": "@MZ_GOV_PL",
        "linkedin_url": "https://pl.linkedin.com/in/jolanta-sobieranska-grenda",
        "responsibilities": ["System ochrony zdrowia", "NFZ", "Oddłużenie szpitali", "Leki i refundacja"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000013"),
        "ministry_code": "MEN",
        "full_name": "Barbara Nowacka",
        "role_title": "Minister Edukacji Narodowej",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@barbaraanowacka",
        "linkedin_url": "https://pl.linkedin.com/in/barbara-nowacka",
        "responsibilities": ["Oświata", "Szkolnictwo podstawowe i średnie", "Programy nauczania"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000014"),
        "ministry_code": "MNiSW",
        "full_name": "Marcin Kulasek",
        "role_title": "Minister Nauki i Szkolnictwa Wyższego",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "x_handle": "@wieczorekdarek",
        "linkedin_url": "https://pl.linkedin.com/in/dariusz-wieczorek",
        "responsibilities": ["Szkolnictwo wyższe", "Badania naukowe", "Uczelnie publiczne"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000015"),
        "ministry_code": "MI",
        "full_name": "Dariusz Klimczak",
        "role_title": "Minister Infrastruktury",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.PSL,
        "x_handle": "@DariuszKlimczak",
        "linkedin_url": "https://pl.linkedin.com/in/dariusz-klimczak",
        "responsibilities": ["Transport", "Kolej", "Drogi krajowe", "CPK"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000016"),
        "ministry_code": "MRiRW",
        "full_name": "Stefan Krajewski",
        "role_title": "Minister Rolnictwa i Rozwoju Wsi",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.PSL,
        "x_handle": "@CzSiekierski",
        "linkedin_url": "https://pl.linkedin.com/in/czeslaw-siekierski",
        "responsibilities": ["Rolnictwo", "Rozwój wsi", "Dopłaty bezpośrednie"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000017"),
        "ministry_code": "MKiDN",
        "full_name": "Marta Cienkowska",
        "role_title": "Minister Kultury i Dziedzictwa Narodowego",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@MKiDN_GOV_PL",
        "linkedin_url": "https://pl.linkedin.com/company/mkidn",
        "responsibilities": ["Kultura", "Dziedzictwo narodowe", "Instytucje artystyczne"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000018"),
        "ministry_code": "MSiT",
        "full_name": "Jakub Rutnicki",
        "role_title": "Minister Sportu i Turystyki",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@SlawomirNitras",
        "linkedin_url": "https://pl.linkedin.com/in/slawomirnitras",
        "responsibilities": ["Sport", "Infrastruktura sportowa", "Turystyka"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000019"),
        "ministry_code": "MP",
        "full_name": "Marzena Czarnecka",
        "role_title": "Minister Przemysłu",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.NON_PARTISAN,
        "x_handle": "@CzarneckaM",
        "linkedin_url": "https://pl.linkedin.com/in/marzena-czarnecka",
        "responsibilities": ["Górnictwo", "Hutnictwo", "Transformacja przemysłowa Śląska"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000020"),
        "ministry_code": "M_UE",
        "full_name": "Radosław Sikorski",
        "role_title": "Minister Spraw Zagranicznych, członek Komitetu do Spraw Europejskich",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@radeksikorski",
        "linkedin_url": "https://pl.linkedin.com/in/adamszlapka",
        "responsibilities": ["Sprawy europejskie", "Rada UE", "Koordynacja polskiego stanowiska w Brukseli"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000021"),
        "ministry_code": "M_ROWNOSC",
        "full_name": "Katarzyna Kotula",
        "role_title": "Minister do spraw Równości",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.NOWA_LEWICA,
        "x_handle": "@KotulaKat",
        "linkedin_url": "https://pl.linkedin.com/in/katarzyna-kotula",
        "responsibilities": ["Przeciwdziałanie dyskryminacji", "Równe traktowanie"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000022"),
        "ministry_code": "M_SENIOR",
        "full_name": "Marzena Okła-Drewnowicz",
        "role_title": "Minister do spraw Polityki Senioralnej",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@OklaDrewnowicz",
        "linkedin_url": "https://pl.linkedin.com/in/marzena-okla-drewnowicz",
        "responsibilities": ["Opieka senioralna", "Bon senioralny"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000023"),
        "ministry_code": "M_SPOLECZENSTWO",
        "full_name": "Adriana Porowska",
        "role_title": "Minister do spraw Społeczeństwa Obywatelskiego",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.POLSKA_2050,
        "x_handle": "@AdrianaPorowska",
        "linkedin_url": "https://pl.linkedin.com/in/adriana-porowska",
        "responsibilities": ["Organizacje pozarządowe", "Wolontariat", "Społeczeństwo obywatelskie"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000024"),
        "ministry_code": "KPRM",
        "full_name": "Maciej Berek",
        "role_title": "Minister - Członek RM, Przewodniczący Stałego Komitetu Rady Ministrów",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@MaciejBerek",
        "linkedin_url": "https://pl.linkedin.com/in/maciej-berek",
        "responsibilities": ["Przewodniczenie SKRM", "Koordynacja procesu legislacyjnego rządu"],
    },
    {
        "id": UUID(OFFICIAL_NAMESPACE + "000000000025"),
        "ministry_code": "KPRM",
        "full_name": "Jan Grabiec",
        "role_title": "Minister - Członek RM, Szef Kancelarii Prezesa Rady Ministrów",
        "role_category": RoleCategory.MINISTER,
        "coalition_party": CoalitionParty.KO,
        "x_handle": "@JanGrabiec",
        "linkedin_url": "https://pl.linkedin.com/in/jan-grabiec",
        "responsibilities": ["Kierowanie KPRM", "Komunikacja rządu", "Koordynacja gabinetu"],
    },
]


def get_reference_ministries() -> List[Ministry]:
    """Returns validated Pydantic models for all 19 ministries, KPRM and RM committees."""
    result: List[Ministry] = []
    for item in OFFICIAL_MINISTRIES_DATA:
        result.append(
            Ministry(
                id=item["id"],
                code=item["code"],
                name_pl=item["name_pl"],
                short_name=item["short_name"],
                body_type=item["body_type"],
                coalition_party=item["coalition_party"],
                website_url=item["website_url"],
                bip_url=item["bip_url"],
            )
        )
    return result


def get_reference_officials() -> List[Official]:
    """Returns validated Pydantic models for key constitutional ministers."""
    ministry_by_code = {m["code"]: m["id"] for m in OFFICIAL_MINISTRIES_DATA}
    result: List[Official] = []
    for item in OFFICIAL_MINISTRIES_DATA:
        pass
    for off in OFFICIALS_DATA:
        min_id = ministry_by_code.get(off["ministry_code"])
        result.append(
            Official(
                id=off["id"],
                ministry_id=min_id,
                full_name=off["full_name"],
                role_title=off["role_title"],
                role_category=off["role_category"],
                coalition_party=off["coalition_party"],
                x_handle=off.get("x_handle"),
                linkedin_url=off.get("linkedin_url"),
                responsibilities=off.get("responsibilities", []),
            )
        )
    return result


async def load_seed_to_postgres(dsn: str) -> None:
    """Connects to PostgreSQL using asyncpg and executes idempotent seed upserts."""
    import asyncpg

    logger.info("Connecting to PostgreSQL at %s for seed insertion...", dsn)
    conn = await asyncpg.connect(dsn)
    try:
        async with conn.transaction():
            ministries = get_reference_ministries()
            for m in ministries:
                await conn.execute(
                    """
                    INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url, bip_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (code) DO UPDATE SET
                        name_pl = EXCLUDED.name_pl,
                        short_name = EXCLUDED.short_name,
                        coalition_party = EXCLUDED.coalition_party,
                        website_url = EXCLUDED.website_url,
                        bip_url = EXCLUDED.bip_url;
                    """,
                    str(m.id),
                    m.code,
                    m.name_pl,
                    m.short_name,
                    m.body_type,
                    m.coalition_party.value if m.coalition_party else None,
                    m.website_url,
                    m.bip_url,
                )

            officials = get_reference_officials()
            for o in officials:
                await conn.execute(
                    """
                    INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, x_handle, linkedin_url, responsibilities, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    ON CONFLICT (id) DO UPDATE SET
                        full_name = EXCLUDED.full_name,
                        role_title = EXCLUDED.role_title,
                        role_category = EXCLUDED.role_category,
                        coalition_party = EXCLUDED.coalition_party,
                        x_handle = EXCLUDED.x_handle,
                        responsibilities = EXCLUDED.responsibilities,
                        is_active = EXCLUDED.is_active;
                    """,
                    str(o.id),
                    str(o.ministry_id) if o.ministry_id else None,
                    o.full_name,
                    o.role_title,
                    o.role_category.value,
                    o.coalition_party.value,
                    o.x_handle,
                    o.linkedin_url,
                    o.responsibilities,
                    o.is_active,
                )
            logger.info("Successfully seeded %d bodies and %d officials.", len(ministries), len(officials))
    finally:
        await conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="GOVscope administration reference seeder")
    parser.add_argument("--dsn", type=str, help="PostgreSQL connection URI")
    parser.add_argument("--verify", action="store_true", help="Verify seed models in memory")
    args = parser.parse_args()

    ministries = get_reference_ministries()
    officials = get_reference_officials()
    print(f"Verified {len(ministries)} administrative bodies (KPRM + 19 ministries + committees) and {len(officials)} constitutional ministers.")

    if args.dsn:
        asyncio.run(load_seed_to_postgres(args.dsn))


if __name__ == "__main__":
    main()
