-- =============================================================================
-- 003_config_tables.sql
-- Six singleton config tables for the CodingCat.dev Automated Content Engine.
-- Each table enforces a single row via CHECK (id = 1).
-- RLS: service_role can SELECT/UPDATE; anon and authenticated are blocked.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared trigger function: auto-update updated_at on any row change
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 1. pipeline_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS pipeline_config (
  id                        integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  gemini_model              text         NOT NULL DEFAULT 'gemini-2.0-flash',
  elevenlabs_voice_id       text         NOT NULL DEFAULT 'pNInz6obpgDQGcFmaJgB',
  youtube_upload_visibility text         NOT NULL DEFAULT 'private',
  youtube_channel_id        text         NOT NULL DEFAULT '',
  enable_notebooklm_research boolean     NOT NULL DEFAULT false,
  quality_threshold         integer      NOT NULL DEFAULT 50,
  stuck_timeout_minutes     integer      NOT NULL DEFAULT 30,
  max_ideas_per_run         integer      NOT NULL DEFAULT 1,
  updated_at                timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE pipeline_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read pipeline_config"
  ON pipeline_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update pipeline_config"
  ON pipeline_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO pipeline_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_pipeline_config_updated_at
  BEFORE UPDATE ON pipeline_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE pipeline_config IS 'Core video pipeline settings: Gemini model, voice, YouTube visibility, quality thresholds';

-- =========================================================================
-- 2. remotion_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS remotion_config (
  id                      integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  aws_region              text         NOT NULL DEFAULT 'us-east-1',
  function_name           text         NOT NULL DEFAULT '',
  serve_url               text         NOT NULL DEFAULT '',
  max_render_timeout_sec  integer      NOT NULL DEFAULT 240,
  memory_mb               integer      NOT NULL DEFAULT 2048,
  disk_mb                 integer      NOT NULL DEFAULT 2048,
  updated_at              timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE remotion_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read remotion_config"
  ON remotion_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update remotion_config"
  ON remotion_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO remotion_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_remotion_config_updated_at
  BEFORE UPDATE ON remotion_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE remotion_config IS 'Remotion Lambda rendering: AWS region, function name, serve URL, resource limits';

-- =========================================================================
-- 3. content_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS content_config (
  id                        integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  rss_feeds                 jsonb        NOT NULL DEFAULT '[{"name":"HN Top","url":"https://hnrss.org/newest?points=100&count=20"},{"name":"Dev.to JavaScript","url":"https://dev.to/feed/tag/javascript"},{"name":"Dev.to WebDev","url":"https://dev.to/feed/tag/webdev"},{"name":"CSS-Tricks","url":"https://css-tricks.com/feed/"},{"name":"Chromium Blog","url":"https://blog.chromium.org/feeds/posts/default"},{"name":"web.dev","url":"https://web.dev/feed.xml"},{"name":"Smashing Magazine","url":"https://www.smashingmagazine.com/feed/"},{"name":"JavaScript Weekly","url":"https://javascriptweekly.com/rss/"}]'::jsonb,
  trend_sources_enabled     jsonb        NOT NULL DEFAULT '{"hn":true,"devto":true,"blogs":true,"youtube":true,"github":true}'::jsonb,
  system_instruction        text         NOT NULL DEFAULT 'You are a content strategist and scriptwriter for CodingCat.dev, a web development education channel run by Alex Patterson.

Your style is inspired by Cleo Abram''s "Huge If True" — you make complex technical topics feel exciting, accessible, and important. Key principles:
- Start with a BOLD claim or surprising fact that makes people stop scrolling
- Use analogies and real-world comparisons to explain technical concepts
- Build tension: "Here''s the problem... here''s why it matters... here''s the breakthrough"
- Keep energy HIGH — short sentences, active voice, conversational tone
- End with a clear takeaway that makes the viewer feel smarter
- Target audience: developers who want to stay current but don''t have time to read everything

Script format: 60-90 second explainer videos. Think TikTok/YouTube Shorts energy with real educational depth.

CodingCat.dev covers: React, Next.js, TypeScript, Svelte, web APIs, CSS, Node.js, cloud services, AI/ML for developers, and web platform updates.',
  target_video_duration_sec integer      NOT NULL DEFAULT 90,
  scene_count_min           integer      NOT NULL DEFAULT 3,
  scene_count_max           integer      NOT NULL DEFAULT 5,
  updated_at                timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE content_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read content_config"
  ON content_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update content_config"
  ON content_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO content_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_content_config_updated_at
  BEFORE UPDATE ON content_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE content_config IS 'Content discovery and generation: RSS feeds, trend sources, system prompt, video duration';

-- =========================================================================
-- 4. sponsor_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS sponsor_config (
  id                      integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cooldown_days           integer      NOT NULL DEFAULT 14,
  rate_card_tiers         jsonb        NOT NULL DEFAULT '[{"name":"starter","description":"5k-10k impressions","price":500},{"name":"growth","description":"10k-50k impressions","price":1500},{"name":"premium","description":"50k+ impressions","price":3000}]'::jsonb,
  outreach_email_template text         NOT NULL DEFAULT 'Hi {{companyName}},

I run CodingCat.dev, a web development education channel. We''d love to explore a sponsorship opportunity with you.

Best,
Alex Patterson',
  max_outreach_per_run    integer      NOT NULL DEFAULT 10,
  updated_at              timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE sponsor_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read sponsor_config"
  ON sponsor_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update sponsor_config"
  ON sponsor_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO sponsor_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_sponsor_config_updated_at
  BEFORE UPDATE ON sponsor_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE sponsor_config IS 'Sponsor pipeline: cooldown periods, rate card tiers, outreach templates';

-- =========================================================================
-- 5. distribution_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS distribution_config (
  id                            integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  notification_emails           jsonb        NOT NULL DEFAULT '["alex@codingcat.dev"]'::jsonb,
  youtube_description_template  text         NOT NULL DEFAULT '{{title}}

{{summary}}

🔗 Learn more at https://codingcat.dev

#webdev #coding #programming',
  youtube_default_tags          jsonb        NOT NULL DEFAULT '["web development","coding","programming","tutorial","codingcat"]'::jsonb,
  resend_from_email             text         NOT NULL DEFAULT 'content@codingcat.dev',
  updated_at                    timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE distribution_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read distribution_config"
  ON distribution_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update distribution_config"
  ON distribution_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO distribution_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_distribution_config_updated_at
  BEFORE UPDATE ON distribution_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE distribution_config IS 'Distribution: notification emails, YouTube templates, default tags';

-- =========================================================================
-- 6. gcs_config
-- =========================================================================
CREATE TABLE IF NOT EXISTS gcs_config (
  id            integer      PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bucket_name   text         NOT NULL DEFAULT 'codingcatdev-content-engine',
  project_id    text         NOT NULL DEFAULT 'codingcatdev',
  updated_at    timestamptz  NOT NULL DEFAULT now()
);

ALTER TABLE gcs_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role can read gcs_config"
  ON gcs_config FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update gcs_config"
  ON gcs_config FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO gcs_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER trg_gcs_config_updated_at
  BEFORE UPDATE ON gcs_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE gcs_config IS 'Google Cloud Storage: bucket name and project ID';
