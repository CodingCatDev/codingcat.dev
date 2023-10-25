---
type: podcast
authors:
  - alex-patterson
episode: 16
recording_date: May 4, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1683829447/main-codingcatdev-photo/MDSvex-with-pngwn.jpg
devto:
excerpt: 'Pngwn joins Alex to show discuss his program MDSvex and to walk Alex through how to use it on his own Coding Cat site.'
guests:
  - pngwn
hashnode:
picks:
  [
    { author: 'pngwn', name: 'Hugging Face', site: 'https://huggingface.co/chat/' },
    { author: 'pngwn', name: 'Open Assitant', site: 'https://open-assistant.io/' },
    { author: 'alex-patterson', name: 'Xata', site: 'https://xata.io' }
  ]
slug: 3-16-MDSvex-with-pngwn
sponsors:
  - storyblok
spotify: https://open.spotify.com/episode/2dkxDnNqCPvsOwBTUhu0bD?si=_wknx6m5RVa4r1q0uTyvew
start: June 14, 2023
title: 'MDSvex with pngwn'
youtube: https://youtu.be/0ukXs_xUbJ8
---

## Chapters

00:00 Welcome pngwn and Intro to MDSvex
03:27 Walkthrough of the Basics
08:20 Sponsor: Storyblock
09:20 Using MDSvex with Coding Cat
16:38 Tradeoffs
19:28 Simplicity of MDSvex
24:50 Creating First Component and Live Coding
52:28 How to Approach MDSvex
57:16 Perfect Picks

### Benefits of using mdsvex

There are several benefits to using mdsvex:

- **Simplicity:** mdsvex files are just regular Markdown files, with the addition of the `.svx` extension. This means that you can use any Markdown editor to write your posts, and you don't need to learn any new syntax.
- **Power:** Svelte is a powerful JavaScript framework that allows you to create interactive web components. With mdsvex, you can embed these components directly into your Markdown posts. This opens up a whole new range of possibilities for your blog.
- **Flexibility:** mdsvex is compatible with any SvelteKit project. This means that you can use it to create a blog from scratch, or to add interactive elements to an existing blog.

### How to use mdsvex

To use mdsvex, you first need to install the `mdsvex` package. You can do this with npm or yarn:

```
npm install mdsvex
```

```
yarn add mdsvex
```

Once you have installed the package, you need to add it to your SvelteKit project's `vite.config.js` file:

JavaScript

```
import mdsvex from 'mdsvex';

export default {
  plugins: [mdsvex()],
};
```

Use code with caution. [Learn more](/faq#coding)

content_copy

Now, you can start writing mdsvex files! To do this, simply create a new file with the `.svx` extension. You can then write Markdown in the file, and embed Svelte components using the `<script>` and `<style>` tags.

For example, the following mdsvex file would create a simple poll:

Code snippet

```
---
title: My poll
---

This is a poll!

<script>
  import { Poll } from 'svelte-poll';

  const poll = new Poll({
    options: [
      'Option 1',
      'Option 2',
      'Option 3',
    ],
  });
</script>

<style>
  .poll {
    margin: 1rem;
  }
</style>

<div class="poll">
  {poll.render()}
</div>
```

Use code with caution. [Learn more](/faq#coding)

content_copy

When you build your SvelteKit project, mdsvex will compile the Svelte components in your mdsvex files to JavaScript. This JavaScript will then be included in the HTML of your blog posts.

### Conclusion

mdsvex is a powerful tool that allows you to create interactive and engaging blog posts. It is easy to use, and it is compatible with any SvelteKit project. If you are looking for a way to add more dynamism to your blog, I highly recommend using mdsvex.
