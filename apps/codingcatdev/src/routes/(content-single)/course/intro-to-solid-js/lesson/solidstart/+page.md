---
type: lesson
authors:
  - anthony-campolo
cloudinary_convert: false
cover: 
locked: locked
published: draft
slug: solidstart
section: SolidStart
title: SolidStart
weight: 4
---

## Project Setup

Change your `dev`, `build`, and `start` scripts to use the `solid-start` command.

```json
{
  "scripts": {
    "dev": "solid-start dev",
    "build": "solid-start build",
    "start": "solid-start start"
  }
}
```

### Vite Configuration

In `vite.config.js`, remove the `solidPlugin` from `vite-plugin-solid` and replace it with `solid` from `solid-start/vite`.

```jsx
// vite.config.js

import { defineConfig } from 'vite'
import solid from 'solid-start/vite'
// import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solid()]
  // plugins: [solidPlugin()]
})
```

### Client and Server Entry

SolidStart projects are organized in a similar way to Remix or projects using React Server Components. One file is used as an entry point for the application to start in the client and another file is used as an entry point for the application to start on the server. Create files called `entry-client.jsx` and `entry-server.jsx` for each.

```bash
echo > src/entry-client.jsx
echo > src/entry-server.jsx
```

`entry-client.jsx` is where your app starts in the browser. `<StartClient />` wraps our application root and includes `Context` providers for routing and meta data. `mount` either calls `render` or `hydrate` depending on the configuration.

```jsx
// src/entry-client.jsx

import { mount, StartClient } from 'solid-start/entry-client'

mount(
  () => <StartClient />, document
)
```

`entry-server.jsx` is where your app starts on the server. `<StartServer event={event} />` wraps our application root and also includes `Context` providers for routing and meta data. It accepts an `event` and passes it to the `renderAsync(codeFn, options)` middleware which then calls Solid's `renderToStringAsync` under the hood to asynchronously render the application. This responds when the page has been fully loaded and rendered.

```jsx
// src/entry-server.jsx

import {
  StartServer, createHandler, renderAsync
} from 'solid-start/entry-server'

export default createHandler(
  renderAsync((event) => <StartServer event={event} />)
)
```

All `Suspense` and data loading on initial load happens on the server. `Event` objects that originate from our underlying runtime are passed with a `PageEvent` object containing the following information:

- `request` - The current request
- `responseHeaders` - The headers being built for the response
- `clientAddress` - The IP address of the remote client
- `locals` - An object for storing local data that lives the life of the request, like user or authentication data
- `setStatusCode(code)` - Sets the status code
- `getStatusCode()` - Returns the current status code
- `fetch(url, init)` - Fetch API that can call API helpers directly on the server

### Root

`root.jsx` defines the document rendered by your application. The `Root` component from `root.jsx` is an isomorphic entry into your application, structured like an HTML document but with capitalized components, including core elements like `Suspense` and `ErrorBoundary` for managing loading and error states.

Notably, it provides a space for defining `<Routes>`, positioning `<ErrorBoundary>` high up for effective error catching, and inserting global Context Providers and universal components, such as top-level navigation, into the `<Body>`.

```jsx
// src/root.jsx

// @refresh reload
import { Suspense } from 'solid-js'
import {
  Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts
} from 'solid-start'
import './root.css'

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <Suspense>
            <Routes>
              <FileRoutes />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  )
}
```

### Start Development Server

Run your development server with the `solid-start dev` command.

```bash
pnpm dev
# npm run dev
```

Open [localhost:3000](http://localhost:3000/).

## Deployment Adapters

SolidStart includes various adapters for deploying your project to specific hosting providers like Netlify or Vercel.

### Configure Netlify Adapter

We'll use the Netlify adapter, so install `solid-start-netlify` with `pnpm` or `npm`.

```bash
pnpm add -D solid-start-netlify
# npm i -D solid-start-netlify
```

Our `build` command will be `pnpm build` and our publish directory will now be called `netlify`.

```toml
# netlify.toml

[build]
  command = "pnpm build"
  publish = "netlify"
```

Return to `vite.config.js` and import `netlify` from `solid-start-netlify`. Set it to `adapter` and specify `true` for the `edge` configuration.

```jsx
// vite.config.js

import { defineConfig } from 'vite'
import solid from 'solid-start/vite'
import netlify from 'solid-start-netlify'

export default defineConfig({
  plugins: [solid({
    adapter: netlify({ edge: true })
  })]
})
```

Push your new changes to GitHub and your Netlify website should rebuild and update automatically.