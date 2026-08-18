# codingcat.dev

pnpm monorepo. Node >= 22.12 (see `.nvmrc`); pnpm 10.34.1.

## Packages

| Path | Package | What it is |
|---|---|---|
| `apps/site` | `@codingcatdev/site` | **Astro 7 SSR on Cloudflare Workers** — the public site. Active development. |
| `apps/web` | `@codingcatdev/web` | Next.js 16 app. Being retired: its public half is replaced by `apps/site`; the dashboard + sponsor portal move to `admin.codingcat.dev`. |
| `apps/sanity` | `@codingcatdev/sanity` | Sanity Studio v6, deployed to Sanity hosting. |

Root scripts target `apps/site`. Use `pnpm dev:dashboard` / `build:dashboard` for the Next app, `pnpm dev:studio` for the Studio.

## In-flight migration

Moving from Next.js on Vercel to Astro 7 SSR on Cloudflare Workers, with Sanity
upgraded to v6 and the video/AI pipeline (Remotion, Gemini, ElevenLabs,
NotebookLM, GCS, YouTube upload) dropped. Auth moves from Supabase to
better-auth on Cloudflare D1.

Branch note: `dev` still holds the **pre-Next Astro app** and `main` holds the
Next app — `main` is ahead. Harvest old Astro code with `git show dev:<path>`,
never by checking `dev` out over the working tree.

## Conventions that bite

- **`output: "server"` — there is no `getStaticPaths` anywhere.** Pagination is a
  runtime bounds check on `Astro.params`, not a build-time param list.
- **GROQ queries must live in `.ts` files.** Sanity TypeGen cannot parse `.astro`
  frontmatter, so `defineQuery` calls in `.astro` files are silently skipped.
- **Never read secrets from `import.meta.env`.** Vite inlines non-`PUBLIC_` vars
  into the server bundle, baking them into the deployed Worker script. Read them
  per-request from `locals.runtime.env`.
- **Cloudflare bindings are not inherited into `env.production`.** Anything added
  to the top level of `wrangler.jsonc` must be repeated there.
- **`stegaClean` anything bound to an attribute**, `<meta>`, JSON-LD, or XML.
  Stega's zero-width characters are harmless in text nodes and corrupting in
  `href`, `src`, and feeds.
- **`@sanity/icons` v5 has no root-entry icon exports.** Import from subpaths:
  `import {UserIcon} from "@sanity/icons/User"`.
- `apps/sanity/plugins/podcast-rss/` is vendored, not an npm dep — see its README.

## Agent skills

Sanity guidance is vendored in `.agents/skills/` (pinned by `skills-lock.json`).
The Astro-relevant ones for this migration:

- `.agents/skills/portable-text-serialization/rules/astro.md` — `astro-portabletext`
  usage. Note it uses **singular** `type` / `block` / `mark` keys, unlike
  `@portabletext/react`'s plural `types` / `marks`.
- `.agents/skills/sanity-best-practices/references/astro.md`
- `.agents/skills/content-modeling-best-practices/`, `seo-aeo-best-practices/`

`.agents/skills/sanity-live-cache-components/` documents the Next.js
`cacheComponents` + `next-sanity` pattern being removed. It applies only to
`apps/web` and should be deleted with it.

Cloudflare guidance comes from the Claude Code cloudflare plugin — invoke the
`cloudflare`, `workers-best-practices`, and `wrangler` skills rather than
guessing Workers APIs.

## Verifying

`pnpm lint`, `pnpm typecheck`, `pnpm build` cover `apps/site`; CI also builds the
Studio and fails if `apps/sanity/extract.json` has drifted from the schema.

Bindings only resolve under `wrangler dev`, not `astro dev` — verify anything
touching `locals.runtime.env`, D1, or OG image generation against a real Worker.

`apps/site/baseline/` holds pre-migration production `sitemap.xml` and RSS
snapshots (472 URLs, 50 items per feed). Diff against them before cutover; a
changed podcast GUID re-publishes every episode to Apple/Spotify.
