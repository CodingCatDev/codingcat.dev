---
type: podcast
authors:
  - alex-patterson
episode: 9
guests:
  - james-r-perkins
recording_date: September 14, 2022 1:45 PM
season: 0
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1661197926/main-codingcatdev-photo/Clerk.dev.jpg
excerpt: 'James walks Alex through how to use Clerk in Next.js'
title: 'Live Coding Clerk, into Next.js with James Perkins'
start: September 14, 2022
youtube: https://youtu.be/4P_ax04-T4c
---

Clerk React is a React Hooks library that makes it easy to build CRUD applications. The library provides a set of high-level hooks that abstract away the details of managing state, fetching data, and handling errors.

Clerk React is designed to be easy to use, even for beginners. The hooks are well-documented and there are plenty of examples to help you get started.

In this blog post, we'll show you how to use Clerk React to build a simple todo app.

## Getting Started

The first step is to install Clerk React. You can do this with the following command:

```bash
npm install clerk-react
```

Once Clerk React is installed, you can start using the hooks in your app.

## Update \_app.tsx

Include the below to wrap all components in a ClerkProvider.

```ts
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ClerkProvider, SignedIn, SignedOut, SignIn, UserButton } from '@clerk/nextjs';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ClerkProvider {...pageProps}>
			<Component {...pageProps} />
		</ClerkProvider>
	);
}

export default MyApp;
```

## Full Repo Example

<section class=" aspect-video">
  <iframe
    title="stackblitz for firebase app check"
    src="https://stackblitz.com/github/CodingCatDev/clerk-demo?embed=1&file=README.md"
    frameborder="0"
    height="100%"
    width="100%"
    loading="lazy"
  />
</section>

[CodingCatDev/clerk-demo](https://github.com/CodingCatDev/clerk-demo)
