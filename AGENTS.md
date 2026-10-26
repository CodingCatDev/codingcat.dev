# CodingCat.dev Agent Instructions & Universal Skill Router (`AGENTS.md`)

Welcome to **CodingCat.dev** ("Purrfect Web Tutorials"), founded and hosted by **Alex Patterson (`@alex.patterson`)** featuring **AJ the Cat**.

This repository contains both the **CodingCat.dev Monorepo** (`apps/site`, `apps/sanity`, `apps/mcp-server`, `apps/ops`) and the **CodingCat.dev Agent Toolkit & 13-Module Design System** (`skills/`, `tokens/`, `assets/`, `DESIGN.md`), modeled after [`sanity-io/agent-toolkit`](https://github.com/sanity-io/agent-toolkit).

---

## 1. Non-Negotiable Global Rules

1. **Canonical Content Pillars & Terminology (Strict)**:
   - Our 3 content pillars match our Sanity document types:
     - **Courses** (`/courses` -> `/course/[slug]`), made of **Lessons** (CTA: `Explore Courses →` or `Start Course →`).
     - **Podcasts** (`/podcasts` -> `/podcast/[slug]`), made of **Episodes** (CTA: `Watch Podcasts` or `Watch Episode →`).
     - **Blog** (`/blog` -> `/post/[slug]`), made of **Blog Posts** (CTA: `Read Blog` or `Read Post →`).
   - **Never invent synonyms** like `"Teardowns"`, `"Blueprints"`, `"Curriculum"`, `"Units"`, `"Boss Node"`, or `"Skill Trees"`.
   - **Never write the brand word `"Excalidraw"` in user-facing UI copy**, badges, headings, filenames, or captions. Always refer to them simply as **Diagrams**, **Visual Diagrams**, or **Architecture Diagrams** in user-facing text (even though they use a hand-drawn sketch aesthetic and the `Virgil` font).
2. **NEVER Use Em-Dashes**: Never output the em-dash character in any prose, UI copy, markdown document, title, video script, social post, or code comment. Use commas, parentheses, colons, or separate sentences instead.
3. **Always Use Markdown Tables for Comparisons**: Whenever comparing tools, frameworks, architectures, pricing, or trade-offs, always render a structured Markdown or HTML comparison table.
4. **Dual-Theme Chalkboard & Royal Purple Visual System**:
   - **Light Mode (`:root`, Stitch `8d1319903d504a79ae56110486455e17`)**: Chalkboard Paper (`#FAF9FC`) with `#D8B4FE` dot grid, `#FFFFFF` cards, `#2A1155` deep purple ink/borders/sketch shadows (`3px 4px 0 #2A1155`), `#7C3AED` brand purple, and pastel diagram fills (`#FEF08A` yellow, `#BAE6FD` sky blue, `#FBCFE8` candy pink, `#EDE9FE` lilac, `#86EFAC` mint).
   - **Dark Mode (`.dark`, Stitch `b9e00f99c0d34e9884bf7766a014577b`)**: Obsidian Chalkboard (`#0B1326`) with purple/fuchsia radial glows, `#131B2E` / `#171F33` surfaces, `#060E20` deep wells, `#F1F5F9` chalk white text, `#7C3AED` tactile buttons with `#4C1D95` bottom lip, and `#C084FC` / `#D946EF` candy purple & fuchsia accents.
5. **Header & Mobile 3-Line Drawer Rule**:
   - Do not put a `"Get Started"` CTA button inside the top header (`#site-header`). Keep the header clean with the AJ circular purple medallion + `CodingCat.dev` logo, desktop nav links (`lg:flex`), and on the right `Search`, `Ask Agent`, `ThemeToggle`, and on mobile/tablet (`lg:hidden`) the 3-line Hamburger Menu (`#nav-drawer-toggle`) opening `#nav-drawer`.
6. **Canonical 4-Font Typography**:
   - `Nunito` (`800` / `900`): Chunky rounded `H1` and `H2` display titles and hero headlines.
   - `Inter` (`400` to `800`): UI components, navigation, `H3`-`H6` subheadings, and long-form prose.
   - `JetBrains Mono` (`400` to `700`): Code blocks, terminal snippets, badge tags, and metadata.
   - `Virgil`: Hand-drawn annotations, sticky notes, and labels inside visual diagrams.
7. **AJ the Cat Mascot Guardrails**: Always reference canonical assets in `assets/` (`AJHeadphones.png`, `AJ-2D-Bipedal.jpg`, `AJ-3D-Headphones-Front.jpg`, `AJ-3D-Headphones-Left.jpg`, `AJ-3D-Headphones-Right.jpg`). Full-body AJ is always upright bipedal on two legs, wearing Royal Purple/Lavender podcast headphones and a hexagonal `"AJ"` collar tag.

---

## 2. The 13-Module Skill & Design System Router

Before writing UI code, drafting content, or generating visual assets, load the relevant skill module from `skills/` (or fetch it dynamically via the MCP server tools `list_codingcat_rules`, `get_codingcat_rules`, and `get_codingcat_tokens`):

| # | Category | Skill / Reference Path | When to Load |
| :--- | :--- | :--- | :--- |
| **01** | **Overview** | `skills/codingcat-design-system/references/01-overview.md` | Brand ethos, canonical terminology (Courses, Podcasts, Blog, Diagrams), AJ vs. Alex Patterson |
| **02** | **Colors** | `skills/codingcat-design-system/references/02-colors.md` | Dual-theme tokens (Light `#FAF9FC`/`#2A1155`/`#7C3AED` & Dark `#0B1326`/`#131B2E`/`#7C3AED`/`#C084FC`) |
| **03** | **Typography** | `skills/codingcat-design-system/references/03-typography.md` | `Nunito` (H1/H2), `Inter` (UI/H3-H6), `JetBrains Mono` (code/badges), `Virgil` (diagrams) |
| **04** | **Spacing** | `skills/codingcat-design-system/references/04-spacing.md` | `4px` base grid, `1280px` max container, YouTube 16:9 and Shorts 9:16 safe zones |
| **05** | **Corner Radius** | `skills/codingcat-design-system/references/05-corner-radius.md` | `.hand-border`, `.hand-border-rect`, `rounded-xl` to `rounded-3xl`, and `rounded-full` |
| **06** | **Shadows** | `skills/codingcat-design-system/references/06-shadows.md` | `.shadow-sketch`, `.shadow-sketch-sm`, `.shadow-sketch-lg`, `.tactile-btn` |
| **07** | **Focus** | `skills/codingcat-design-system/references/07-focus.md` | Keyboard accessibility focus rings (`#7C3AED` and `#C084FC`) |
| **08** | **Components** | `skills/codingcat-design-system/references/08-components.md` | Header & mobile 3-line drawer, Hero CTAs, Course/Podcast/Blog cards, Visual Diagrams, Footer |
| **09** | **Assets** | `skills/codingcat-design-system/references/09-assets.md` | Canonical 2D and 3D AJ mascot assets in `assets/` and anatomical rules |
| **10** | **Files** | `skills/codingcat-design-system/references/10-files.md` | `tokens/tokens.json`, `tokens/theme.css`, MDX frontmatter schemas, social templates |
| **11** | **Voice & Copy** | `skills/alex-voice-and-copy/SKILL.md` | `@alex.patterson` writing style, canonical terminology, zero em-dashes, comparison tables |
| **12** | **Visual Prompts** | `skills/codingcat-media-studio/SKILL.md` | Hand-drawn architecture diagrams, 2D bipedal & 3D vinyl-toy AJ prompts, 16:9 YouTube thumbnails |
| **13** | **Video & Motion** | `skills/codingcat-media-studio/references/youtube-intros-and-video.md` | First-15-second retention hooks, presenter cutaways, lower-thirds, 9:16 Shorts safe zones |

---

## 3. Monorepo Packages & Technical Conventions

| Path | Package | Description |
| :--- | :--- | :--- |
| `apps/site` | `@codingcatdev/site` | Astro 7 SSR on Cloudflare Workers (public site) |
| `apps/sanity` | `@codingcatdev/sanity` | Sanity Studio v6 |
| `apps/mcp-server` | `@codingcatdev/mcp-server` | Cloudflare Worker (Hono + `@modelcontextprotocol/sdk`) serving dynamic CodingCat.dev rules & tokens |
| `tokens/` | Design Tokens | W3C `tokens.json` and Tailwind v4 `theme.css` |
| `skills/` | Agent Skills | `codingcat-design-system`, `alex-voice-and-copy`, `codingcat-media-studio` |
