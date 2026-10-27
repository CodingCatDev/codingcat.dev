# 10. Files & Templates: Tokens, Theme CSS & Schemas

This module documents the machine-readable token files and content templates in the repository.

## 1. W3C Design Tokens (`tokens/tokens.json`)
Located at `tokens/tokens.json`, structured according to the W3C Design Tokens Community Group format (`$value`, `$type`, `$description`).

| Top-Level Group | Key Paths | Description |
| :--- | :--- | :--- |
| `color.bg` | `primary` (`#0F172A`), `void` (`#000000`) | Primary Obsidian page background and Pure Void diagram wells |
| `color.surface` | `default` (`#1E293B`), `elevated` (`#334155`) | Card and interactive modal surfaces |
| `color.brand` | `purple.primary` (`#4B2E83`), `lavender` (`#B4A7D6`), `lime.primary` (`#C5E86C`) | Core CodingCat.dev brand identity tokens and 3D button lips |
| `color.semantic` | `mint` (`#86EFAC`), `coral` (`#FCA5A5`) | Excalidraw good-pattern vs. anti-pattern evaluation tokens |
| `color.text` | `primary` (`#F8FAFC`), `muted` (`#94A3B8`) | High-contrast dark-mode typography tokens |
| `typography.fontFamily` | `display` (`Nunito`), `sans` (`Inter`), `mono` (`JetBrains Mono`), `hand` (`Virgil`, `Excalifont`) | Canonical 4-font system |
| `spacing` | `base` (`4px`), `containerMax` (`1280px`), `safeZones` | Web grid and 16:9 / 9:16 video safe zones |
| `radius` | `none`, `md`, `lg`, `xl`, `2xl`, `full` | Corner radius scale |
| `shadow` | `card`, `glowPurple`, `glowLime`, `thumbnailDrop` | Dark-mode elevation and glow tokens |

## 2. Tailwind CSS v4 Theme Variables (`tokens/theme.css`)
Located at `tokens/theme.css`, exporting `:root` CSS variables (`--cc-bg-primary`, `--cc-surface`, `--cc-purple-primary`, `--cc-lavender`, `--cc-lime`, `--cc-mint`, `--cc-coral`, `--cc-shadow-card`, `--cc-glow-purple`, `--cc-glow-lime`, `--cc-thumbnail-drop`).

```css
@import "tailwindcss";
@import "./tokens/theme.css";

@theme {
  --font-display: "Nunito", "Inter", system-ui, sans-serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-hand: "Virgil", "Excalifont", "Caveat", cursive, sans-serif;

  --color-cc-bg: var(--cc-bg-primary);
  --color-cc-void: var(--cc-bg-void);
  --color-cc-surface: var(--cc-surface);
  --color-cc-surface-elevated: var(--cc-surface-elevated);
  --color-cc-purple: var(--cc-purple-primary);
  --color-cc-lavender: var(--cc-lavender);
  --color-cc-lime: var(--cc-lime);
  --color-cc-mint: var(--cc-mint);
  --color-cc-coral: var(--cc-coral);
}
```

## 3. Tutorial / Blog Post Frontmatter Schema (Astro & Sanity Compatible)
Notice: Never use em-dashes in `title` or `excerpt`.

```yaml
---
title: "WTF is Cloudflare D1: Serverless SQLite at the Edge"
slug: "wtf-is-cloudflare-d1"
excerpt: "Learn how Cloudflare D1 runs distributed SQLite in your Hono and Astro Workers, including read replication, Drizzle ORM setup, and pricing comparisons."
publishedAt: "2026-10-26T12:00:00Z"
updatedAt: "2026-10-26T12:00:00Z"
author:
  name: "Alex Patterson"
  handle: "@alex.patterson"
  role: "Founder, CodingCat.dev"
tags:
  - "cloudflare"
  - "sqlite"
  - "astro"
  - "hono"
coverImage:
  src: "/assets/covers/wtf-is-cloudflare-d1.jpg"
  alt: "AJ the Cat reacting to a dark-mode Excalidraw diagram of Cloudflare D1 edge read replicas"
youtubeId: "dQw4w9WgXcQ"
draft: false
---
```

## 4. Social Post & Thread Markdown Template
```markdown
## Hook Tweet (Post 1)
Most developers overcomplicate edge databases.

Here is how Cloudflare D1 + Hono gives you zero-cold-start SQLite at the edge in 45 lines of TypeScript:

[Attach 16:9 Dark-Mode Excalidraw Architecture Diagram]

## Comparison Tweet (Post 2)
How D1 compares to Turso and PlanetScale for edge reads:

| Feature | Cloudflare D1 | Turso (libSQL) | Regional Postgres |
| :--- | :--- | :--- | :--- |
| Binding Latency | 0ms (In-Worker) | 5ms to 15ms HTTP | 25ms to 80ms TCP |
| Read Replicas | Automatic Global | Global Replicas | Manual Read Pools |
| Free Tier | 5M reads / day | 500M rows read / mo | Varies by provider |

## CTA Tweet (Post 3)
Full video breakdown + copy-pasteable Astro 7 & Hono starter repo on CodingCat.dev:
https://codingcat.dev/post/wtf-is-cloudflare-d1
```
