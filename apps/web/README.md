# CodingCat.dev — Astro 6 Migration

Fresh Astro 6 project replacing the Next.js site. Deployed to Cloudflare Workers.

## Stack

- **Framework:** Astro 6 (SSR mode)
- **Deployment:** Cloudflare Workers via `@astrojs/cloudflare`
- **CMS:** Sanity via `@sanity/astro`
- **Auth:** better-auth + Drizzle + Cloudflare D1
- **Search:** Sanity Dataset Embeddings
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Interactive Islands:** React via `@astrojs/react`

## Getting Started

From repo root:

```bash
pnpm install
pnpm --filter @codingcatdev/web dev
```

Or from `apps/web`:

```bash
pnpm install && pnpm dev
```

For Cloudflare Workers preview: `pnpm preview` (from `apps/web`).

## Environment Variables

- **Build:** Copy `.env.example` to `.env` or `.env.local`. Sanity project/dataset have defaults; optional vars are commented.
- **Runtime (local):** Copy `.dev.vars.example` to `.dev.vars` and set secrets (Sanity token, better-auth, Google OAuth). In production, set these via `wrangler secret put <NAME>`.

## Deployment

```bash
npm run deploy
```

Requires `wrangler` CLI authenticated with Cloudflare.
