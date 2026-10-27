---
name: codingcat-design-system
description: Canonical 10-module UI Design System, W3C tokens, Tailwind CSS v4 theme, typography, dual-theme Chalkboard & Royal Purple components, canonical terminology (Courses, Podcasts, Blog, Diagrams), and AJ mascot asset guidelines for CodingCat.dev. Activate whenever designing, building, or reviewing web UI, components, layouts, diagrams, or visual assets for CodingCat.dev.
---

# CodingCat.dev Design System Skill

This skill provides the complete 10-module UI and visual design specification for **CodingCat.dev** ("Purrfect Web Tutorials"), hosted by **Alex Patterson (`@alex.patterson`)** and featuring **AJ the Cat**.

## Canonical Content Terminology (Strict)

1. **Three Content Pillars**:
   - **Courses** (`/courses` -> `/course/[slug]`), made of **Lessons** (Action: `Explore Courses →` or `Start Course →`).
   - **Podcasts** (`/podcasts` -> `/podcast/[slug]`), made of **Episodes** (Action: `Watch Podcasts` or `Watch Episode →`).
   - **Blog** (`/blog` -> `/post/[slug]`), made of **Blog Posts** (Action: `Read Blog` or `Read Post →`).
2. **Never Invent Synonyms**: Do not use terms like `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, `"Boss Node"`, or `"Skill Trees"`.
3. **Never Write "Excalidraw" in User-Facing UI Copy**: Even though our diagrams use a hand-drawn sketch look and the `Virgil` font, always label them simply as **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** in user-facing UI text, badges, filenames, and captions.

## Reference Modules (`references/`)

| Module | File | Core Topics |
| :--- | :--- | :--- |
| **01. Overview** | [`references/01-overview.md`](./references/01-overview.md) | Brand ethos, canonical terminology, dual-theme philosophy, AJ Mascot vs. Alex Patterson usage rules |
| **02. Colors** | [`references/02-colors.md`](./references/02-colors.md) | Light Mode (`#FAF9FC` chalk paper, `#2A1155` ink, `#7C3AED` purple) & Dark Mode (`#0B1326` obsidian, `#131B2E` surface, `#7C3AED` / `#C084FC` purple) |
| **03. Typography** | [`references/03-typography.md`](./references/03-typography.md) | `Nunito` (800/900 chunky H1/H2 display), `Inter` (UI & H3-H6), `JetBrains Mono` (code & badges), `Virgil` (hand-drawn diagram annotations) |
| **04. Spacing** | [`references/04-spacing.md`](./references/04-spacing.md) | `4px` base grid, `1280px` max container, bento gaps, 16:9 YouTube and 9:16 Shorts safe zones |
| **05. Corner Radius** | [`references/05-corner-radius.md`](./references/05-corner-radius.md) | `.hand-border`, `.hand-border-rect`, `rounded-xl` to `rounded-3xl`, and `rounded-full` |
| **06. Shadows** | [`references/06-shadows.md`](./references/06-shadows.md) | `.shadow-sketch`, `.shadow-sketch-sm`, `.shadow-sketch-lg`, `.tactile-btn` |
| **07. Focus** | [`references/07-focus.md`](./references/07-focus.md) | Accessible high-contrast `#7C3AED` and `#C084FC` focus rings |
| **08. Components** | [`references/08-components.md`](./references/08-components.md) | Header & mobile 3-line drawer, Hero CTAs, Course/Podcast/Blog cards, Visual Diagrams, Footer |
| **09. Assets** | [`references/09-assets.md`](./references/09-assets.md) | Canonical paths and usage rules for 2D/3D AJ mascot assets |
| **10. Files** | [`references/10-files.md`](./references/10-files.md) | W3C `tokens/tokens.json`, Tailwind v4 `tokens/theme.css`, MDX frontmatter schemas, and templates |

## Strict Rules

1. **Header & Mobile 3-Line Navigation Drawer**: Never place a `"Get Started"` button in the top header (`#site-header`). Keep the header strictly for the logo, desktop links (`lg:flex`), and right-side utility icons (`Search`, `Ask Agent`, `ThemeToggle`, and the mobile 3-line menu `#nav-drawer-toggle`).
2. **No Em-Dashes**: Never use the em-dash character in any UI copy, component labels, documentation, or code comments.
3. **Always Use Tables for Comparisons**: Whenever presenting feature matrices, architectural trade-offs, or token mappings, render a styled Markdown or HTML comparison table.
