---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: Performance
published: published
slug: fundamentals-performance
start: June 1, 2022
title: Fundamentals - Performance
weight: 6
youtube: https://youtu.be/W_3YmcybZKc
---

## **Performance**

Welcome back, performance is one of the greatest benefits of SvelteKit. The hard jobs that make creating performant applications so difficult come for free with Sveltekit. It uses a tool called Vite, with a Svelte plugin, to provide instant server starts, lightning-fast development with hot module reloading, bundling, and the code-splitting that optimizes your code for production.

Code-splitting is breaking up your app to improve the page loading time by only using what is needed for the current page. Instead of a single JavaScript bundle, it splits each route into it’s own chunk. It is essentially a fancy name for dynamic imports. This creates an optimized, production ready version of your application. Now, let’s move on to file system based routing.