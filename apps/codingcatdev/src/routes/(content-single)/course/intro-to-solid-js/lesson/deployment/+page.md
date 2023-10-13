---
type: lesson
authors:
  - anthony-campolo
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1689262234/main-codingcatdev-photo/courses/solidjs-intro/deployment.png
locked: locked
published: published
slug: deployment
title: Deployment
weight: 3
---

## Deployment

You can deploy the `dist` folder to any static hosting provider. To see what this `dist` folder contains, run the `vite build` command with `pnpm` or `npm`.

```bash
pnpm build
# npm run build
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

### Create GitHub Repository

Before initializing a git repo and pushing it to GitHub, create a `.gitignore` file.

```bash
echo >> .gitignore
```

Add the following to `.gitignore`.

```
.DS_Store
node_modules
dist
```

After staging and committing your project you can create a GitHub repository through the website's dashboard, with a desktop GUI, or with the GitHub CLI commands detailed below:

```bash
git init
git add .
git commit -m "solid"
gh repo create intro-to-solid \
  --description="An example SolidJS application deployed on Netlify" \
  --public \
  --push \
  --source=. \
  --remote=upstream
```

### Deploy with Netlify CLI

Add the `netlify-cli` as a package and login to your Netlify account with `ntl login`.

```bash
pnpm add -D netlify-cli
pnpm ntl login
```

Initialize the Netlify project with `ntl init`.

```bash
pnpm ntl init
```

Open [intro-to-solid.netlify.app](https://intro-to-solid.netlify.app/).
