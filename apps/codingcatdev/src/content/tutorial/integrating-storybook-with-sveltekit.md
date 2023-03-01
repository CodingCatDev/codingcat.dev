---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/main-codingcatdev-photo/Storybook.jpg
excerpt: Brittney walks through how to get Storybook working in a new SvelteKit project.
hashnode: https://hashnode.codingcat.dev/tutorial-integrating-storybook-with-sveltekit
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=integrating-storybook-with-sveltekit&_id=d62f77b86e45401999c1c60f6a0ec2bc
published: published
slug: integrating-storybook-with-sveltekit
start: June 4, 2022
title: Integrating Storybook with SvelteKit
youtube: https://youtu.be/Kc1ULlfyUcw
---
## Intro

This is the new [Svelte Sirens](https://codingcat.dev/tutorial/sveltesirens.dev), Sirens Streams, a live stream every 2 weeks featuring a new technology with SvelteKit. On January 19th, we have [Shadid Haque](https://twitter.com/HaqueShadid) coming to teach us how to ingrate a GraphQL Database with FaunaDB.

- TLDR: Skip to full working code - [Storybook-Tailwind-SvelteKit](https://github.com/brittneypostma/storybook-sveltekit)

## Aliases and Tailwind

I wanted to put this towards the top to not torture you with this. We struggled during the live stream, fighting storybook's webpack setup with the vite setup of SK. One of the amazing [Svelte Discord](https://svelte.dev/chat) community members showed us after how they got it done. So, I'm going to go through step by step, what I did to go from nothing to a fully working Storybook & Tailwind project in SvelteKit with aliases functional.

## Steps

1. New SvelteKit project - `npm init svelte@next storybook-sveltekit`
2. Change directory into your project `cd storybook-sveltekit`
3. Install dependencies - `npm i`
4. Install storybook - `npx sb@next init`
5. Try running to see errors - `npm run storybook`
6. Fix storybook errors.   
    - Inside the generated `.storybook` folder add a new `package.json` file.
    - Add this code snippet to the `package.json`
    - Then in `.storybook/main.js` switch the `require` for `import`

```diff
- "preprocess": require("../svelte.config.js").preprocess
+ "preprocess": import("../svelte.config.js").preprocess
```

That's it for the initial setup, Storybook should now be able to run with `npm run storybook`. Next we'll get the aliases fixed.

## Steps to fix aliases

1. In the `svelte.config.js` file, add the aliases you want to use. The base ones I configured were the `$lib` and `$components`:

```jsx
 vite: {
      resolve: {
        alias: {
          $lib: path.resolve('./src/lib'),
          $components: path.resolve('./src/lib/components'),
        },
      },
    },

```

1. In the `.storybook/main.js` file, configure the aliases for Webpack. This is my `main.js` file.

```jsx
const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    {
      name: '@storybook/addon-postcss',
      options: {
          postcssLoaderOptions: {
              implementation: require('postcss')
          }
      }
  }
  ],
  framework: '@storybook/svelte',
  svelteOptions: {
    preprocess: import('../svelte.config.js').preprocess,
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
        test: [/\.stories\.js$/, /index\.js$/],
        use: [require.resolve('@storybook/source-loader')],
        include: [path.resolve(__dirname, '../src')],
        enforce: 'pre'
    });
    config.resolve.alias = {
        ...config.resolve.alias,
        $lib: path.resolve(__dirname, '../src/lib'),
        $components: path.resolve(__dirname, '../src/lib/components')
    };
    return config;
},
	core: {
			builder: 'webpack4'
	}
}

```

1. Try switching out your imports in the `.svelte` files of your components to use one of the aliases. I switched `Header.svelte` import to `import Button from '$components/Button/Button.svelte`.
2. Run Storybook - `npm run storybook`

## Tailwind

We'll be using svelte-add to add Tailwind to the project and then do the steps to get it working inside Storybook.

1. Add tailwind to the project - `npx svelte-add@latest tailwindcss`
2. Install dependencies - `npm i`
3. Add some tailwind to any of the css files. I changed the primary button css to use tailwind with `@apply bg-teal-400 text-white;`
4. Install storybook's postcss addon `npm i -D @storybook/addon-postcss`.
5. Add the config to the `.storybook/main.js` file. The final output is below.

```jsx
const path = require('path');

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    {
      name: '@storybook/addon-postcss',
      options: {
          postcssLoaderOptions: {
              implementation: require('postcss')
          }
      }
  }
  ],
  framework: '@storybook/svelte',
  svelteOptions: {
    preprocess: import('../svelte.config.js').preprocess,
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
        test: [/\.stories\.js$/, /index\.js$/],
        use: [require.resolve('@storybook/source-loader')],
        include: [path.resolve(__dirname, '../src')],
        enforce: 'pre'
    });
    config.resolve.alias = {
        ...config.resolve.alias,
        $lib: path.resolve(__dirname, '../src/lib'),
        $components: path.resolve(__dirname, '../src/lib/components')
    };
    return config;
},
core: {
    builder: 'webpack4'
}
}

```

1. Import the tailwind CSS file inside `.storybook/preview.js`, mine was `import '../src/app.css'`.
2. Try it out - `npm run storybook`

## Lessons learned

There are still a few things Storybook has to get running easier with ESM. There is still an [open issue](https://github.com/storybookjs/addon-svelte-csf/issues/37) with the [addon-svelte-csf](https://github.com/storybookjs/addon-svelte-csf) at the time of writing. Overall though, we were able to get a SvelteKit project up and running with Storybook and Tailwind integrated and aliases working. As always, you can find me on [Twitter](https://twitter.com/BrittneyPostma), [Coding Cat Discord](https://discord.gg/kGYAaAKZQf) or the [Svelte Discord](https://svelte.dev/chat). Later!