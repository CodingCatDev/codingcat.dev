# Umami Analytics Setup

## Overview
Umami is self-hosted on Vercel + Supabase for $0/month analytics.

## Setup Steps

### 1. Fork Umami
Fork https://github.com/umami-is/umami to the CodingCatDev GitHub org.

### 2. Create Umami tables in Supabase
Run the Umami PostgreSQL schema in your Supabase SQL editor.
See: https://umami.is/docs/install

### 3. Deploy to Vercel
- Import the forked repo in Vercel
- Set environment variable: `DATABASE_URL` = your Supabase connection string
- Deploy

### 4. Configure
- Visit your Umami instance (e.g., analytics.codingcat.dev)
- Create a website entry for codingcat.dev
- Copy the Website ID

### 5. Set environment variables in codingcat.dev
```
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<your-website-id>
NEXT_PUBLIC_UMAMI_URL=https://analytics.codingcat.dev/script.js
```

### 6. Custom domain (optional)
Add `analytics.codingcat.dev` as a custom domain in Vercel for the Umami project.

## Querying Analytics Data
Since Umami writes to your Supabase database, you can query analytics directly:

```sql
-- Top pages last 30 days
SELECT url_path, COUNT(*) as views
FROM website_event
WHERE website_id = '<your-id>'
  AND created_at > NOW() - INTERVAL '30 days'
  AND event_type = 1
GROUP BY url_path
ORDER BY views DESC
LIMIT 20;

-- Sponsor report: views by content type
SELECT 
  CASE 
    WHEN url_path LIKE '/post/%' THEN 'Blog Post'
    WHEN url_path LIKE '/podcast/%' THEN 'Podcast'
    WHEN url_path LIKE '/course/%' THEN 'Course'
    ELSE 'Other'
  END as content_type,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_visitors
FROM website_event
WHERE website_id = '<your-id>'
  AND created_at > NOW() - INTERVAL '30 days'
  AND event_type = 1
GROUP BY content_type
ORDER BY views DESC;
```
