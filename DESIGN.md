---
name: CodingCat.dev 13-Module Design System & Agent Toolkit Specification
version: 1.0.0
colors:
  bg-primary: '#0F172A'
  bg-void: '#000000'
  surface: '#1E293B'
  surface-elevated: '#334155'
  purple-primary: '#4B2E83'
  purple-vivid: '#7C3AED'
  purple-lip: '#351F5E'
  lavender: '#B4A7D6'
  lime: '#C5E86C'
  lime-lip: '#9BC53D'
  mint: '#86EFAC'
  coral: '#FCA5A5'
  text-primary: '#F8FAFC'
  text-muted: '#94A3B8'
typography:
  display:
    fontFamily: 'Nunito, Inter, system-ui, sans-serif'
    fontWeight: '800 / 900'
    usage: 'Chunky H1 display titles and hero headlines'
  sans:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontWeight: '400 / 500 / 600 / 700 / 800'
    usage: 'UI components, H2-H6 headings, and long-form prose'
  mono:
    fontFamily: 'JetBrains Mono, monospace'
    fontWeight: '400 / 500 / 700'
    usage: 'Code blocks, terminal snippets, badge tags, and metadata'
  hand:
    fontFamily: 'Virgil, Excalifont, Caveat, cursive, sans-serif'
    fontWeight: '400 / 700'
    usage: 'Dark-mode Excalidraw diagram explanations and sketchy annotations'
radius:
  none: '0px'
  md: '6px'
  lg: '8px'
  xl: '12px'
  2xl: '16px'
  full: '9999px'
---

# CodingCat.dev 13-Module Design System & Agent Toolkit Specification

This document is the canonical root specification for **CodingCat.dev** ("Purrfect Web Tutorials"), unifying Web UI, W3C Design Tokens, AJ the Cat Mascot & Dark-Mode Excalidraw Visual Rules, Video Production Workflows, and **Alex Patterson (`@alex.patterson`)** Voice & Copy across Google Antigravity (`agy`) and Gemini Web.

---

## The 13-Module Taxonomy

| # | Category | Module Path | Purpose Across CodingCat.dev | Core Contents |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Overview** | `skills/codingcat-design-system/references/01-overview.md` | Brand ethos & core identity | Mission, dark-mode-first philosophy, when to use AJ vs. Alex Patterson. |
| **02** | **Colors** | `skills/codingcat-design-system/references/02-colors.md` | Web UI, image prompts, video LUTs | Hex/RGB/Tailwind tokens (`#0F172A`, `#000000`, `#1E293B`, `#334155`, `#4B2E83`, `#B4A7D6`, `#C5E86C`, `#86EFAC`, `#FCA5A5`), semantic states. |
| **03** | **Typography** | `skills/codingcat-design-system/references/03-typography.md` | Web CSS, thumbnail text, captions | `Nunito` (`800`/`900` chunky `H1` display), `Inter` (UI & `H2`-`H6`), `JetBrains Mono` (code/badges), `Virgil` / `Excalifont` (Excalidraw explanations). |
| **04** | **Spacing** | `skills/codingcat-design-system/references/04-spacing.md` | Web layout, thumbnail safe-zones | `4px`/`8px` grid rules, `1280px` container padding, YouTube 16:9 (`96px` edge, `320x120px` bottom-right) and Shorts 9:16 safe margins. |
| **05** | **Corner Radius** | `skills/codingcat-design-system/references/05-corner-radius.md` | UI cards, lower-thirds, code frames | Tailwind `rounded-*` mappings from `0px` (`rounded-none`) to `16px` (`rounded-2xl`) and `9999px` (`rounded-full`). |
| **06** | **Shadows** | `skills/codingcat-design-system/references/06-shadows.md` | Elevation, neon glow effects | Dark-mode top-border highlights, `--cc-shadow-card`, `--cc-glow-purple`, `--cc-glow-lime`, and `--cc-thumbnail-drop`. |
| **07** | **Focus** | `skills/codingcat-design-system/references/07-focus.md` | Accessibility & interactive states | High-contrast Electric Lime (`#C5E86C`) and Soft Lavender (`#B4A7D6`) focus rings on `#0F172A` surfaces. |
| **08** | **Components** | `skills/codingcat-design-system/references/08-components.md` | Astro/React/shadcn UI & Canvas | Pre-approved Tailwind patterns: Primary Lime CTA, Secondary Purple Button, Bento Tutorial Card, AJ Callout Box, Comparison Table. |
| **09** | **Assets** | `skills/codingcat-design-system/references/09-assets.md` | Mascot (AJ) & Personal Likeness | Canonical 2D/3D AJ reference sheets (`assets/AJHeadphones.png`, `assets/AJ-2D-Bipedal.jpg`, `assets/AJ-3D-Headphones-*.jpg`). |
| **10** | **Files** | `skills/codingcat-design-system/references/10-files.md` | Raw templates & JSON schemas | `tokens/tokens.json`, Tailwind v4 `tokens/theme.css`, MDX frontmatter schemas, social templates. |
| **11** | **Voice & Copy** | `skills/alex-voice-and-copy/` | Blog posts, X threads, docs | Pragmatic Senior SE tone, **never use em-dashes**, **always use tables for comparisons**, "WTF is..." framing. |
| **12** | **Visual Prompts** | `skills/codingcat-media-studio/` | Thumbnails, Excalidraw, diagrams | Dark-mode Excalidraw rules (`#000000`/`#0F172A`), 2D upright bipedal & 3D vinyl-toy AJ prompts, Coral `#FCA5A5` `X` vs. Mint `#86EFAC` / Lime `#C5E86C` checkmarks. |
| **13** | **Video & Motion** | `skills/codingcat-media-studio/references/youtube-intros-and-video.md` | YouTube intros, shorts, motion | First-15-second retention hooks, presenter cutaway separation, lower-third plates. |

---

## Summary of Core Specifications

### 1. Color Palette (`02-colors.md` & `tokens/tokens.json`)

| Token Name | Hex | Tailwind / CSS Variable | Primary Role |
| :--- | :--- | :--- | :--- |
| **Canvas Obsidian** | `#0F172A` | `bg-slate-900` / `--cc-bg-primary` | Primary page background |
| **Pure Void** | `#000000` | `bg-black` / `--cc-bg-void` | Excalidraw diagram wells & deepest dark contrast |
| **Surface Slate** | `#1E293B` | `bg-slate-800` / `--cc-surface` | Bento cards, code containers, callout boxes, table rows |
| **Elevated Surface** | `#334155` | `bg-slate-700` / `--cc-surface-elevated` | Hover states, modals, dropdowns |
| **CodingCat Royal Purple** | `#4B2E83` | `--cc-purple-primary` | Primary brand color, secondary buttons, AJ's headphones |
| **Soft Lavender** | `#B4A7D6` | `--cc-lavender` | Secondary accents, borders (`#B4A7D6/20`), overlines, AJ's collar & earcups |
| **Electric Lime Green** | `#C5E86C` | `--cc-lime` | Primary CTAs, focus rings, thumbnail highlight word, AJ's eyes, checkmarks |
| **Mint Success** | `#86EFAC` | `text-green-300` / `--cc-mint` | Excalidraw recommended pattern checkmarks (`✓`) |
| **Coral Anti-Pattern** | `#FCA5A5` | `text-red-300` / `--cc-coral` | Excalidraw anti-pattern `X` marks (`✗`) & errors |
| **Text Primary** | `#F8FAFC` | `text-slate-50` / `--cc-text-primary` | Primary headings & body copy (15.4:1 AAA on `#0F172A`) |
| **Text Muted** | `#94A3B8` | `text-slate-400` / `--cc-text-muted` | Secondary metadata & captions (7.1:1 AA+ on `#0F172A`) |

### 2. Typography (`03-typography.md`)

| Role | Font Family | Weights | Usage |
| :--- | :--- | :--- | :--- |
| **Chunky Display (`H1`)** | `Nunito` | `800`, `900` | Hero headlines, page `H1` titles, thumbnail display text (max 3-5 words) |
| **UI & Headings (`H2`-`H6`)** | `Inter` | `400` to `800` | Section subheadings, UI controls, body prose, comparison tables |
| **Code & Technical Badges** | `JetBrains Mono` | `400`, `500`, `700` | Code blocks, terminal output, category pills, timestamps |
| **Excalidraw Explanations** | `Virgil` / `Excalifont` | `400`, `700` | Hand-drawn diagram annotations in `#FFFFFF`, `#B4A7D6`, or `#C5E86C` |

### 3. Canonical AJ the Cat Mascot Assets (`09-assets.md`)
- `assets/AJHeadphones.png`: 2D vector head-and-collar emblem of AJ wearing `"CodingCat.dev Podcast"` over-ear headphones and the pastel rainbow hexagonal `"AJ"` collar tag.
- `assets/AJ-2D-Bipedal.jpg`: 2D flat vector full-body upright bipedal AJ standing on two legs with dark gray oval belly patch, Electric Lime (`#C5E86C`) eyes, Soft Lavender (`#B4A7D6`) collar with hexagonal `"AJ"` tag, and over-ear Royal Purple/Lavender headphones.
- `assets/AJ-3D-Headphones-Front.jpg`, `assets/AJ-3D-Headphones-Left.jpg`, `assets/AJ-3D-Headphones-Right.jpg`: 3D stylized vinyl-toy turnaround renders of upright bipedal AJ on a circular pedestal base.

### 4. Editorial & Media Studio Laws (`11` to `13`)
- **Zero Em-Dashes**: Never use the em-dash character anywhere in prose, UI copy, titles, or scripts.
- **Comparison Tables**: Always use Markdown or HTML tables when comparing tools, architectures, or trade-offs.
- **Excalidraw Separation**: Keep `@alex.patterson` presenter cutaways separate from dark-mode Excalidraw diagram canvases.
