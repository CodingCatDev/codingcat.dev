---
name: codingcat-design-system
description: Canonical 10-module UI Design System, W3C tokens, Tailwind CSS v4 theme, typography, tactile dark-mode components, and AJ mascot asset guidelines for CodingCat.dev. Activate whenever designing, building, or reviewing web UI, components, layouts, diagrams, or visual assets for CodingCat.dev.
---

# CodingCat.dev Design System Skill

This skill provides the complete 10-module UI and visual design specification for **CodingCat.dev** ("Purrfect Web Tutorials"), hosted by **Alex Patterson (`@alex.patterson`)** and featuring **AJ the Cat**.

## When to Activate

Activate this skill whenever you are:
- Creating or modifying Astro, React, or `shadcn/ui` components for CodingCat.dev
- Applying colors, typography (`Nunito`, `Inter`, `JetBrains Mono`, `Virgil` / `Excalifont`), spacing, corner radii, or shadows
- Referencing AJ the Cat mascot assets (`assets/AJHeadphones.png`, `assets/AJ-2D-Bipedal.jpg`, `assets/AJ-3D-Headphones-*.jpg`)
- Auditing dark-mode contrast, keyboard focus states (`#C5E86C` and `#B4A7D6`), or responsive layouts

## Reference Modules (`references/`)

Read the specific reference module needed for your task:

| Module | File | Core Topics |
| :--- | :--- | :--- |
| **01. Overview** | [`references/01-overview.md`](./references/01-overview.md) | Brand ethos, dark-mode-first philosophy, AJ Mascot vs. Alex Patterson usage rules |
| **02. Colors** | [`references/02-colors.md`](./references/02-colors.md) | Obsidian `#0F172A`, Surface Slate `#1E293B`, Royal Purple `#4B2E83`, Lavender `#B4A7D6`, Electric Lime `#C5E86C`, Mint `#86EFAC`, Coral `#FCA5A5` |
| **03. Typography** | [`references/03-typography.md`](./references/03-typography.md) | `Nunito` (800/900 chunky H1 display), `Inter` (UI & H2-H6), `JetBrains Mono` (code & badges), `Virgil` / `Excalifont` (Excalidraw annotations) |
| **04. Spacing** | [`references/04-spacing.md`](./references/04-spacing.md) | `4px` base grid, `1280px` max container, bento gaps, 16:9 YouTube and 9:16 Shorts safe zones |
| **05. Corner Radius** | [`references/05-corner-radius.md`](./references/05-corner-radius.md) | Radius scale from `rounded-none` (`0px`) to `rounded-2xl` (`16px`) and `rounded-full` |
| **06. Shadows** | [`references/06-shadows.md`](./references/06-shadows.md) | Dark-mode top-border highlights, `--cc-glow-purple`, `--cc-glow-lime`, and `--cc-thumbnail-drop` |
| **07. Focus** | [`references/07-focus.md`](./references/07-focus.md) | Accessible high-contrast `#C5E86C` and `#B4A7D6` focus rings on `#0F172A` surfaces |
| **08. Components** | [`references/08-components.md`](./references/08-components.md) | Copy-pasteable Astro/React + Tailwind patterns: CTAs, Bento Tutorial Cards, AJ Callouts, Comparison Tables |
| **09. Assets** | [`references/09-assets.md`](./references/09-assets.md) | Canonical paths and usage rules for 2D/3D AJ mascot assets and Excalidraw reference diagrams |
| **10. Files** | [`references/10-files.md`](./references/10-files.md) | W3C `tokens/tokens.json`, Tailwind v4 `tokens/theme.css`, MDX frontmatter schemas, and templates |

## Strict Rules

1. **Dark-Mode-First**: Never default to light-mode white backgrounds. Primary canvas is Canvas Obsidian (`#0F172A`) and diagram wells use Pure Void (`#000000`).
2. **No Em-Dashes**: Never use the em-dash character in any UI copy, component labels, documentation, or code comments. Use commas, colons, parentheses, or separate sentences.
3. **Always Use Tables for Comparisons**: Whenever presenting feature matrices, architectural trade-offs, or token mappings, render a styled dark-mode Markdown or HTML comparison table.
