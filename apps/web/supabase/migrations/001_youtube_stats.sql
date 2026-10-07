-- Migration: Create youtube_stats table for tracking YouTube video statistics
-- This replaces the Sanity-based youtubeUpdateTask queue with a Supabase table

CREATE TABLE IF NOT EXISTS youtube_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_doc_id text NOT NULL UNIQUE,
  sanity_doc_type text NOT NULL,
  youtube_id text NOT NULL,
  youtube_url text,
  view_count bigint DEFAULT 0,
  like_count bigint DEFAULT 0,
  comment_count bigint DEFAULT 0,
  favorite_count bigint DEFAULT 0,
  last_fetched_at timestamptz,
  last_synced_to_sanity_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index on youtube_id for lookups by video ID
CREATE INDEX IF NOT EXISTS idx_youtube_stats_youtube_id ON youtube_stats (youtube_id);

-- Index on last_fetched_at for finding stale/never-fetched records
CREATE INDEX IF NOT EXISTS idx_youtube_stats_last_fetched_at ON youtube_stats (last_fetched_at NULLS FIRST);

-- Trigger function to auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_youtube_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_youtube_stats_updated_at
  BEFORE UPDATE ON youtube_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_youtube_stats_updated_at();

-- RPC function to get records that need syncing to Sanity
-- (where last_fetched_at > last_synced_to_sanity_at, or never synced)
CREATE OR REPLACE FUNCTION get_unsynced_youtube_stats(batch_limit int DEFAULT 50)
RETURNS SETOF youtube_stats AS $$
  SELECT *
  FROM youtube_stats
  WHERE last_fetched_at IS NOT NULL
    AND (last_synced_to_sanity_at IS NULL OR last_fetched_at > last_synced_to_sanity_at)
  ORDER BY last_fetched_at DESC
  LIMIT batch_limit;
$$ LANGUAGE sql STABLE;
