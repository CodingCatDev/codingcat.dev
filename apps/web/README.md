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

```bash
cd astro-app
npm install
npm run dev
```

For Cloudflare Workers preview:
```bash
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in values. For Cloudflare secrets, use `.dev.vars` locally.

See `.env.example` for all required variables.

## Deployment

```bash
npm run deploy
```

Requires `wrangler` CLI authenticated with Cloudflare.
