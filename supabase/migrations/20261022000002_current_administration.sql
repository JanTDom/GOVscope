-- Replace the historical seed roster with the current official KPRM and ministry leadership.
-- The administration sync worker refreshes this list from gov.pl; this migration is the
-- immediate safety net for production and prevents known departed officials from showing.

INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url, bip_url)
VALUES (
  '10000000-0000-0000-0000-000000000028', 'ME', 'Ministerstwo Energii', 'ME', 'MINISTRY', 'PSL',
  'https://www.gov.pl/web/energia', 'https://www.gov.pl/web/energia/kierownictwo'
)
ON CONFLICT (code) DO UPDATE SET
  name_pl = EXCLUDED.name_pl,
  short_name = EXCLUDED.short_name,
  coalition_party = EXCLUDED.coalition_party,
  website_url = EXCLUDED.website_url,
  bip_url = EXCLUDED.bip_url,
  is_active = TRUE;

-- Known departures and transfers reported by the official government pages.
UPDATE officials SET is_active = FALSE, updated_at = NOW()
WHERE full_name IN ('Andrzej Szejna', 'Michał Kołodziejczak');

UPDATE officials
SET ministry_id = '10000000-0000-0000-0000-000000000028',
    role_title = 'Minister Energii', role_category = 'MINISTER',
    coalition_party = 'PSL', is_active = TRUE, updated_at = NOW()
WHERE full_name = 'Miłosz Motyka';

-- Current ministerial leadership from the KPRM roster (22 October 2026).
WITH current_ministers(ministry_code, full_name, role_title, party) AS (
  VALUES
    ('MF', 'Andrzej Domański', 'Minister Finansów i Gospodarki', 'KO'),
    ('MSZ', 'Radosław Sikorski', 'Minister Spraw Zagranicznych', 'KO'),
    ('MON', 'Władysław Kosiniak-Kamysz', 'Wiceprezes Rady Ministrów, Minister Obrony Narodowej', 'PSL'),
    ('MSWiA', 'Marcin Kierwiński', 'Minister Spraw Wewnętrznych i Administracji', 'KO'),
    ('MS', 'Waldemar Żurek', 'Minister Sprawiedliwości', 'KO'),
    ('MAP', 'Wojciech Balczun', 'Minister Aktywów Państwowych', 'KO'),
    ('MRiT', 'Krzysztof Paszyk', 'Minister Rozwoju i Technologii', 'PSL'),
    ('MKiŚ', 'Paulina Hennig-Kloska', 'Minister Klimatu i Środowiska', 'POLSKA_2050'),
    ('MRPiPS', 'Agnieszka Dziemianowicz-Bąk', 'Minister Rodziny, Pracy i Polityki Społecznej', 'NOWA_LEWICA'),
    ('MZ', 'Jolanta Sobierańska-Grenda', 'Minister Zdrowia', 'NON_PARTISAN'),
    ('MEN', 'Barbara Nowacka', 'Minister Edukacji', 'KO'),
    ('MNiSW', 'Marcin Kulasek', 'Minister Nauki i Szkolnictwa Wyższego', 'NOWA_LEWICA'),
    ('MI', 'Dariusz Klimczak', 'Minister Infrastruktury', 'PSL'),
    ('MRiRW', 'Stefan Krajewski', 'Minister Rolnictwa i Rozwoju Wsi', 'PSL'),
    ('MC', 'Krzysztof Gawkowski', 'Wiceprezes Rady Ministrów, Minister Cyfryzacji', 'NOWA_LEWICA'),
    ('MKiDN', 'Marta Cienkowska', 'Minister Kultury i Dziedzictwa Narodowego', 'KO'),
    ('MSiT', 'Jakub Rutnicki', 'Minister Sportu i Turystyki', 'KO'),
    ('ME', 'Miłosz Motyka', 'Minister Energii', 'PSL'),
    ('MFiPR', 'Katarzyna Pełczyńska-Nałęcz', 'Minister Funduszy i Polityki Regionalnej', 'POLSKA_2050')
)
UPDATE officials o
SET full_name = c.full_name, role_title = c.role_title, coalition_party = c.party,
    is_active = TRUE, updated_at = NOW()
FROM current_ministers c
JOIN ministries_and_bodies m ON m.code = c.ministry_code
WHERE o.ministry_id = m.id AND o.role_category IN ('MINISTER', 'WICEPREMIER');

-- Deactivate historical ministry leadership not present in the current official pages.
UPDATE officials SET is_active = FALSE, updated_at = NOW()
WHERE full_name IN (
  'Adam Bodnar', 'Jakub Jaworowski', 'Czesław Siekierski', 'Hanna Wróblewska',
  'Sławomir Nitras', 'Marzena Czarnecka', 'Dariusz Wieczorek', 'Adam Szłapka'
);

-- Current leadership explicitly published by MSZ, MRiRW and the Ministry of Energy.
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('21000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Władysław Teofil Bartoszewski', 'Sekretarz Stanu', 'WICEMINISTER', 'PSL', ARRAY['Sprawy pozaeuropejskie', 'Dyplomacja ekonomiczna'], TRUE),
  ('21000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Marcin Bosacki', 'Sekretarz Stanu', 'WICEMINISTER', 'KO', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Ignacy Niemczycki', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'Artur Harazim', 'Dyrektor Generalny', 'RZECZNIK', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000015', 'Jacek Czerniak', 'Sekretarz Stanu', 'WICEMINISTER', 'PSL', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000015', 'Małgorzata Gromadzka', 'Podsekretarz Stanu', 'WICEMINISTER', 'KO', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000015', 'Adam Nowak', 'Podsekretarz Stanu', 'WICEMINISTER', 'PSL', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000028', 'Wojciech Wrochna', 'Sekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000028', 'Piotr Paweł Masłowski', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('21000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000028', 'Konrad Wojnarowski', 'Podsekretarz Stanu', 'WICEMINISTER', 'PSL', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id, full_name = EXCLUDED.full_name, role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category, coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities, is_active = TRUE, updated_at = NOW();

UPDATE ministries_and_bodies SET is_active = TRUE, updated_at = NOW()
WHERE code IN ('MF','MSZ','MON','MSWiA','MS','MAP','MRiT','MKiŚ','MRPiPS','MZ','MEN','MNiSW','MI','MRiRW','MC','MKiDN','MSiT','ME','MFiPR');
