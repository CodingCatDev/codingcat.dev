# Google Antigravity (`agy`) & Gemini Workspace Instructions (`GEMINI.md`)

This workspace is configured with the **CodingCat.dev Agent Toolkit & 13-Module Design System** for **CodingCat.dev** and **Alex Patterson (`@alex.patterson`)**.

## 1. Automatic Skill Discovery

Google Antigravity and Gemini CLI automatically load workspace skills from `.agent/skills/` and global skills from `~/.gemini/skills/` (synced via `./scripts/sync-local-antigravity.sh`):

| Skill Name | Path | When to Activate |
| :--- | :--- | :--- |
| **`codingcat-design-system`** | `skills/codingcat-design-system/SKILL.md` | Designing or building Astro/React UI, Tailwind CSS v4 styles, dark-mode layouts, cards, buttons, tables, or referencing AJ mascot assets (`01-overview.md` through `10-files.md`). |
| **`alex-voice-and-copy`** | `skills/alex-voice-and-copy/SKILL.md` | Writing or editing tutorials, blog posts, documentation, "WTF is..." scripts, X threads, LinkedIn posts, or podcast show notes. |
| **`codingcat-media-studio`** | `skills/codingcat-media-studio/SKILL.md` | Generating 2D/3D AJ the Cat illustrations, dark-mode Excalidraw architecture diagrams, 16:9 YouTube thumbnails, or video intro hooks. |

## 2. Core Guardrails for Every Turn

1. **Zero Em-Dashes**: Never use the em-dash character anywhere in prose, UI copy, titles, scripts, or comments. Use commas, colons, parentheses, or separate sentences.
2. **Comparison Tables Required**: Always use Markdown or HTML tables when comparing tools, architectures, trade-offs, or pricing.
3. **Canonical Dark-Mode Tokens (`tokens/tokens.json` & `tokens/theme.css`)**:
   - Primary Background (Canvas Obsidian): `#0F172A` (`--cc-bg-primary`)
   - Excalidraw / Deepest Dark (Pure Void): `#000000` (`--cc-bg-void`)
   - Card & Code Surface (Surface Slate): `#1E293B` (`--cc-surface`)
   - Elevated Surface: `#334155` (`--cc-surface-elevated`)
   - CodingCat Royal Purple: `#4B2E83` (`--cc-purple-primary`)
   - Soft Lavender: `#B4A7D6` (`--cc-lavender`)
   - Electric Lime Green (Primary CTA / Focus / Highlights): `#C5E86C` (`--cc-lime`)
   - Mint Success (`✓` Good Pattern): `#86EFAC` (`--cc-mint`)
   - Coral Anti-Pattern (`✗` Bad Pattern): `#FCA5A5` (`--cc-coral`)
4. **Canonical 4-Font System**:
   - `Nunito` (`800` / `900`) for chunky `H1` display titles
   - `Inter` for UI components, `H2`-`H6` headings, and prose
   - `JetBrains Mono` for code blocks, terminal snippets, and badge pills
   - `Virgil` / `Excalifont` for hand-drawn dark-mode Excalidraw diagram explanations
5. **Canonical AJ the Cat References (`assets/`)**:
   - Use ONLY `assets/AJHeadphones.png`, `assets/AJ-2D-Bipedal.jpg`, `assets/AJ-3D-Headphones-Front.jpg`, `assets/AJ-3D-Headphones-Left.jpg`, and `assets/AJ-3D-Headphones-Right.jpg`.
   - Full-body AJ is always upright bipedal on two legs, wearing over-ear `"CodingCat.dev Podcast"` Royal Purple/Lavender headphones covering his ears and a Soft Lavender collar with the hexagonal `"AJ"` tag.

See [`AGENTS.md`](./AGENTS.md) and [`DESIGN.md`](./DESIGN.md) for the complete 13-module specification.
