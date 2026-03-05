-- ==========================================================================
-- pg_cron schedules for CodingCat.dev automated video pipeline
-- ==========================================================================
--
-- Prerequisites:
--   These Supabase config vars must be set before running this migration:
--     ALTER DATABASE postgres SET app.site_url = 'https://codingcat.dev';
--     ALTER DATABASE postgres SET app.cron_secret = 'your-cron-secret-here';
--
--   You can set them in the Supabase dashboard under Database → Extensions,
--   or via SQL in the SQL Editor.
--
-- Pipeline flow:
--   1. youtube-stats    → daily YouTube analytics sync (renamed from daily-cron)
--   2. ingest-daily     → discovers trends, creates Sanity doc (status: "researching" or "script_ready")
--   3. check-research   → polls NotebookLM, enriches script, transitions to "script_ready"
--   4. check-renders    → audio gen → Remotion render → upload → publish
--   5. sponsor-outreach → automated sponsor discovery + outreach emails
-- ==========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ---------------------------------------------------------------------------
-- Remove old/renamed schedules (idempotent re-runs)
-- ---------------------------------------------------------------------------
-- pg_cron's unschedule() throws if the job doesn't exist, so we use DO blocks

-- Old name → renamed to youtube-stats
DO $$
BEGIN
  PERFORM cron.unschedule('daily-cron');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Old name → replaced by ingest-daily
DO $$
BEGIN
  PERFORM cron.unschedule('daily-content-ingest');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Remove our own jobs too (for idempotent re-runs)
DO $$
BEGIN
  PERFORM cron.unschedule('youtube-stats');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

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
-- Schedule: YouTube Stats — daily at midnight UTC (renamed from daily-cron)
-- ---------------------------------------------------------------------------
SELECT cron.schedule(
  'youtube-stats',
  '0 0 * * *',
  $$SELECT net.http_get(
    url := current_setting('app.site_url') || '/api/cron',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
  )$$
);

-- ---------------------------------------------------------------------------
-- Schedule: Ingest — daily at 10:00 UTC
-- Discovers trending topics, creates Sanity doc, starts NotebookLM research
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
