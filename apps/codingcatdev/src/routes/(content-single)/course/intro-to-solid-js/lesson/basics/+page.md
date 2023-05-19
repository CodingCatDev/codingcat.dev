---
type: lesson
authors:
  - alex-patterson
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1684519320/main-codingcatdev-photo/courses/solidjs-intro/basics.png
locked: locked
published: draft
section: Basics
slug: basics
title: Solid Basics
weight: 2
---

## Project Structure and Vite Configuration

```bash
mkdir ajcwebdev-solid
cd ajcwebdev-solid
pnpm init
pnpm add -D solid-js @solidjs/meta @solidjs/router vite vite-plugin-solid
```

Add `vite` scripts to `package.json`.

```json
{
	"name": "",
	"version": "1.0.0",
	"description": "",
	"type": "module",
	"scripts": {
		"dev": "vite",
		"build": "vite build",
		"serve": "vite preview"
	},
	"keywords": ["SolidJS"],
	"author": "FIRST_NAME LAST_NAME",
	"license": "MIT",
	"devDependencies": {
		"@solidjs/meta": "^0.28.0",
		"@solidjs/router": "^0.4.3",
		"solid-js": "^1.5.5",
		"vite": "^3.1.3",
		"vite-plugin-solid": "^2.3.6"
	}
}
```

Create a `vite.config.js` file. This will allow us to define our Vite Configuration with the Solid Plugin.

```bash
echo > vite.config.js
```

Import `solidPlugin` from `vite-plugin-solid` and add it to the `plugins` array inside Vite's `defineConfig` helper.

```jsx
// vite.config.js

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solidPlugin()]
});
```

### HTML Entry Point

Create an `index.html` file for our HTML entry point.

```bash
echo > index.html
```

The root Solid component will be imported as an ESM module from `/src/root.jsx` and set to the `src` attribute on `script`.

```html
<!-- index.html -->

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#000000" />
		<title>A First Look at Solid</title>
	</head>

	<body>
		<noscript>You need to enable JavaScript to run this app.</noscript>
		<div id="root"></div>
		<script src="/src/root.jsx" type="module"></script>
	</body>
</html>
```

### Render Function

```bash
mkdir src
echo > src/root.jsx
```

```jsx
// src/root.jsx

/* @refresh reload */
import { render } from 'solid-js/web';

function App() {
	return (
		<div>
			<header>
				<h1>A First Look at Solid</h1>
				<a href="<https://github.com/solidjs/solid>" target="_blank" rel="noopener noreferrer">
					Learn Solid
				</a>
			</header>
		</div>
	);
}

render(() => <App />, document.getElementById('root'));
```

### Start Development Server

```bash
pnpm dev # or npm run dev | yarn dev
```

Open [localhost:5173](http://localhost:5173/) to view the running application in your browser. The page will reload if you make edits.

![Showing SolidJS running on localhost:5173](https://media.codingcat.dev/image/upload/v1684519512/main-codingcatdev-photo/courses/solidjs-intro/01-solid-home-page-on-localhost-5173.png)

## File System Based Routing

```bash
mkdir src/routes
echo > src/routes/index.jsx
```

```jsx
// src/routes/index.jsx

export default function App() {
	return (
		<div class="App">
			<header class="header">
				<h1>A First Look at Solid</h1>
				<a class="link" href="https://github.com/solidjs" target="_blank">
					Learn Solid
				</a>
			</header>
		</div>
	);
}
```

## Styling

```bash
echo > src/root.css
```

```css
/* src/root.css */

body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
		'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.App {
	text-align: center;
}

.header {
	background-color: #282c34;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: calc(10px + 2vmin);
	color: white;
}

.link {
	color: #b318f0;
}
```

Import `App` component into `root.jsx` file.

```jsx
// src/root.jsx

/* @refresh reload */
import { render } from 'solid-js/web';
import App from './routes/index';
import './root.css';

render(() => <App />, document.getElementById('root'));
```

![A page showing A First Look at Solid text](https://media.codingcat.dev/image/upload/v1684519512/main-codingcatdev-photo/courses/solidjs-intro/02-solid-home-page-with-styling.png)

## Components and Reactive Primitives

When building applications with Solid, there are two foundational concepts that form the building blocks at the core of the framework. These are **Components** and the **Reactive Primitives** including Signals, Effects, and Memos. Before diving into the first Reactive Primitive, let's cover components briefly.

```bash
mkdir src/components
echo > src/components/Counter.jsx
```

A Component is a function that accepts a `props` object and returns JSX elements. It is a lightweight factory functions that does not hold state itself.

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js';

const BasicComponent = (props) => {
	const value = () => props.value || 'default';
	return <div>{value}</div>;
};

export default function Counter() {
	return (
		<div>
			<BasicComponent value={value()} />
		</div>
	);
}
```

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js';

const BasicComponent = (props) => {
	const value = () => props.value || 'default';
	return <div>{value}</div>;
};

export default function Counter() {
	const [value, setValue] = createSignal('');

	return (
		<div>
			<BasicComponent value={value()} />
			<input type="text" oninput={(e) => setValue(e.currentTarget.value)} />
		</div>
	);
}
```

## Create Signal

**[Signals](https://www.solidjs.com/tutorial/introduction_signals)** are the most basic reactive primitive and all reactivity in Solid is based around them. So what are Signals exactly? Signals contain values that change over time. Changing values are tracked by the framework and broadcast to the rest of interface. A signal automatically updates anything tracking it every time the signal's value is changed.

This ensures the changing values are reflected in real time. The value being tracked can be any JavaScript object. These trackable signals require observers that can be updated by those trackable values. The `createSignal` function takes an `initialValue` as its first argument and returns a getter and a setter which together form a pair of functions as a two-element array.

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js';

const initialValue = 0;

export default function Counter() {
	const [getValue, setValue] = createSignal(initialValue);

	console.log(getValue()); // getValue() == 0

	return <div>Value: {getValue()}</div>;
}
```

Import the `Counter` component to `src/routes/index.jsx` and return `<Counter />` underneath the heading and link tag.

```jsx
// src/routes/index.jsx

import Counter from '../components/Counter';

export default function App() {
	return (
		<div class="App">
			<header>
				<h1>A First Look at Solid</h1>
				<a href="https://github.com/solidjs" target="_blank">
					Learn Solid
				</a>
				<Counter />
			</header>
		</div>
	);
}
```

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js';

const initialValue = 0;
const newValue = 1;

export default function Counter() {
	const [getValue, setValue] = createSignal(initialValue);

	setValue(newValue);
	console.log(getValue()); // getValue() == 1

	return <div>Value: {getValue()}</div>;
}
```

## Create Effect

An **[Effect](https://www.solidjs.com/tutorial/introduction_effects)** is an example of an observer that runs a side effect depending on a signal. Effects are a way to make general, arbitrary code (also known as side effects) run whenever dependencies change. [createEffect](https://www.solidjs.com/docs/latest#createeffect) creates a new computation (for example to modify the DOM manually) and runs the given function in a tracking scope.

```jsx
// src/components/Counter.jsx

import { createSignal, createEffect } from 'solid-js';

export default function Counter() {
	const [count, setCount] = createSignal(0);
	createEffect(() => count());
	return (
		<>
			<button onClick={() => setCount(count() + 1)}>Click Me</button>

			<div>The count is now: {count()}</div>
		</>
	);
}
```

This automatically tracks the dependencies and reruns the function whenever the dependencies update.

![A browser showing a Click Me Button with a count of 1](https://media.codingcat.dev/image/upload/v1684519511/main-codingcatdev-photo/courses/solidjs-intro/04-create-effect-button.png)

## Create Resource

```bash
echo > src/components/Users.jsx
```

```jsx
// src/components/Users.jsx

import { createResource, createSignal, For } from 'solid-js';

const fetchUser = async () =>
	(await fetch(`https://jsonplaceholder.typicode.com/users?_limit=5`)).json();

export default function Users() {
	const [user] = createResource(fetchUser);
	const [users, setUsers] = createSignal([]);

	return (
		<div>
			<span>{user.loading && 'Loading...'}</span>
			<div>
				<pre>{JSON.stringify(user(), null, 2)}</pre>
			</div>

			<For each={users()} fallback={<p>Loading...</p>}>
				{(user) => <div>{user.name}</div>}
			</For>
		</div>
	);
}
```

```jsx
// src/routes/index.jsx

import Counter from '../components/Counter';
import Users from '../components/Users';

export default function App() {
	return (
		<main>
			<h1>A First Look at Solid</h1>
			<a href="https://github.com/solidjs" target="_blank">
				Learn Solid
			</a>

			<Counter />
			<Users />
		</main>
	);
}
```

![Browser window showing a count of 1 with a list of names](https://media.codingcat.dev/image/upload/v1684519512/main-codingcatdev-photo/courses/solidjs-intro/05-onmount-displaying-users.png)

## Deployment

You can deploy the `dist` folder to any static host provider.

```bash
pnpm build
```

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

```bash
echo > netlify.toml
pnpm add -D netlify-cli
```

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "dist"
```

```
pnpm ntl login
pnpm ntl init
```

```
? What would you like to do? +  Create & configure a new site
? Team: Anthony Campolo's team
? Site name (you can change it later): ajcwebdev-solid

Site Created

Admin URL: <https://app.netlify.com/sites/ajcwebdev-solid>
URL:       <https://ajcwebdev-solid.netlify.app>
Site ID:   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

Linked to ajcwebdev-solid

? Your build command (hugo build/yarn run build/etc): npm run build
? Directory to deploy (blank for current dir): dist

Adding deploy key to repository...
Deploy key added!

Creating Netlify GitHub Notification Hooks...
Netlify Notification Hooks configured!

Success! Netlify CI/CD Configured!

This site is now configured to automatically deploy from github branches & pull requests

Next steps:

  git push       Push to your git repository to trigger new site builds
  netlify open   Open the Netlify admin URL of your site

```

Open [ajcwebdev-solid.netlify.app](https://ajcwebdev-solid.netlify.app/).

## SolidStart

## Project Setup

```json
{
	"type": "module",
	"scripts": {
		"dev": "solid-start dev",
		"build": "solid-start build",
		"start": "solid-start start"
	}
}
```

```jsx
// vite.config.js

import { defineConfig } from 'vite';
import solid from 'solid-start/vite';
// import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	plugins: [solid()]
	// plugins: [solidPlugin()]
});
```

## Client and Server Entry

```bash
echo > src/entry-client.jsx
echo > src/entry-server.jsx
```

```jsx
// src/entry-client.jsx

import { mount, StartClient } from 'solid-start/entry-client';

mount(() => <StartClient />, document);
```

```jsx
// src/entry-server.jsx

import { StartServer, createHandler, renderAsync } from 'solid-start/entry-server';

export default createHandler(renderAsync((event) => <StartServer event={event} />));
```

### Root

```jsx
// src/root.jsx

// @refresh reload
import { Suspense } from 'solid-js';
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts } from 'solid-start';
import './root.css';

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
	);
}
```

Start development server

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000/).

## Deployment Adapters

```bash
pnpm add -D solid-start-netlify
```

```toml
# netlify.toml

[build]
  command = "npm run build"
  publish = "netlify"
```

```jsx
// vite.config.js

import { defineConfig } from 'vite';
import solid from 'solid-start/vite';
import netlify from 'solid-start-netlify';

export default defineConfig({
	plugins: [solid({ adapter: netlify({ edge: true }) })]
});
```
