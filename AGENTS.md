# CodingCat.dev Agent Instructions & Universal Skill Router (`AGENTS.md`)

Welcome to **CodingCat.dev** ("Purrfect Web Tutorials"), founded and hosted by **Alex Patterson (`@alex.patterson`)** featuring **AJ the Cat**.

This repository contains both the **CodingCat.dev Monorepo** (`apps/site`, `apps/sanity`, `apps/mcp-server`, `apps/ops`) and the **CodingCat.dev Agent Toolkit & 13-Module Design System** (`skills/`, `tokens/`, `assets/`, `DESIGN.md`), modeled after [`sanity-io/agent-toolkit`](https://github.com/sanity-io/agent-toolkit).

---

## 1. Non-Negotiable Global Rules

1. **NEVER Use Em-Dashes**: Never output the em-dash character in any prose, UI copy, markdown document, title, video script, social post, or code comment. Use commas, parentheses, colons, or separate sentences instead.
2. **Always Use Markdown Tables for Comparisons**: Whenever comparing tools, frameworks, architectures, pricing, or trade-offs, always render a structured Markdown or HTML comparison table.
3. **Dark-Mode-First Visual System**: CodingCat.dev is strictly dark-mode-first. Use Canvas Obsidian (`#0F172A`) for page backgrounds, Pure Void (`#000000`) for Excalidraw diagram wells, Surface Slate (`#1E293B`) for cards, CodingCat Royal Purple (`#4B2E83`), Soft Lavender (`#B4A7D6`), and Electric Lime Green (`#C5E86C`) for primary CTAs and focus rings.
4. **Canonical 4-Font Typography**:
   - `Nunito` (`800` / `900`): Chunky rounded `H1` display titles and hero headlines.
   - `Inter` (`400` to `800`): UI components, navigation, `H2`-`H6` subheadings, and long-form prose.
   - `JetBrains Mono` (`400` to `700`): Code blocks, terminal snippets, badge tags, and metadata.
   - `Virgil` / `Excalifont`: Hand-drawn annotations and labels inside dark-mode Excalidraw diagrams.
5. **AJ the Cat Mascot Guardrails**: Always reference canonical assets in `assets/` (`AJHeadphones.png`, `AJ-2D-Bipedal.jpg`, `AJ-3D-Headphones-Front.jpg`, `AJ-3D-Headphones-Left.jpg`, `AJ-3D-Headphones-Right.jpg`). Full-body AJ is always upright bipedal on two legs, with Electric Lime (`#C5E86C`) eyes, a Soft Lavender (`#B4A7D6`) collar with a pastel rainbow hexagonal `"AJ"` tag, and over-ear `"CodingCat.dev Podcast"` Royal Purple/Lavender headphones that properly cover his ears.

---

## 2. The 13-Module Skill & Design System Router

Before writing UI code, drafting content, or generating visual assets, load the relevant skill module from `skills/` (or fetch it dynamically via the MCP server tools `list_codingcat_rules`, `get_codingcat_rules`, and `get_codingcat_tokens`):

| # | Category | Skill / Reference Path | When to Load |
| :--- | :--- | :--- | :--- |
| **01** | **Overview** | `skills/codingcat-design-system/references/01-overview.md` | Brand ethos, dark-mode-first philosophy, when to use AJ vs. Alex Patterson |
| **02** | **Colors** | `skills/codingcat-design-system/references/02-colors.md` | Hex/RGB/Tailwind tokens (`#0F172A`, `#1E293B`, `#4B2E83`, `#B4A7D6`, `#C5E86C`, `#86EFAC`, `#FCA5A5`) |
| **03** | **Typography** | `skills/codingcat-design-system/references/03-typography.md` | `Nunito` (H1), `Inter` (UI/H2-H6), `JetBrains Mono` (code/badges), `Virgil`/`Excalifont` (diagrams) |
| **04** | **Spacing** | `skills/codingcat-design-system/references/04-spacing.md` | `4px` base grid, `1280px` max container, YouTube 16:9 and Shorts 9:16 safe zones |
| **05** | **Corner Radius** | `skills/codingcat-design-system/references/05-corner-radius.md` | Radius tokens from `rounded-none` (`0px`) to `rounded-2xl` (`16px`) and `rounded-full` |
| **06** | **Shadows** | `skills/codingcat-design-system/references/06-shadows.md` | Dark-mode top-border highlights, `--cc-glow-purple`, `--cc-glow-lime`, `--cc-thumbnail-drop` |
| **07** | **Focus** | `skills/codingcat-design-system/references/07-focus.md` | Keyboard accessibility focus rings (`#C5E86C` and `#B4A7D6`) on `#0F172A` surfaces |
| **08** | **Components** | `skills/codingcat-design-system/references/08-components.md` | Astro/React + Tailwind reference patterns: CTAs, Bento Cards, AJ Callout Boxes, Comparison Tables |
| **09** | **Assets** | `skills/codingcat-design-system/references/09-assets.md` | Canonical 2D and 3D AJ mascot assets in `assets/` and anatomical rules |
| **10** | **Files** | `skills/codingcat-design-system/references/10-files.md` | `tokens/tokens.json`, `tokens/theme.css`, MDX frontmatter schemas, social templates |
| **11** | **Voice & Copy** | `skills/alex-voice-and-copy/SKILL.md` | `@alex.patterson` writing style, zero em-dashes, mandatory comparison tables, "WTF is..." series |
| **12** | **Visual Prompts** | `skills/codingcat-media-studio/SKILL.md` | Dark-mode Excalidraw diagrams, 2D bipedal & 3D vinyl-toy AJ prompts, 16:9 YouTube thumbnails |
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

### Key Astro 7 + Sanity v6 + Cloudflare Workers Rules
- **`output: "server"`**: There is no `getStaticPaths` anywhere; pagination is a runtime bounds check on `Astro.params`.
- **GROQ queries must live in `.ts` files**: Sanity TypeGen skips `.astro` frontmatter.
- **Never read secrets from `import.meta.env`**: Read secrets from `import { env } from "cloudflare:workers"`.
- **Cloudflare bindings do not inherit into `env.production`**: Repeat top-level bindings in `env.production` inside `wrangler.jsonc`.
- **Always `stegaClean` values bound to HTML attributes**, `<meta>`, JSON-LD, or XML feeds.
