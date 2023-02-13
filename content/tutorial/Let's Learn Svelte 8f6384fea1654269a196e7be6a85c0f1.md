---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1635950500/main-codingcatdev-photo/let_s_learn_svelte.png
excerpt: Embrace the hype. Give Svelte and SvelteKit a try!  Learn how to build modern web applications with SvelteKit, a quickly growing framework for generating static web pages (SSG) as well as Server Side Rendered content (SSR). In this crash course, you'll learn all the basics including file-based routing, API routes, dynamic routes, global and scoped CSS, and much more!
hashnode: https://hashnode.codingcat.dev/tutorial-lets-learn-svelte
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=lets-learn-svelte&_id=8f6384fea1654269a196e7be6a85c0f1
published: published
slug: lets-learn-svelte
start: June 1, 2022
title: Let's Learn Svelte
youtube: https://youtu.be/fOD_3iSiwTQ
---
Learn how to build modern web applications with SvelteKit, a quickly growing framework for generating static web pages (SSG) as well as Server Side Rendered content (SSR). In this crash course, you'll learn all the basics including file-based routing, API routes, dynamic routes, global and scoped CSS, and much more!

## Source Code

[https://github.com/brittneypostma/sveltekit-starter](https://github.com/brittneypostma/sveltekit-starter)

## What is Svelte?

- Svelte is a component framework that allows you to break up your application into reusable chunks.
- Svelte is similar to React & Vue, with one key difference, no virtual DOM. Instead of letting the browser do the work, Svelte compiles itself away during the build process into vanilla html, css, and javascript.
- Easy global state management with Svelte stores.

## Why SvelteKit?

- The goal with SvelteKit is to have a single recommended path for building everything from high performing web apps to static blog pages.
- With SvelteKit we get file-system based routing, optional rendering (SSR & SSG), code-splitting, CSS scoping by default, the ability to completely disable JavaScript and more.

## Getting Started with a new SvelteKit app

```bash
npm create svelte
```

> At the time of recording, SvelteKit is in a release candidate phase, which means there are no more planned breaking changes.
> 

Here we create a skeleton project without the TypeScript, ESLint, or Prettier configurations.

```bash
cd my-app
npm install
npm run dev -- --open
```

### Aliases

SvelteKit with Vite provides the ability to setup aliases to folders within your app to make it easier to path to different areas. I have an [article](https://codingcat.dev/post/make-pathing-easier-with-aliases-in-sveltekit) on how to set those up if you want to learn more.

Create the `lib` folder within the `src` folder and add a new file, `header.svelte` to it. Inside `header.svelte`, we are going to add a navigation bar for the site.

```html
<header>
  <nav>
    <ul>
      <li>
        <a href="/">Home</a>
      </li>
      <li}>
        <a href="/about">About</a>
      </li>
      <li>
        <a href="/blog">Blog</a>
      </li>
    </ul>
  </nav>
</header>
```

Now we need to create the routes that go to these respective links.

## Routes

Inside the routes folder, we already have an `+page.svelte` file that matches to the home or `/` route. We need to add the `/about` route by creating a new folder named `about` and a new file inside `+page.svelte`. We will add the `/blog` route later since it is a *dynamic* route.

## Layout

We don't want to have to copy and paste our header onto each page. SvelteKit provides a wrapper file named `+layout.svelte` that will wrap the entire application in whatever is in that file. Inside of the routes folder, create a new file named `+layout.svelte` and your app will disappear off your screen if you are running the dev server. This is because Svelte needs a `<slot/>` component to know where to insert the child content to. Add this code to your `+layout.svelte` file to see the header and content on the page.

```html
<script>
  import Header from '$lib/header.svelte'
</script>

<Header />
<main>
  <slot />
</main>

```

## Styling in Svelte

Styling in Svelte is scoped by default to each of the components. If you use an element selector like `p` inside a component, then it will only effect the `p` tags within that component. You can also use global styling by creating a global css file and importing it into the `+layout.svelte` file. Grab the global css I used [https://github.com/brittneypostma/sveltekit-starter/blob/main/src/global.css](https://github.com/brittneypostma/sveltekit-starter/blob/main/src/global.css) and place it into the `src` folder. Then, import the file into `+layout.svelte` like this.

```html
<script>
  import '../global.css'
  import Header from '$lib/header.svelte'
</script>
```

Now the app should start looking a little better.

## SvelteKit Context Module

[https://kit.svelte.dev/docs#ssr-and-javascript](https://kit.svelte.dev/docs#ssr-and-javascript)

SvelteKit provides us with different ways to render our application on a page by page basis, by default, it will be rendered on the server and sent to the client as HTML. For the home route, `+page.svelte`, we only need the content to be statically rendered. There will be no JavaScript added to the page at all. We can add this block to the top of the `+page.js` route to change it.

```jsx
export const prerender = true
```

## Counter component

Grab the [counter component - https://github.com/brittneypostma/sveltekit-starter/blob/main/src/lib/counter.svelte](https://github.com/brittneypostma/sveltekit-starter/blob/main/src/lib/counter.svelte) and drop it into the `lib` folder. Inside the `counter.svelte` file, we can see one of the default animations that Svelte provides out of the box along with some of the *sugar syntax* Svelte has to handle JavaScript inside of your markup. Now, let's add it to the `+page.svelte` route to see it on the page.

```html
<script>
  import Counter from '$lib/counter.svelte'
</script>

<section>
  <h1>Welcome!</h1>
  <h2>Let's learn Svelte</h2>
  <Counter />
</section>

<style>
  section {
    min-height: calc(100vh - var(--header-height));
    display: grid;
    place-items: center;
    place-content: center;
  }
</style>

```

## Static assets

Add the [static folder](https://github.com/brittneypostma/sveltekit-starter/tree/main/static) to the root of your application. By default, Svelte will path to that static folder, so you don't have to do relative pathing for assets in your app.

## Class Directives and Page Store

Svelte will purge any CSS classes that are unused in your components and provides a `$app/page` store that allows you to tell which route you are on currently. Using this, let's finish out the `header.svelte` file.

```html
<script>
  import { page } from '$app/stores'
</script>

<header>
  <div class="left">
    <img src="svelte-logo.svg" alt="svelte logo" />
  </div>
  <nav>
    <ul>
      <li class:active={$page.path === '/'}>
        <a href="/">Home</a>
      </li>
      <li class:active={$page.path === '/about'}>
        <a href="/about">About</a>
      </li>
      <li class:active={$page.path === '/blog'}>
        <a href="/blog">Blog</a>
      </li>
    </ul>
  </nav>
  <div class="right" />
</header>

<style>
  .left img {
    margin-left: 1rem;
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }
  header {
    height: var(--header-height);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  nav {
    background: var(--color-primary);
    box-shadow: var(--shadow-lg);
    padding: var(--md) var(--xl);
    border-radius: 0 0 var(--xl) var(--xl);
  }
  ul {
    display: flex;
    justify-content: space-between;
    gap: var(--base);
  }
  a {
    text-shadow: var(--shadow-text);
  }
  .active {
    border-bottom: 2px solid var(--color-accent);
  }
</style>

```

## Hydration and Routing

The `browser` store in the video is no longer correct. You can set `router` to `false` to enable this feature now. Also, `hydrate` has changed to a boolean instead of the environment.

SvelteKit includes a client-side router that will take control of user interactions like links and the browser back and forward buttons instead of allowing the browser to handle the navigation by reloading. This can be turned off to allow the browser to take control by setting `export const router = false` in the endpoint.

Hydration in SvelteKit typically hands off the server-rendered HTML to the client to implement any JavaScript needed on the page. If you don't need JavaScript for the page, you can turn off hydration by setting it to `false`

If both `hydrate` and `router` are `false`, there will not be any JavaScript added to your page at all.

Svelte provides a `<svelte:head>` component to include things like the title and social images in the `head` section of the html on the page level. These get injected at compile time. Add a new `+page.js` file inside of the `about` directory.

```jsx
  import { browser, dev } from '$app/env'
  export const hydrate = dev
  export const router = browser
  export const prerender = true
```

## Dynamic Routes

Sometimes, we need a route that will catch more than one url. SvelteKit can do this by using square brackets around the parameter you want to catch, `[params]`. For our blog route, we can create a folder `blog` inside of `routes`. In the `blog` folder, we need an `+page.svelte` file that will match the `/blog` route. Then we need a folder inside `blog` called `[slug]` with square brackets around it, this means it is a *dynamic* route. Then inside create another `+page.svelte` file.

## Load function

If a route needs to fetch data to render for the page or perform any logic around routing, you will need to use the `load` function inside of the `+page.js` file. The `load` function runs before a component is created. It runs during the server-side rendering and again in the client allowing you to get data for a page without showing a loading spinner or needing the `onMount` lifecycle function. We are going to fetch the data from the dev.to api to grab my posts available.

```jsx
  export async function load({ fetch }) {
    const response = await fetch(
      `https://dev.to/api/articles?username=bdesigned`
    )
    const posts = await response.json()
    return { 
			posts
		}
  }
```

### Props

We return the posts as *props* and then need to accept the props into the component in a normal script tag inside `+page.svelte` like this.

```html
<script>
  export let data
	const posts = data.posts
</script>

```

We can then finish off the markup.

```html
<svelte:head>
  <title>Blog</title>
</svelte:head>

<section>
  <h1>Blog</h1>
  <ul>
    {#each posts as post}
      <li>
        <a href={`/blog/${post.id}`}> {post.title}</a>
      </li>
    {/each}
  </ul>
</section>

```

## Slug Route

In the dynamic route we created we need to do a similar load function, but also grab the params from the slug to create the correct route. Create a `+page.js` file inside the `[slug]` route. Then, we can use the `page` store provided in the load function to grab the params.

```jsx
  export async function load({ page, fetch }) {
    const response = await fetch(
      `https://dev.to/api/articles/${page.params.slug}`
    )
    const post = await response.json()
    return {
      post
    }
  }
```

Grab our post prop.

```html
<script>
  export let data
	const post = data.post
</script>
```

And finally use the Svelte template syntax {@html} to parse the html onto the page.

```html
<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<article>
  <h1>{post.title}</h1>
  {@html post.body_html}
</article>

```

That is it! We now have a working svelte blog that pulls in data from the dev.to api. Check out the docs on [adapters](https://kit.svelte.dev/docs#adapters) to find out more on building and hosting your site.