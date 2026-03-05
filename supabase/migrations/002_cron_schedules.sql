-- ==========================================================================
-- pg_cron schedules for CodingCat.dev automated video pipeline
-- ==========================================================================
--
-- Prerequisites:
--   These Supabase config vars must be set before running this migration:
--     ALTER DATABASE postgres SET app.site_url = 'https://your-vercel-url.vercel.app';
--     ALTER DATABASE postgres SET app.cron_secret = 'your-cron-secret-here';
--
--   You can set them in the Supabase dashboard under Database → Extensions,
--   or via SQL in the SQL Editor.
--
-- Pipeline flow:
--   1. ingest-daily     → discovers trends, creates Sanity doc (status: "researching" or "script_ready")
--   2. check-research   → polls NotebookLM, enriches script, transitions to "script_ready"
--   3. check-renders    → audio gen → Remotion render → upload → publish
--   4. sponsor-outreach → automated sponsor discovery + outreach emails
-- ==========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ---------------------------------------------------------------------------
-- Remove any existing schedules (idempotent re-runs)
-- ---------------------------------------------------------------------------
-- pg_cron's unschedule() throws if the job doesn't exist, so we use DO blocks
DO $$
BEGIN
  PERFORM cron.unschedule('ingest-daily');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('check-research');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('check-renders');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('sponsor-outreach');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Schedule: Ingest — daily at 10:00 UTC
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'ingest-daily',
  '0 10 * * *',
  $$SELECT net.http_get(
    url := current_setting('app.site_url') || '/api/cron/ingest',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
  )$$
);

-- ---------------------------------------------------------------------------
-- Schedule: Check Research — every 5 minutes
-- Polls NotebookLM for docs in "researching" status
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'check-research',
  '*/5 * * * *',
  $$SELECT net.http_get(
    url := current_setting('app.site_url') || '/api/cron/check-research',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
  )$$
);

-- ---------------------------------------------------------------------------
-- Schedule: Check Renders — every 5 minutes
-- Polls Remotion render status, uploads completed videos
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'check-renders',
  '*/5 * * * *',
  $$SELECT net.http_get(
    url := current_setting('app.site_url') || '/api/cron/check-renders',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
  )$$
);

-- ---------------------------------------------------------------------------
-- Schedule: Sponsor Outreach — Mon/Thu at 09:00 UTC
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'sponsor-outreach',
  '0 9 * * 1,4',
  $$SELECT net.http_get(
    url := current_setting('app.site_url') || '/api/cron/sponsor-outreach',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
  )$$
);
