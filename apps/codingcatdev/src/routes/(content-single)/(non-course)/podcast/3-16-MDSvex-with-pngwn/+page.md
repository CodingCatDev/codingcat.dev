---
type: podcast
authors:
  - alex-patterson
episode: 16
recording_date: 'May 4, 2023 2:15 PM'
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1683829447/main-codingcatdev-photo/MDSvex-with-pngwn.jpg
devto: 'https://dev.to/codingcatdev/mdsvex-with-pngwn-37d3'
excerpt: >-
  Pngwn joins Alex to show discuss his program MDSvex and to walk Alex through
  how to use it on his own Coding Cat site.
guests:
  - pngwn
hashnode: podcast-3-16-MDSvex-with-pngwn
picks:
  - author: pngwn
    name: Hugging Face
    site: 'https://huggingface.co/chat/'
  - author: pngwn
    name: Open Assitant
    site: 'https://open-assistant.io/'
  - author: alex-patterson
    name: Xata
    site: 'https://xata.io'
slug: 3-16-MDSvex-with-pngwn
sponsors:
  - storyblok
spotify: >-
  https://open.spotify.com/episode/2dkxDnNqCPvsOwBTUhu0bD?si=_wknx6m5RVa4r1q0uTyvew
start: 'June 14, 2023'
title: MDSvex with pngwn
youtube: 'https://youtu.be/0ukXs_xUbJ8'
---

<script lang="ts">
	import Button from '$lib/components/content/Button.svelte'
</script>

## What is mdsvex

[mdsvex](https://mdsvex.pngwn.io/) is a file format that combines the best of Markdown and Svelte. It allows you to write content in Markdown, but also includes the ability to embed Svelte components into your posts. This can be useful for adding interactive elements to your blog, such as polls, quizzes, and code editors.

### Benefits of using mdsvex

There are several benefits to using mdsvex:

- **Simplicity:** mdsvex files are just regular Markdown files, with the addition of the `.svx` extension. This means that you can use any Markdown editor to write your posts, and you don't need to learn any new syntax.
- **Power:** Svelte is a powerful JavaScript framework that allows you to create interactive web components. With mdsvex, you can embed these components directly into your Markdown posts. This opens up a whole new range of possibilities for your blog.
- **Flexibility:** mdsvex is compatible with any SvelteKit project. This means that you can use it to create a blog from scratch, or to add interactive elements to an existing blog.

### How to use mdsvex

To use mdsvex, you first need to install the `mdsvex` package. You can do this with npm or yarn:

```sh
npm install mdsvex
```

```sh
yarn add mdsvex
```

Once you have installed the package, you need to add it to your SvelteKit project's `svelte.config.js` file:

```ts
import mdsvex from 'mdsvex';

export default {
	plugins: [mdsvex()]
};
```

CodingCat.dev's `svelte.config.js`

```ts
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

// TODO: remove .svx and .md from production builds

/** @type {import('@sveltejs/kit').Config} */
console.log(`Using ${process.env.NODE_ENV} config`);
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'warn',
			handleHttpError: ({ path, referrer, message }) => {
				// if nothing refers to it we don't care
				// most likely this is a draft in production
				// TODO: can we make this better?
				if (referrer === null) {
					console.debug('SKIPPING 404 ISSUE', path);
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		mdsvex({ extensions: ['.svx', '.md'] }),
		preprocess({
			postcss: true
		})
	]
};

export default config;
```

Now, you can start writing mdsvex files! To do this, simply create a new file with the `.svx` or `.md` extension. You can then write Markdown in the file, and embed Svelte components using the `<script>` and `<style>` tags.

For example, in this actual post we have the below (appreviated), where in our `.md` file we import the `Button`.

```md
---
type: podcast
---

<script lang="ts">
	import Button from '$lib/components/content/Button.svelte'
</script>

<Button />
```

Which allows for this very button below to be used directly from our markdown. Go ahead click away on it!

<Button />

When you build your [SvelteKit](https://kit.svelte.dev/) project, [mdsvex](https://mdsvex.pngwn.io/) will compile the Svelte components in your mdsvex files to JavaScript. This JavaScript will then be included in the HTML of your blog posts.

### Conclusion

mdsvex is a powerful tool that allows you to create interactive and engaging blog posts. It is easy to use, and it is compatible with any SvelteKit project. If you are looking for a way to add more dynamism to your blog, I highly recommend using mdsvex.
