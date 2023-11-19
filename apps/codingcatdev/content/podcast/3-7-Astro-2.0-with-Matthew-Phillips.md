---
type: podcast
authors:
  - brittney-postma
episode: 7
recording_date: February 2, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1677024834/main-codingcatdev-photo/Astro-2.0-with-Matthew-Phillips.jpg
devto: https://dev.to/codingcatdev/37-astro-20-with-matthew-phillips-1m4k
excerpt: Matthew Phillips talks with Brittney all about the new features in Astro 2.0.
guests:
  - matthew-phillips
hashnode: https://hashnode.codingcat.dev/podcast-3-6-Effective-Testing-using-Cypress.io
picks:
  [
    {
      author: 'brittney-postma',
      name: 'Type-Safe Markdown',
      site: 'https://astro.build/blog/introducing-content-collections/'
    },
    {
      author: 'matthew-phillips',
      name: 'The Last of Us',
      site: 'https://www.hbo.com/the-last-of-us'
    }
  ]
slug: 3-7-Astro-2.0-with-Matthew-Phillips
sponsors:
  - storyblok
spotify: https://open.spotify.com/episode/2z0AQixxj4qTkGPXkvvUYJ?si=9889cdce30cf4dfd
start: March 1, 2023
title: Astro 2.0 with Matthew Phillips
youtube: https://youtu.be/HZp0IBNhqnY
---

## Questions

1. Can you tell us more about yourself?
2. How did you get involed with Astro?
3. Can you give a high level overview of what Astro is and why someone might use it?
4. What is new in Astro 2.0?
   1. [Content Collections](https://docs.astro.build/en/guides/content-collections/)
      1. How does this help with type-safe markdown? Zod integration
   2. [Hybrid prerendering](https://docs.astro.build/en/guides/server-side-rendering/#hybrid-rendering)
   3. [Error Message Overlay](https://astro.build/blog/introducing-content-collections/)
5. What were the breaking changes and is there an easy migration path or command to help?

# Welcome to Astro 2.0: A Deep Dive into the Latest Features

## Introduction

Welcome back to another episode of the CodingCat Dev podcast! Unfortunately Alex Patterson can't join us today, but I'm thrilled to have Matthew Phillips here as our special guest co-host. Matthew has been involved with front-end development and tooling for around 10 years now and previously worked on open source projects like CanJS. More recently, he was hired by Fred K. Schott (founder of Astro) to work at his company Skypack. This eventually led to Matthew being part of the core Astro team!

In this post, Matthew and I will be taking a deep dive into all the new features and changes introduced in Astro 2.0. There's a lot to cover so let's get started!

## Creating an Astro Project

To create a new Astro project, simply run:

```sh
npm init astro@latest
```

Then pass in `--template` to select a starter template. For this demo, Matthew uses the `blog` template which includes some default pages and content to get up and running quickly.

Once installed, the project structure contains:

- A `src` folder
- A `pages` folder for routing
- Astro, Markdown, and MDX pages
- Components like `BaseHead`

Astro pages allow you to define the entire HTML structure in the file. This gives you full control compared to frameworks where you focus more on components and layouts.

Layouts in Astro are used like components. For example, the `post.astro` layout injects the blog post content into the correct spots.

post.astro

```html
<html>
	<head></head>

	<body>
		<header>
			<h1>{post.frontmatter.title}</h1>
		</header>
		<article>
			<slot />
		</article>
	</body>
</html>
```

## Islands Architecture

One powerful concept in Astro is **islands**. This allows you to mix and match Astro and framework components on a page.

To use a React, Svelte, etc component as an island, import it and add `client:` before it:

`Page.astro`

```jsx
<client:Counter />
```

This tells Astro to hydrate the component on the client-side. Different directives control when and how it loads:

- `client:load` - Loads on pageload
- `client:idle` - Loads when CPU is idle
- `client:visible` - Loads when scrolled into view

Islands allow using the component model with Astro's static generation and HTML-focused approach. Astro handles loading the necessary JavaScript for you.

## Server-side Rendering

Astro originally launched as a static site generator. But now in 2.0, it also supports server-side rendering!

To enable SSR, set `output: 'server'` in `astro.config.mjs`:

```js
astro.config.mjsexport default {// ...output: 'server'}
```

The goal is that developing in Astro feels the same no matter the output. You can start with static generation, then switch to SSR later by just changing that config value!

The key difference is that dynamic routes with `getStaticPaths` only work in static site generation mode. This lets Astro know all the pages to build at compile time.

## Page Pre-rendering

Though Astro now supports SSR, you may want specific pages to be statically generated, like a marketing homepage.

2.0 introduced **page pre-rendering** to handle this. For any Astro page, add:

```js
Page.astroexport const prerender = true
```

When built, this page will be statically generated as HTML instead of using a serverless function.

Pre-rendering allows parts of a site to be SSR while keeping important pages fast and static.

## Content Collections

Content Collections provide a powerful way to manage and access markdown and MDX content.

In `src/content`, you can define a schema for a collection:

```js
src/content/config.tsimport {defineCollection, z} from 'astro:content';
export const blog = defineCollection({schema: {title: z.string(),description: z.string(),

```

This adds:

- Type checking and intellisense
- Required fields
- Automatic TypeScript interfaces
- And more!

In pages, import the collection and access the data:

```js
const posts = await Astro.glob('../posts/*.md');
<ul>
	{' '}
	{posts.map((post) => {
		<li>
			<a href={post.url}>{post.data.title}</a>
		</li>;
	})}
</ul>;
```

Overall, this leads to a much better developer experience than has been possible with Astro content in the past.

## Astro 2.0 Migration

There weren't a ton of major breaking changes in 2.0:

- Upgraded to Vue 3
- Dropped Node 14 support
- Some legacy APIs removed
- Minor changes like output directory

Most upgrades should be painless. And the Astro team has been quick to release bugfix patches like 2.0.5, 2.1, etc.

If you encounter any issues, the [Astro 2.0 Migration Guide](https://docs.astro.build/en/guides/migrate-to-astro-2/) covers everything in detail. Feel free to also raise questions in the GitHub discussions!

## Conclusion

That wraps up this whirlwind tour of Astro 2.0! Some key takeaways:

- Powerful new islands architecture
- Support for server-side rendering
- Page pre-rendering
- Content Collections to manage Markdown/MDX
- And more!

Huge thanks to Matthew for explaining all the great new capabilities. The progress that Astro has made with such a small team is truly impressive. I'm excited to see where Astro goes next after this major release!

What are your thoughts on Astro 2.0? Let me know in the comments!

## Useful Links

Content Collections: [https://docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/)

Hybrid prerendering (aka prerendering): [https://docs.astro.build/en/guides/server-side-rendering/#hybrid-rendering](https://docs.astro.build/en/guides/server-side-rendering/#hybrid-rendering)

New error message overlay (there’s a screenshot in this article): [https://astro.build/blog/introducing-content-collections/](https://astro.build/blog/introducing-content-collections/)

![Untitled](https://media.codingcat.dev/image/upload/v1677025274/main-codingcatdev-photo/3fd12f7f-2299-4c55-b2d2-198254fd4418.png)
