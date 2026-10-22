-- Live source provenance, deduplication and read-only public access.
-- Workers write through the database connection; browser clients can only
-- read rows explicitly marked as verified and backed by an official URL.

ALTER TABLE official_statements
    ADD COLUMN IF NOT EXISTS source_key TEXT,
    ADD COLUMN IF NOT EXISTS content_hash TEXT,
    ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;

ALTER TABLE legislative_initiatives
    ADD COLUMN IF NOT EXISTS source_key TEXT,
    ADD COLUMN IF NOT EXISTS content_hash TEXT,
    ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;

ALTER TABLE narrative_conflicts
    ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE media_coverage
    ADD COLUMN IF NOT EXISTS source_key TEXT,
    ADD COLUMN IF NOT EXISTS content_hash TEXT,
    ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ;

ALTER TABLE alerts
    ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS ingestion_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_key TEXT NOT NULL UNIQUE,
    source_name TEXT NOT NULL,
    source_kind TEXT NOT NULL,
    endpoint_url TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    last_success_at TIMESTAMPTZ,
    last_error_at TIMESTAMPTZ,
    last_error TEXT,
    records_ingested BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_key TEXT NOT NULL REFERENCES ingestion_sources(source_key) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCEEDED', 'FAILED', 'PARTIAL')),
    records_seen INTEGER NOT NULL DEFAULT 0,
    records_written INTEGER NOT NULL DEFAULT 0,
    error TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_official_statements_source_hash
    ON official_statements (source_key, content_hash)
    WHERE source_key IS NOT NULL AND content_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_legislative_initiatives_source_hash
    ON legislative_initiatives (source_key, content_hash)
    WHERE source_key IS NOT NULL AND content_hash IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_media_coverage_source_hash
    ON media_coverage (source_key, content_hash)
    WHERE source_key IS NOT NULL AND content_hash IS NOT NULL;

ALTER TABLE ingestion_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries_and_bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE official_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislative_initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE narrative_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_coverage ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reference_ministries" ON ministries_and_bodies;
DROP POLICY IF EXISTS "public_read_reference_officials" ON officials;
DROP POLICY IF EXISTS "public_read_verified_statements" ON official_statements;
DROP POLICY IF EXISTS "public_read_verified_initiatives" ON legislative_initiatives;
DROP POLICY IF EXISTS "public_read_verified_conflicts" ON narrative_conflicts;
DROP POLICY IF EXISTS "public_read_verified_media" ON media_coverage;
DROP POLICY IF EXISTS "public_read_verified_alerts" ON alerts;
DROP POLICY IF EXISTS "public_read_ingestion_sources" ON ingestion_sources;

CREATE POLICY "public_read_reference_ministries"
    ON ministries_and_bodies FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "public_read_reference_officials"
    ON officials FOR SELECT TO anon, authenticated USING (is_active = TRUE);
CREATE POLICY "public_read_verified_statements"
    ON official_statements FOR SELECT TO anon, authenticated
    USING (verified = TRUE AND source_url IS NOT NULL);
CREATE POLICY "public_read_verified_initiatives"
    ON legislative_initiatives FOR SELECT TO anon, authenticated
    USING (verified = TRUE AND source_url IS NOT NULL);
CREATE POLICY "public_read_verified_conflicts"
    ON narrative_conflicts FOR SELECT TO anon, authenticated
    USING (verified = TRUE);
CREATE POLICY "public_read_verified_media"
    ON media_coverage FOR SELECT TO anon, authenticated
    USING (verified = TRUE AND source_url IS NOT NULL);
CREATE POLICY "public_read_verified_alerts"
    ON alerts FOR SELECT TO anon, authenticated
    USING (verified = TRUE);
CREATE POLICY "public_read_ingestion_sources"
    ON ingestion_sources FOR SELECT TO anon, authenticated USING (enabled = TRUE);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT SELECT ON ministries_and_bodies, officials, official_statements,
    legislative_initiatives, narrative_conflicts, media_coverage, alerts,
    ingestion_sources TO anon, authenticated;

INSERT INTO ingestion_sources (source_key, source_name, source_kind, endpoint_url)
VALUES
    ('sejm_api', 'API Sejmu', 'JSON_API', 'https://api.sejm.gov.pl/'),
    ('sejm_eli_api', 'ELI / akty prawne', 'JSON_API', 'https://api.sejm.gov.pl/eli/'),
    ('govpl_premier', 'Gov.pl KPRM', 'RSS_OR_HTML', 'https://www.gov.pl/web/premier'),
    ('rcl_wpl_rm', 'Wykaz prac legislacyjnych RM', 'HTML', 'https://www.gov.pl/web/premier/wplip-rm'),
    ('rcl_wpl_prm', 'Wykaz prac legislacyjnych PRM', 'HTML', 'https://www.gov.pl/web/premier/wpl-prm'),
    ('consilium_rss', 'Rada Unii Europejskiej', 'RSS', 'https://www.consilium.europa.eu/en/about-site/rss/'),
    ('gus_rss', 'Główny Urząd Statystyczny', 'RSS', 'https://stat.gov.pl/rss/'),
    ('uokik_rss', 'UOKiK', 'RSS', 'https://www.uokik.gov.pl/public/rss'),
    ('cuw_rss', 'Centralny Urząd Administracji', 'RSS', 'https://bip.centrum.gov.pl/cuw/rss'),
    ('pap_mediaroom', 'PAP MediaRoom', 'RSS', 'https://pap-mediaroom.pl/rss'),
    ('pap_samorzad', 'Serwis Samorządowy PAP', 'RSS', 'https://samorzad.pap.pl/rss.xml'),
    ('rmf24', 'RMF24', 'RSS', 'https://www.rmf24.pl/fakty/polska/feed'),
    ('tvn24', 'TVN24', 'RSS', 'https://tvn24.pl/wiadomosci-z-kraju,3.xml'),
    ('polsat_news', 'Polsat News', 'RSS', 'https://www.polsatnews.pl/rss/wszystkie.xml'),
    ('rzeczpospolita', 'Rzeczpospolita', 'RSS', 'https://www.rp.pl/rss_main'),
    ('wirtualne_media', 'Wirtualne Media', 'RSS', 'https://www.wirtualnemedia.pl/rss/wirtualnemedia_rss.xml')
ON CONFLICT (source_key) DO UPDATE SET
    source_name = EXCLUDED.source_name,
    source_kind = EXCLUDED.source_kind,
    endpoint_url = EXCLUDED.endpoint_url,
    updated_at = NOW();
