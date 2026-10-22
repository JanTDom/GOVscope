-- Correct roles that were present in the historical seed but are not current.
-- The official KPRM senior-policy page identifies Marzena Okła-Drewnowicz as
-- Secretary of State in KPRM and Government Plenipotentiary, not a minister.
UPDATE officials
SET role_title = 'Sekretarz Stanu w KPRM, Pełnomocnik Rządu do spraw Polityki Senioralnej',
    role_category = 'PELNOMOCNIK',
    is_active = TRUE,
    updated_at = NOW()
WHERE full_name = 'Marzena Okła-Drewnowicz';

-- Maciej Berek took the oath as a Constitutional Tribunal judge on 14 October
-- 2026 and must not remain in the active KPRM roster.
UPDATE officials
SET is_active = FALSE,
    role_title = 'Były Minister - Członek RM, były Przewodniczący Stałego Komitetu Rady Ministrów',
    updated_at = NOW()
WHERE full_name = 'Maciej Berek';

UPDATE ministries_and_bodies
SET name_pl = 'Pełnomocnik Rządu do spraw Polityki Senioralnej',
    short_name = 'Seniorzy',
    updated_at = NOW()
WHERE code = 'M_SENIOR';

-- The MAP page currently publishes the complete leadership team. Keep these
-- rows source-backed instead of displaying only the minister from the KPRM
-- roster.
INSERT INTO officials (id, ministry_id, full_name, role_title, role_category, coalition_party, responsibilities, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000007', 'Wojciech Balczun', 'Minister Aktywów Państwowych', 'MINISTER', 'KO', ARRAY[]::TEXT[], TRUE),
  ('22000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000007', 'Eliza Zeidler', 'Sekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('22000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000007', 'Konrad Gołota', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('22000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000007', 'Grzegorz Wrona', 'Podsekretarz Stanu', 'WICEMINISTER', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE),
  ('22000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000007', 'Przemysław Ciszak', 'Dyrektor Generalny', 'RZECZNIK', 'NON_PARTISAN', ARRAY[]::TEXT[], TRUE)
ON CONFLICT (id) DO UPDATE SET
  ministry_id = EXCLUDED.ministry_id,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  role_category = EXCLUDED.role_category,
  coalition_party = EXCLUDED.coalition_party,
  responsibilities = EXCLUDED.responsibilities,
  is_active = TRUE,
  updated_at = NOW();
