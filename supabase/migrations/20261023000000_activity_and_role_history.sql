-- Track administrative changes separately from the current roster and expose
-- source-backed government activity to the read-only operational frontend.

CREATE TABLE IF NOT EXISTS official_role_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
    ministry_id UUID REFERENCES ministries_and_bodies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    role_category VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
    effective_at TIMESTAMPTZ NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_url TEXT NOT NULL,
    change_reason TEXT,
    verified BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_official_role_history_official
    ON official_role_history (official_id, effective_at DESC);
CREATE INDEX IF NOT EXISTS idx_official_role_history_observed
    ON official_role_history (observed_at DESC);

CREATE TABLE IF NOT EXISTS government_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ministry_id UUID REFERENCES ministries_and_bodies(id) ON DELETE SET NULL,
    official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
    activity_type VARCHAR(30) NOT NULL CHECK (activity_type IN ('CONFERENCE', 'MEETING', 'ANNOUNCEMENT', 'OTHER')),
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    location TEXT,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_key TEXT,
    content_hash TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_government_activities_starts_at
    ON government_activities (starts_at ASC);
CREATE INDEX IF NOT EXISTS idx_government_activities_ministry
    ON government_activities (ministry_id, starts_at ASC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_government_activities_source_hash
    ON government_activities (source_key, content_hash)
    WHERE source_key IS NOT NULL AND content_hash IS NOT NULL;

ALTER TABLE official_role_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_verified_role_history" ON official_role_history;
DROP POLICY IF EXISTS "public_read_verified_activities" ON government_activities;

CREATE POLICY "public_read_verified_role_history"
    ON official_role_history FOR SELECT TO anon, authenticated
    USING (verified = TRUE AND source_url IS NOT NULL);
CREATE POLICY "public_read_verified_activities"
    ON government_activities FOR SELECT TO anon, authenticated
    USING (verified = TRUE AND source_url IS NOT NULL);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON official_role_history, government_activities FROM anon, authenticated;
GRANT SELECT ON official_role_history, government_activities TO anon, authenticated;

-- The 22 October roster correction: preserve both people in role history, but
-- remove them from the current MFiPR leadership drawer immediately.
UPDATE officials
SET is_active = FALSE, updated_at = NOW()
WHERE ministry_id = (SELECT id FROM ministries_and_bodies WHERE code = 'MFiPR')
  AND full_name IN ('Jan Szyszko', 'Katarzyna Pełczyńska-Nałęcz');

INSERT INTO official_role_history
    (official_id, ministry_id, full_name, role_title, role_category, status, effective_at, source_url, change_reason)
SELECT id,
       ministry_id,
       full_name,
       role_title,
       role_category,
       'INACTIVE',
       TIMESTAMPTZ '2026-10-22 00:00:00+02',
       'https://www.gov.pl/web/fundusze-regiony/kierownictwo-ministerstwa',
       'Usunięcie z aktualnego składu kierownictwa MFiPR'
FROM officials
WHERE ministry_id = (SELECT id FROM ministries_and_bodies WHERE code = 'MFiPR')
  AND full_name IN ('Jan Szyszko', 'Katarzyna Pełczyńska-Nałęcz')
  AND NOT EXISTS (
      SELECT 1
      FROM official_role_history history
      WHERE history.official_id = officials.id
        AND history.status = 'INACTIVE'
        AND history.effective_at = TIMESTAMPTZ '2026-10-22 00:00:00+02'
  );
