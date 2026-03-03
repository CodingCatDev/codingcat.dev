# YouTube Stats Architecture

## Overview

This document describes the redesigned YouTube views tracking system for codingcat.dev. The system fetches YouTube video statistics (views, likes, comments, favorites) and stores them on Sanity content documents.

## The Old Approach (and Its Problems)

The previous implementation used **Sanity as a task queue**:

1. Created `youtubeUpdateTask` documents in Sanity with status fields (`pending`, `inProgress`, `completed`, `error`)
2. Every cron run would:
   - Query pending tasks from Sanity
   - Mark each task as `inProgress` (N writes)
   - Fetch YouTube API statistics
   - Update target content documents (N writes)
   - Mark tasks as `completed` (N writes)
3. When the queue was empty, it re-fetched ALL posts and podcasts with YouTube URLs (up to 2,000 docs), checked for existing tasks, and created/reset them

**Problems:**
- **3N+ Sanity mutations per cron run** just for tracking state, plus the actual stats updates
- Sanity is not designed to be a task queue — this was expensive and slow
- No separation between polling state and content updates
- Error recovery was complex and fragile
- Each cron run could generate hundreds of Sanity API calls

## The New Approach

The redesigned system uses a **three-phase pipeline** with Supabase as the tracking layer:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. DISCOVER │ ──▶ │  2. FETCH    │ ──▶ │  3. SYNC     │
│  Sanity →    │     │  YouTube →   │     │  Supabase →  │
│  Supabase    │     │  Supabase    │     │  Sanity      │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Phase 1: Discover (`syncSanityVideosToSupabase`)

- Queries Sanity for all posts/podcasts with YouTube URLs
- Upserts them into the `youtube_stats` Supabase table
- This creates a **registry** of all videos we need to track
- Idempotent — safe to run repeatedly

### Phase 2: Fetch (`fetchAndStoreYouTubeStats`)

- Queries Supabase for records ordered by `last_fetched_at ASC NULLS FIRST` (oldest/never-fetched first)
- Calls the YouTube Data API v3 for their statistics (batched in groups of 50)
- Updates the Supabase rows with the latest stats
- **Zero Sanity writes** — all state is in Supabase

### Phase 3: Sync (`pushStatsToSanity`)

- Queries Supabase for records where `last_fetched_at > last_synced_to_sanity_at` (or never synced)
- Patches the corresponding Sanity documents with the statistics
- Updates `last_synced_to_sanity_at` after successful push
- **Only writes to Sanity when we have actual data to update**

### Why This Is Better

| Aspect | Old | New |
|--------|-----|-----|
| Sanity writes per cron | 3N+ (task state + content) | N (content only, when changed) |
| Task queue | Sanity documents | Supabase table |
| State tracking | Sanity mutations | Supabase updates (cheap) |
| Error recovery | Complex status management | Simple: re-fetch stale records |
| Phases | Monolithic | Independent, can run separately |

## Database Schema

The `youtube_stats` table in Supabase:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `sanity_doc_id` | text (UNIQUE) | Sanity document `_id` |
| `sanity_doc_type` | text | "post" or "podcast" |
| `youtube_id` | text | YouTube video ID |
| `youtube_url` | text | Original URL |
| `view_count` | bigint | YouTube view count |
| `like_count` | bigint | YouTube like count |
| `comment_count` | bigint | YouTube comment count |
| `favorite_count` | bigint | YouTube favorite count |
| `last_fetched_at` | timestamptz | Last YouTube API fetch |
| `last_synced_to_sanity_at` | timestamptz | Last Sanity push |
| `created_at` | timestamptz | Row creation time |
| `updated_at` | timestamptz | Auto-updated on change |

Indexes:
- `youtube_id` — for lookups by video ID
- `last_fetched_at` (NULLS FIRST) — for finding stale records

## Running the Migration

Apply the migration to your Supabase project:

```bash
# Using Supabase CLI (if linked)
supabase db push

# Or apply directly via psql
psql "$DATABASE_URL" -f supabase/migrations/001_youtube_stats.sql

# Or apply via the Supabase Dashboard SQL Editor
# Copy the contents of supabase/migrations/001_youtube_stats.sql and run it
```

## API Endpoint

```
POST /api/youtube/views
Authorization: Bearer <CRON_SECRET>
```

Query parameters:
- `?action=discover` — run Phase 1 only
- `?action=fetch` — run Phase 2 only
- `?action=sync` — run Phase 3 only
- No action — run all three phases in sequence

## Cron Configuration (Supabase)

The cron is triggered by **Supabase cron jobs** (via `pg_cron` + `pg_net`), which call the existing `GET /api/cron` gateway route. That route fire-and-forgets a `POST /api/youtube/views` internally, so it returns immediately and won't time out.

### How it works

```
Supabase pg_cron
  → HTTP GET /api/cron?action=...  (Bearer CRON_SECRET)
    → fire-and-forget POST /api/youtube/views?action=...  (Bearer CRON_SECRET)
      → runs discover / fetch / sync phases
```

### Recommended Supabase cron jobs

Set these up in the Supabase Dashboard → SQL Editor (or via a migration):

```sql
-- Enable the extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 1. Discover new videos once per day at 3am UTC
SELECT cron.schedule(
  'youtube-stats-discover',
  '0 3 * * *',
  $$
  SELECT net.http_get(
    url := 'https://codingcat.dev/api/cron?action=discover',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
      'Cache-Control', 'no-cache'
    )
  );
  $$
);

-- 2. Fetch YouTube stats every hour
SELECT cron.schedule(
  'youtube-stats-fetch',
  '0 * * * *',
  $$
  SELECT net.http_get(
    url := 'https://codingcat.dev/api/cron?action=fetch',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
      'Cache-Control', 'no-cache'
    )
  );
  $$
);

-- 3. Sync stats to Sanity every hour, offset by 30 minutes
SELECT cron.schedule(
  'youtube-stats-sync',
  '30 * * * *',
  $$
  SELECT net.http_get(
    url := 'https://codingcat.dev/api/cron?action=sync',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
      'Cache-Control', 'no-cache'
    )
  );
  $$
);
```

> **Note:** You'll need to set `app.settings.cron_secret` in your Supabase project settings,
> or replace `current_setting('app.settings.cron_secret')` with your actual `CRON_SECRET` value.
> Alternatively, if you already have a single cron job calling `/api/cron` (the existing setup),
> you can keep that as-is — it will run all three phases in sequence by default.

### Simple option: keep the existing single cron

If you'd rather not set up three separate cron jobs, the existing Supabase cron that calls `GET /api/cron` (no action param) will run **all three phases** in sequence. This is the simplest setup:

```sql
-- Single cron: runs discover → fetch → sync every day at midnight
SELECT cron.schedule(
  'youtube-stats-all',
  '0 0 * * *',
  $$
  SELECT net.http_get(
    url := 'https://codingcat.dev/api/cron',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret'),
      'Cache-Control', 'no-cache'
    )
  );
  $$
);
```

### Managing cron jobs

```sql
-- List all scheduled jobs
SELECT * FROM cron.job;

-- Unschedule a job
SELECT cron.unschedule('youtube-stats-discover');

-- Check recent job runs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
```

## Environment Variables Required

- `YOUTUBE_API_KEY` — YouTube Data API v3 key (read-only stats)
- `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (bypasses RLS)
- `SANITY_API_WRITE_TOKEN` — Sanity API token with write access
- `CRON_SECRET` — Bearer token for authenticating cron requests
- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name
