-- GOVscope Reference Seed Data: Full Administration & Coalition Mapping
-- Migration: 20261021000001_seed_administration.sql

-- 1. Ministries, Committees and Central Bodies
INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url, bip_url) VALUES
('10000000-0000-0000-0000-000000000001', 'KPRM', 'Kancelaria Prezesa Rady Ministrów', 'KPRM', 'COMMITTEE', 'KO', 'https://www.gov.pl/web/premier', 'https://www.bip.gov.pl/'),
('10000000-0000-0000-0000-000000000002', 'MF', 'Ministerstwo Finansów', 'MF', 'MINISTRY', 'KO', 'https://www.gov.pl/web/finanse', 'https://mf-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000003', 'MSZ', 'Ministerstwo Spraw Zagranicznych', 'MSZ', 'MINISTRY', 'KO', 'https://www.gov.pl/web/dyplomacja', 'https://msz-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000004', 'MON', 'Ministerstwo Obrony Narodowej', 'MON', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/obrona-narodowa', 'https://mon-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000005', 'MSWiA', 'Ministerstwo Spraw Wewnętrznych i Administracji', 'MSWiA', 'MINISTRY', 'KO', 'https://www.gov.pl/web/mswia', 'https://mswia-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000006', 'MS', 'Ministerstwo Sprawiedliwości', 'MS', 'MINISTRY', 'KO', 'https://www.gov.pl/web/sprawiedliwosc', 'https://ms-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000007', 'MAP', 'Ministerstwo Aktywów Państwowych', 'MAP', 'MINISTRY', 'KO', 'https://www.gov.pl/web/aktywa-panstwowe', 'https://map-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000008', 'MRiT', 'Ministerstwo Rozwoju i Technologii', 'MRiT', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/rozwoj-technologia', 'https://mrit-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000009', 'MKiŚ', 'Ministerstwo Klimatu i Środowiska', 'MKiŚ', 'MINISTRY', 'POLSKA_2050', 'https://www.gov.pl/web/klimat', 'https://mkis-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000010', 'MRPiPS', 'Ministerstwo Rodziny, Pracy i Polityki Społecznej', 'MRPiPS', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/rodzina', 'https://mrpips-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000011', 'MZ', 'Ministerstwo Zdrowia', 'MZ', 'MINISTRY', 'KO', 'https://www.gov.pl/web/zdrowie', 'https://mz-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000012', 'MEN', 'Ministerstwo Edukacji Narodowej', 'MEN', 'MINISTRY', 'KO', 'https://www.gov.pl/web/edukacja', 'https://men-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000013', 'MNiSW', 'Ministerstwo Nauki i Szkolnictwa Wyższego', 'MNiSW', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/nauka', 'https://mnisw-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000014', 'MI', 'Ministerstwo Infrastruktury', 'MI', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/infrastruktura', 'https://mi-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000015', 'MRiRW', 'Ministerstwo Rolnictwa i Rozwoju Wsi', 'MRiRW', 'MINISTRY', 'PSL', 'https://www.gov.pl/web/rolnictwo', 'https://mrirw-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000016', 'MC', 'Ministerstwo Cyfryzacji', 'MC', 'MINISTRY', 'NOWA_LEWICA', 'https://www.gov.pl/web/cyfryzacja', 'https://mc-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000017', 'MKiDN', 'Ministerstwo Kultury i Dziedzictwa Narodowego', 'MKiDN', 'MINISTRY', 'KO', 'https://www.gov.pl/web/kultura', 'https://mkidn-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000018', 'MSiT', 'Ministerstwo Sportu i Turystyki', 'MSiT', 'MINISTRY', 'KO', 'https://www.gov.pl/web/sport', 'https://msit-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000019', 'MP', 'Ministerstwo Przemysłu', 'MP', 'MINISTRY', 'NON_PARTISAN', 'https://www.gov.pl/web/przemysl', 'https://mp-bip.gov.pl/'),
('10000000-0000-0000-0000-000000000020', 'M_UE', 'Minister do spraw Unii Europejskiej', 'MdsUE', 'MINISTRY', 'KO', 'https://www.gov.pl/web/premier/minister-do-spraw-unii-europejskiej', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000021', 'M_ROWNOSC', 'Minister do spraw Równości', 'MdsR', 'CENTRAL_OFFICE', 'NOWA_LEWICA', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000022', 'M_SENIOR', 'Minister do spraw Polityki Senioralnej', 'MdsPS', 'CENTRAL_OFFICE', 'KO', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000023', 'M_SPOLECZENSTWO', 'Minister do spraw Społeczeństwa Obywatelskiego', 'MdsSO', 'CENTRAL_OFFICE', 'POLSKA_2050', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000024', 'SKRM', 'Stały Komitet Rady Ministrów', 'SKRM', 'COMMITTEE', 'KO', 'https://www.gov.pl/web/premier/staly-komitet-rady-ministrow', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000025', 'KERM', 'Komitet Ekonomiczny Rady Ministrów', 'KERM', 'COMMITTEE', 'KO', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000026', 'KSE', 'Komitet do Spraw Europejskich', 'KSE', 'COMMITTEE', 'KO', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/'),
('10000000-0000-0000-0000-000000000027', 'KBN', 'Komitet Rady Ministrów do spraw Bezpieczeństwa Narodowego i spraw Obronnych', 'KBN', 'COMMITTEE', 'PSL', 'https://www.gov.pl/web/premier', 'https://bip.kprm.gov.pl/')
ON CONFLICT (code) DO UPDATE SET
    name_pl = EXCLUDED.name_pl,
    short_name = EXCLUDED.short_name,
    coalition_party = EXCLUDED.coalition_party,
    website_url = EXCLUDED.website_url,
    bip_url = EXCLUDED.bip_url;

-- 2. Official Government Ministers & Leadership (Constitutional Council of Ministers)
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, x_handle, linkedin_url, responsibilities, is_active) VALUES
-- Premier
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Donald Tusk', 'Prezes Rady Ministrów', 'PREMIER', 'KO', '@donaldtusk', 'https://pl.linkedin.com/in/donald-tusk', ARRAY['Kierowanie pracami Rady Ministrów', 'Koordynacja polityki rządu', 'Reprezentowanie rządu'], TRUE),
-- Wicepremierzy
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 'Władysław Kosiniak-Kamysz', 'Wiceprezes Rady Ministrów, Minister Obrony Narodowej', 'WICEPREMIER', 'PSL', '@KosiniakKamysz', 'https://pl.linkedin.com/in/wladyslaw-kosiniak-kamysz', ARRAY['Obronność państwa', 'Siły Zbrojne RP', 'Koordynacja bezpieczeństwa'], TRUE),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000016', 'Krzysztof Gawkowski', 'Wiceprezes Rady Ministrów, Minister Cyfryzacji', 'WICEPREMIER', 'NOWA_LEWICA', '@KGawkowski', 'https://pl.linkedin.com/in/krzysztof-gawkowski', ARRAY['Cyfryzacja', 'Cyberbezpieczeństwo', 'Sztuczna inteligencja'], TRUE),
-- Ministrowie resortowi
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Andrzej Domański', 'Minister Finansów', 'MINISTER', 'KO', '@Domanski_Andrz', 'https://pl.linkedin.com/in/andrzej-domanski', ARRAY['Budżet państwa', 'Podatki', 'Instytucje finansowe', 'Dług publiczny'], TRUE),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Radosław Sikorski', 'Minister Spraw Zagranicznych', 'MINISTER', 'KO', '@radeksikorski', 'https://pl.linkedin.com/in/radeksikorski', ARRAY['Polityka zagraniczna', 'Dyplomacja', 'Bezpieczeństwo międzynarodowe'], TRUE),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', 'Tomasz Siemoniak', 'Minister Spraw Wewnętrznych i Administracji, Koordynator Służb Specjalnych', 'MINISTER', 'KO', '@TomaszSiemoniak', 'https://pl.linkedin.com/in/tomasz-siemoniak', ARRAY['Bezpieczeństwo wewnętrzne', 'Służby specjalne', 'Administracja publiczna', 'Policja i SG'], TRUE),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000006', 'Adam Bodnar', 'Minister Sprawiedliwości, Prokurator Generalny', 'MINISTER', 'KO', '@Adbodnar', 'https://pl.linkedin.com/in/adambodnar', ARRAY['Wymiar sprawiedliwości', 'Sądownictwo', 'Praworządność', 'Prokuratura'], TRUE),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', 'Jakub Jaworowski', 'Minister Aktywów Państwowych', 'MINISTER', 'KO', '@JaworowskiJ', 'https://pl.linkedin.com/in/jakub-jaworowski', ARRAY['Nadzór właścicielski nad spółkami Skarbu Państwa', 'Gospodarka zasobami państwowymi'], TRUE),
('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000008', 'Krzysztof Paszyk', 'Minister Rozwoju i Technologii', 'MINISTER', 'PSL', '@KrzysztofPaszyk', 'https://pl.linkedin.com/in/krzysztof-paszyk', ARRAY['Gospodarka', 'Mieszkalnictwo', 'Przedsiębiorczość', 'Planowanie przestrzenne'], TRUE),
('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000009', 'Paulina Hennig-Kloska', 'Minister Klimatu i Środowiska', 'MINISTER', 'POLSKA_2050', '@hennigkloska', 'https://pl.linkedin.com/in/paulina-hennig-kloska', ARRAY['Klimat', 'Energia odnawialna', 'Ochrona środowiska', 'Gospodarka wodna'], TRUE),
('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000010', 'Agnieszka Dziemianowicz-Bąk', 'Minister Rodziny, Pracy i Polityki Społecznej', 'MINISTER', 'NOWA_LEWICA', '@AgaBak', 'https://pl.linkedin.com/in/agnieszka-dziemianowicz-bak', ARRAY['Praca', 'Zabezpieczenie społeczne', 'Polityka rodzinna', 'Świadczenia społeczne'], TRUE),
('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000011', 'Izabela Leszczyna', 'Minister Zdrowia', 'MINISTER', 'KO', '@Leszczyna', 'https://pl.linkedin.com/in/izabela-leszczyna', ARRAY['System ochrony zdrowia', 'NFZ', 'Leki i refundacja', 'Szpitale'], TRUE),
('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000012', 'Barbara Nowacka', 'Minister Edukacji Narodowej', 'MINISTER', 'KO', '@barbaraanowacka', 'https://pl.linkedin.com/in/barbara-nowacka', ARRAY['Oświata', 'Szkolnictwo podstawowe i średnie', 'Programy nauczania'], TRUE),
('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000013', 'Dariusz Wieczorek', 'Minister Nauki i Szkolnictwa Wyższego', 'MINISTER', 'NOWA_LEWICA', '@wieczorekdarek', 'https://pl.linkedin.com/in/dariusz-wieczorek', ARRAY['Szkolnictwo wyższe', 'Badania naukowe', 'Uczelnie publiczne'], TRUE),
('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000014', 'Dariusz Klimczak', 'Minister Infrastruktury', 'MINISTER', 'PSL', '@DariuszKlimczak', 'https://pl.linkedin.com/in/dariusz-klimczak', ARRAY['Transport', 'Kolej', 'Drogi krajowe', 'Lotnictwo', 'CPK'], TRUE),
('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000015', 'Czesław Siekierski', 'Minister Rolnictwa i Rozwoju Wsi', 'MINISTER', 'PSL', '@CzSiekierski', 'https://pl.linkedin.com/in/czeslaw-siekierski', ARRAY['Rolnictwo', 'Rozwój wsi', 'Rynki rolne', 'Dopłaty bezpośrednie'], TRUE),
('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000017', 'Hanna Wróblewska', 'Minister Kultury i Dziedzictwa Narodowego', 'MINISTER', 'KO', '@MKiDN_GOV_PL', 'https://pl.linkedin.com/company/mkidn', ARRAY['Kultura', 'Ochrona dziedzictwa narodowego', 'Instytucje artystyczne'], TRUE),
('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000018', 'Sławomir Nitras', 'Minister Sportu i Turystyki', 'MINISTER', 'KO', '@SlawomirNitras', 'https://pl.linkedin.com/in/slawomirnitras', ARRAY['Sport powszechny', 'Sport wyczynowy', 'Infrastruktura sportowa', 'Turystyka'], TRUE),
('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000019', 'Marzena Czarnecka', 'Minister Przemysłu', 'MINISTER', 'NON_PARTISAN', '@CzarneckaM', 'https://pl.linkedin.com/in/marzena-czarnecka', ARRAY['Górnictwo', 'Hutnictwo', 'Transformacja przemysłowa Śląska', 'Surowce kopalne'], TRUE),
-- Ministrowie - członkowie Rady Ministrów
('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000020', 'Adam Szłapka', 'Minister do spraw Unii Europejskiej', 'MINISTER', 'KO', '@szlapka', 'https://pl.linkedin.com/in/adamszlapka', ARRAY['Sprawy europejskie', 'Negocjacje w Radzie UE', 'Koordynacja polskiego stanowiska w Brukseli'], TRUE),
('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000021', 'Katarzyna Kotula', 'Minister do spraw Równości', 'MINISTER', 'NOWA_LEWICA', '@KotulaKat', 'https://pl.linkedin.com/in/katarzyna-kotula', ARRAY['Przeciwdziałanie dyskryminacji', 'Polityka równościowa', 'Równe traktowanie'], TRUE),
('20000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000022', 'Marzena Okła-Drewnowicz', 'Minister do spraw Polityki Senioralnej', 'MINISTER', 'KO', '@OklaDrewnowicz', 'https://pl.linkedin.com/in/marzena-okla-drewnowicz', ARRAY['Opieka senioralna', 'Bon senioralny', 'Aktywność osób starszych'], TRUE),
('20000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000023', 'Adriana Porowska', 'Minister do spraw Społeczeństwa Obywatelskiego', 'MINISTER', 'POLSKA_2050', '@AdrianaPorowska', 'https://pl.linkedin.com/in/adriana-porowska', ARRAY['Organizacje pozarządowe', 'Wolontariat', 'Społeczeństwo obywatelskie'], TRUE),
('20000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000001', 'Maciej Berek', 'Minister - Członek RM, Przewodniczący Stałego Komitetu Rady Ministrów', 'MINISTER', 'KO', '@MaciejBerek', 'https://pl.linkedin.com/in/maciej-berek', ARRAY['Przewodniczenie SKRM', 'Koordynacja procesu legislacyjnego rządu', 'Wykaz prac legislacyjnych RM'], TRUE),
('20000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000001', 'Jan Grabiec', 'Minister - Członek RM, Szef Kancelarii Prezesa Rady Ministrów', 'MINISTER', 'KO', '@JanGrabiec', 'https://pl.linkedin.com/in/jan-grabiec', ARRAY['Kierowanie KPRM', 'Wsparcie Prezesa Rady Ministrów', 'Komunikacja rządowa'], TRUE)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role_title = EXCLUDED.role_title,
    role_category = EXCLUDED.role_category,
    coalition_party = EXCLUDED.coalition_party,
    x_handle = EXCLUDED.x_handle,
    responsibilities = EXCLUDED.responsibilities,
    is_active = EXCLUDED.is_active;

