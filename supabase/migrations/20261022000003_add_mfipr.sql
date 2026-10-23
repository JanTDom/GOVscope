-- MFiPR is a current ministry in the official KPRM roster and must be available
-- before the automatic administration synchroniser activates its minister.
INSERT INTO ministries_and_bodies (id, code, name_pl, short_name, body_type, coalition_party, website_url, bip_url)
VALUES (
  '10000000-0000-0000-0000-000000000029', 'MFiPR', 'Ministerstwo Funduszy i Polityki Regionalnej', 'MFiPR', 'MINISTRY', 'POLSKA_2050',
  'https://www.gov.pl/web/fundusze-regiony', 'https://www.gov.pl/web/fundusze-regiony/bip'
)
ON CONFLICT (code) DO UPDATE SET
  name_pl = EXCLUDED.name_pl,
  short_name = EXCLUDED.short_name,
  coalition_party = EXCLUDED.coalition_party,
  website_url = EXCLUDED.website_url,
  bip_url = EXCLUDED.bip_url,
  is_active = TRUE,
  updated_at = NOW();
