# CodingCat.dev Canonical Design System (2026 Dual-Theme Chalkboard & Royal Purple)

This document defines the canonical design system for CodingCat.dev based on the Google Stitch reference screens:
- **Light Mode (Chalkboard Paper)**: `https://stitch.withgoogle.com/projects/3020591313534241286?node-id=8d1319903d504a79ae56110486455e17`
- **Dark Mode (Obsidian Chalkboard)**: `https://stitch.withgoogle.com/projects/3020591313534241286?node-id=b9e00f99c0d34e9884bf7766a014577b`

## 1. Canonical Content Pillars & Terminology

1. **Three Content Pillars (Matching Sanity Document Types)**:
   - **Courses** (`/courses` -> `/course/[slug]`): Structured learning made up of **Lessons** (`Explore Courses →`, `Start Course →`).
   - **Podcasts** (`/podcasts` -> `/podcast/[slug]`): Video and audio conversations made up of **Episodes** (`Watch Podcasts`, `Watch Episode →`).
   - **Blog** (`/blog` -> `/post/[slug]`): Written articles and code guides made up of **Blog Posts** (`Read Blog`, `Read Post →`).
2. **No Invented Synonyms**: Never call content `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, `"Boss Node"`, or `"Skill Trees"`.
3. **Diagrams Terminology**: Never write the brand word `"Excalidraw"` in user-facing UI labels, headings, filenames, or captions. Always refer to them simply as **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** in user-facing copy.

## 2. Visual Direction & Dual-Theme Philosophy

CodingCat.dev blends Duolingo-inspired playful educational UI with hand-drawn architectural diagrams, sticky notes, and real code. Both Light Mode and Dark Mode are first-class citizens:
- **Light Mode (`:root`)** uses a warm Chalkboard Paper background (`#FAF9FC`) with a subtle lavender dot grid (`#D8B4FE`), crisp white cards (`#FFFFFF`), deep Royal Purple ink (`#2A1155`), and hard-offset sketch shadows (`3px 4px 0 #2A1155`).
- **Dark Mode (`.dark`)** uses an Obsidian Chalkboard background (`#0B1326`) with ambient purple/fuchsia radial glows, slate-obsidian cards (`#131B2E` / `#171F33`), deep code/diagram wells (`#060E20`), chalk-white sketch borders (`rgba(255, 255, 255, 0.22)`), and dark offset sketch shadows (`3px 4px 0 rgba(0, 0, 0, 0.75)`).

## 3. Dual-Theme Color Tokens

| Token Role | Light Mode (`8d1319903d504a79ae56110486455e17`) | Dark Mode (`b9e00f99c0d34e9884bf7766a014577b`) | CSS Custom Property |
| :--- | :--- | :--- | :--- |
| **Page Canvas** | `#FAF9FC` (`brand.chalk`) + `#D8B4FE` dot grid | `#0B1326` (`obsidian.DEFAULT`) + radial glows & dot grid | `--cc-bg-primary` |
| **Secondary Canvas** | `#F5F3FB` (`brand.canvas`) | `#131B2E` (`obsidian.surface`) | `--cc-bg-canvas` |
| **Card / Whiteboard** | `#FFFFFF` (`brand.paper`) | `#171F33` (`obsidian.card`) | `--cc-card` |
| **Deep Code / Video Well** | `#2A1155` (`brand.dark`) | `#060E20` (`obsidian.deep`) | `--cc-bg-void` |
| **Primary Ink / Text** | `#2A1155` (`brand.dark`) | `#F1F5F9` (`chalk.white`) | `--cc-text-primary` |
| **Secondary Body Text** | `#4C1D95` (`purple-900`) | `#CBD5E1` (`slate-300`) | `--cc-text-secondary` |
| **Muted / Accent Text** | `#6B21A8` (`purple-800`) | `#D8B4FE` (`purple-300`) | `--cc-text-muted` |
| **Primary Brand Purple** | `#7C3AED` (hover `#8B5CF6`) | `#7C3AED` (hover `#8B5CF6`, lip `#4C1D95`) | `--cc-purple-primary` |
| **Candy / Fuchsia Accent** | `#A855F7` / `#D946EF` | `#C084FC` (`chalk.candy`) / `#D946EF` | `--cc-candy` |
| **Sketch Border** | `2px solid #2A1155` | `2px solid rgba(255, 255, 255, 0.22)` | `--cc-border-sketch` |
| **Sunny Yellow (Sticky/Node)** | `#FEF08A` (text `#713F12`, border `#2A1155`) | Sticky `#FEF08A` / Node `rgba(66, 32, 6, 0.8)` (`#FACC15` border) | `--cc-yellow-bg` |
| **Sky Blue (Node/Header)** | `#BAE6FD` (text `#0369A1`, border `#2A1155`) | `rgba(8, 47, 73, 0.8)` (`#38BDF8` border, `#BAE6FD` text) | `--cc-sky-bg` |
| **Candy Pink (Node/Header)** | `#FBCFE8` (text `#9D174D`, border `#2A1155`) | `rgba(80, 7, 36, 0.55)` (`#F472B6` border, `#F9A8D4` text) | `--cc-pink-bg` |
| **Lilac (Node/Header)** | `#EDE9FE` (text `#5B21B6`, border `#2A1155`) | `rgba(59, 7, 100, 0.65)` (`#C084FC` border, `#E9D5FF` text) | `--cc-lilac-bg` |
| **Mint / Emerald Green** | `#86EFAC` / `#58CC02` (pill `#DCFCE7`, text `#166534`) | `#86EFAC` / `#34D399` (pill `rgba(2, 44, 34, 0.8)`, text `#6EE7B7`) | `--cc-mint` |

## 4. Header & Mobile 3-Line Navigation Drawer

- The top header (`#site-header`) is a floating `rounded-full` pill bar containing the AJ circular purple medallion + `CodingCat.dev` logo on the left, desktop navigation links (`Courses`, `Podcasts`, `Blog`, `Sponsors`, `Sponsorships` on `lg:flex`), and on the right `Search`, `Ask Agent`, `ThemeToggle`, and on `<lg` the 3-line Hamburger Menu (`#nav-drawer-toggle`).
- Never place a `"Get Started"` CTA button inside `#site-header` so the mobile header never overflows.
