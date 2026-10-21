-- GOVscope Reference Seed Data: Full Administration & Coalition Mapping
-- Migration: 20261021000001_seed_administration.sql

INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url) VALUES
('10000000-0000-0000-0000-000000000001', 'KPRM', 'Kancelaria Prezesa Rady Ministrów', 'KPRM', 'COMMITTEE', 'KO', 'https://www.gov.pl/web/premier'),
('10000000-0000-0000-0000-000000000002', 'MF', 'Ministerstwo Finansów', 'MF', 'MINISTRY', 'KO', 'https://www.gov.pl/web/finanse'),
('10000000-0000-0000-0000-000000000003', 'MSZ', 'Ministerstwo Spraw Zagranicznych', 'MSZ', 'MINISTRY', 'KO', 'https://www.gov.pl/web/dyplomacja'),
('10000000-0000-0000-0000-000000000004', 'MON', 'Ministerstwo Obrony Narodowej', 'MON', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/obrona-narodowa'),
('10000000-0000-0000-0000-000000000005', 'MSWiA', 'Ministerstwo Spraw Wewnętrznych i Administracji', 'MSWiA', 'MINISTRY', 'KO', 'https://www.gov.pl/web/mswia'),
('10000000-0000-0000-0000-000000000006', 'MS', 'Ministerstwo Sprawiedliwości', 'MS', 'MINISTRY', 'KO', 'https://www.gov.pl/web/sprawiedliwosc'),
('10000000-0000-0000-0000-000000000007', 'MAP', 'Ministerstwo Aktywów Państwowych', 'MAP', 'MINISTRY', 'KO', 'https://www.gov.pl/web/aktywa-panstwowe'),
('10000000-0000-0000-0000-000000000008', 'MRiT', 'Ministerstwo Rozwoju i Technologii', 'MRiT', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/rozwoj-technologia'),
('10000000-0000-0000-0000-000000000009', 'MKiŚ', 'Ministerstwo Klimatu i Środowiska', 'MKiŚ', 'MINISTRY', 'POLSKA_2050', 'https://www.gov.pl/web/klimat'),
('10000000-0000-0000-0000-000000000010', 'MRPiPS', 'Ministerstwo Rodziny, Pracy i Polityki Społecznej', 'MRPiPS', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/rodzina'),
('10000000-0000-0000-0000-000000000011', 'MZ', 'Ministerstwo Zdrowia', 'MZ', 'MINISTRY', 'KO', 'https://www.gov.pl/web/zdrowie'),
('10000000-0000-0000-0000-000000000012', 'MEN', 'Ministerstwo Edukacji Narodowej', 'MEN', 'MINISTRY', 'KO', 'https://www.gov.pl/web/edukacja'),
('10000000-0000-0000-0000-000000000013', 'MNiSW', 'Ministerstwo Nauki i Szkolnictwa Wyższego', 'MNiSW', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/nauka'),
('10000000-0000-0000-0000-000000000014', 'MI', 'Ministerstwo Infrastruktury', 'MI', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/infrastruktura'),
('10000000-0000-0000-0000-000000000015', 'MRiRW', 'Ministerstwo Rolnictwa i Rozwoju Wsi', 'MRiRW', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/rolnictwo'),
('10000000-0000-0000-0000-000000000016', 'MC', 'Ministerstwo Cyfryzacji', 'MC', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/cyfryzacja'),
('10000000-0000-0000-0000-000000000017', 'MKiDN', 'Ministerstwo Kultury i Dziedzictwa Narodowego', 'MKiDN', 'MINISTRY', 'KO', 'https://www.gov.pl/web/kultura'),
('10000000-0000-0000-0000-000000000018', 'MSiT', 'Ministerstwo Sportu i Turystyki', 'MSiT', 'MINISTRY', 'KO', 'https://www.gov.pl/web/sport'),
('10000000-0000-0000-0000-000000000019', 'M_UE', 'Minister do spraw Unii Europejskiej', 'MdsUE', 'MINISTRY', 'KO', 'https://www.gov.pl/web/premier/minister-do-spraw-unii-europejskiej'),
('10000000-0000-0000-0000-000000000020', 'M_ROWNOSC', 'Minister do spraw Równości', 'MdsR', 'CENTRAL_OFFICE', 'NOWA_LEWICA', 'https://www.gov.pl/web/premier'),
('10000000-0000-0000-0000-000000000021', 'M_SENIOR', 'Minister do spraw Polityki Senioralnej', 'MdsPS', 'CENTRAL_OFFICE', 'KO', 'https://www.gov.pl/web/premier'),
('10000000-0000-0000-0000-000000000022', 'M_SPOLECZENSTWO', 'Minister do spraw Społeczeństwa Obywatelskiego', 'MdsSO', 'CENTRAL_OFFICE', 'POLSKA_2050', 'https://www.gov.pl/web/premier')
ON CONFLICT (code) DO UPDATE SET
    name_pl = EXCLUDED.name_pl,
    short_name = EXCLUDED.short_name,
    coalition_party = EXCLUDED.coalition_party,
    website_url = EXCLUDED.website_url;
