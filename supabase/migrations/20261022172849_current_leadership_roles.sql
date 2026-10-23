-- Keep people who remain in the administration after a change of office.
-- The KPRM leadership page is the source of truth for these role changes:
-- former ministers remain active officials as ministers without a standalone
-- resort; their thematic KPRM source units are not shown as ministries.

UPDATE officials
SET ministry_id = '10000000-0000-0000-0000-000000000001',
    role_title = 'Minister do spraw Unii Europejskiej',
    role_category = 'MINISTER',
    coalition_party = 'KO',
    is_active = TRUE,
    updated_at = NOW()
WHERE full_name = 'Adam Szłapka';

UPDATE officials
SET ministry_id = '10000000-0000-0000-0000-000000000001',
    role_title = 'Minister do spraw Równości',
    role_category = 'MINISTER',
    coalition_party = 'NOWA_LEWICA',
    is_active = TRUE,
    updated_at = NOW()
WHERE full_name = 'Katarzyna Kotula';

UPDATE officials
SET ministry_id = '10000000-0000-0000-0000-000000000001',
    role_title = 'Minister do spraw Polityki Senioralnej',
    role_category = 'MINISTER',
    coalition_party = 'KO',
    is_active = TRUE,
    updated_at = NOW()
WHERE full_name = 'Marzena Okła-Drewnowicz';

UPDATE officials
SET ministry_id = '10000000-0000-0000-0000-000000000001',
    role_title = 'Minister do spraw Społeczeństwa Obywatelskiego',
    role_category = 'MINISTER',
    coalition_party = 'POLSKA_2050',
    is_active = TRUE,
    updated_at = NOW()
WHERE full_name = 'Adriana Porowska';

-- These minister-without-portfolio posts remain attached to KPRM. Their
-- thematic source records are administrative units, not standalone resorts.
UPDATE ministries_and_bodies
SET body_type = 'CENTRAL_OFFICE', updated_at = NOW()
WHERE code IN ('M_UE', 'M_ROWNOSC', 'M_SENIOR', 'M_SPOLECZENSTWO');

-- Additional active KPRM secretaries and undersecretaries published on the
-- current Kierownictwo KPRM page.
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('23000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Grzegorz Karpiński', 'Sekretarz Stanu, Zastępca Szefa Kancelarii Prezesa Rady Ministrów', 'WICEMINISTER', 'KO', ARRAY['Nadzór i koordynacja prac KPRM'], TRUE),
  ('23000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Radosław Kujawa', 'Sekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Jakub Stefaniak', 'Sekretarz Stanu, Zastępca Szefa Kancelarii Prezesa Rady Ministrów', 'WICEMINISTER', 'PSL', ARRAY['Zastępstwo Szefa KPRM'], TRUE),
  ('23000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Karol Grzybowski', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Agnieszka Rucińska', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category,
  coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities,
  is_active = TRUE,
  updated_at = NOW();

-- Ministry of Digital Affairs: the minister remains first, followed by the
-- three secretaries and the undersecretary from the ministry leadership page.
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000016', 'Krzysztof Gawkowski', 'Wicepremier, Minister cyfryzacji, Pełnomocnik Rządu ds. Cyberbezpieczeństwa', 'WICEPREMIER', 'NOWA_LEWICA', ARRAY['Cyfryzacja', 'Cyberbezpieczeństwo', 'Sztuczna inteligencja'], TRUE),
  ('23000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000016', 'Dariusz Standerski', 'Sekretarz Stanu', 'WICEMINISTER', 'NOWA_LEWICA', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000016', 'Paweł Olszewski', 'Sekretarz Stanu', 'WICEMINISTER', 'KO', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000016', 'Michał Gramatyka', 'Sekretarz Stanu', 'WICEMINISTER', 'POLSKA_2050', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000016', 'Rafał Rosiński', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000016', 'Bartosz Dominiak', 'Dyrektor Generalny', 'DYREKTOR_GENERALNY', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category,
  coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities,
  is_active = TRUE,
  updated_at = NOW();

-- Ministry of Funds and Regional Policy was missing entirely from the active
-- official roster. Its current leadership page lists the minister and two
-- secretaries of state.
INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url, bip_url)
VALUES (
  '10000000-0000-0000-0000-000000000029', 'MFiPR', 'Ministerstwo Funduszy i Polityki Regionalnej', 'MFiPR', 'MINISTRY', 'POLSKA_2050',
  'https://www.gov.pl/web/fundusze-regiony', 'https://www.gov.pl/web/fundusze-regiony/kierownictwo-ministerstwa'
)
ON CONFLICT (code) DO UPDATE SET
  name_pl = EXCLUDED.name_pl,
  short_name = EXCLUDED.short_name,
  coalition_party = EXCLUDED.coalition_party,
  website_url = EXCLUDED.website_url,
  bip_url = EXCLUDED.bip_url,
  is_active = TRUE,
  updated_at = NOW();

INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('23000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000029', 'Katarzyna Pełczyńska-Nałęcz', 'Minister Funduszy i Polityki Regionalnej', 'MINISTER', 'POLSKA_2050', ARRAY['Polityka regionalna', 'Fundusze europejskie', 'KPO'], TRUE),
  ('23000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000029', 'Jacek Karnowski', 'Sekretarz Stanu', 'WICEMINISTER', 'KO', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000029', 'Jan Szyszko', 'Sekretarz Stanu', 'WICEMINISTER', 'POLSKA_2050', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000029', 'Wojciech Kijowski', 'Dyrektor Generalny', 'DYREKTOR_GENERALNY', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category,
  coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities,
  is_active = TRUE,
  updated_at = NOW();

-- Ministry of Energy: Miłosz Motyka was absent from the seed and the two
-- existing deputy records had the wrong Secretary/Undersecretary titles.
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('23000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000028', 'Miłosz Motyka', 'Minister Energii', 'MINISTER', 'PSL', ARRAY['Energia', 'Bezpieczeństwo energetyczne'], TRUE),
  ('21000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000028', 'Wojciech Wrochna', 'Sekretarz Stanu, Pełnomocnik Rządu ds. Strategicznej Infrastruktury Energetycznej', 'WICEMINISTER', 'NON_PARTISAN', ARRAY['Strategiczna infrastruktura energetyczna'], TRUE),
  ('21000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000028', 'Piotr Paweł Masłowski', 'Sekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000028', 'Konrad Wojnarowski', 'Podsekretarz Stanu', 'WICEMINISTER', 'PSL', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000028', 'Marian Zmarzły', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('23000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000028', 'Rafał Michał Tomasik', 'Dyrektor Generalny', 'DYREKTOR_GENERALNY', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category,
  coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities,
  is_active = TRUE,
  updated_at = NOW();
