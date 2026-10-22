-- Ingestion run history is internal operational telemetry, never a public API table.
ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_public_ingestion_runs" ON ingestion_runs;
CREATE POLICY "deny_public_ingestion_runs"
    ON ingestion_runs FOR SELECT TO anon, authenticated USING (FALSE);
REVOKE ALL ON ingestion_runs FROM anon, authenticated;
