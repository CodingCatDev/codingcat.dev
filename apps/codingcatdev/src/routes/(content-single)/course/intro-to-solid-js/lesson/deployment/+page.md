---
type: lesson
authors:
  - anthony-campolo
cloudinary_convert: false
cover: 
locked: locked
published: draft
slug: deployment
title: Deployment
weight: 2
---

## Deployment

You can deploy the `dist` folder to any static hosting provider. To see what this `dist` folder contains, run the `vite build` command with `pnpm` or `npm`.

```bash
pnpm build
# npm run build
```

### Create GitHub Repository

Create a GitHub

```bash
git init
git add .
git commit -m "solid"
gh repo create ajcwebdev-solid \
  --description="An example SolidJS application deployed on Netlify" \
  --public \
  --push \
  --source=. \
  --remote=upstream
```

### Configure Netlify Deployment

```bash
echo > netlify.toml
```

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"
```

### Deploy with Netlify CLI

```bash
pnpm add -D netlify-cli
```

Login to your Netlify account with `ntl login` and then initialize the Netlify project with `ntl init`.

```
pnpm ntl login
pnpm ntl init
```

Open [ajcwebdev-solid.netlify.app](https://ajcwebdev-solid.netlify.app/).