---
type: podcast
authors:
  - alex-patterson
episode: 1
recording_date: 'September 10, 2023 6:00 PM'
season: 1
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1700091644/main-codingcatdev-photo/1.1.png
devto: null
excerpt: >-
  Join Jordan and Alex as they try to get Angular 17 SSG working and talk about
  SSR.
guests:
  - jordan-powell
hashnode: podcast-cwcc-1-1-angular-17
picks: null
slug: cwcc-1-1-angular-17
sponsors:
  - storyblok
spotify: null
start: 'Nov 11, 2023'
title: 'Angular 17, does SSR/SSG really work?'
youtube: 'https://youtube.com/live/Yy0XJP9ReJk?feature=share'
---

<script lang="ts">
	import YouTube from '$lib/components/content/YouTube.svelte'
	import Shorts from '$lib/components/content/Shorts.svelte'
</script>

<Shorts />

Before I even get started Angular 17, I have to say the new design on [Angular.dev](https://angular.dev) looks incredible. It is full on conference season so I hope that they printed some kick ass [custom-stickers](https://www.stickermule.com/custom-stickers) from [Sticker Mule](https://www.stickermule.com/) and are bringing them out to Vegas!

# My Experience Getting Started with Angular SSR and SSG

I've been using Angular for many years but took a break for a while to focus on other frameworks like React and Svelte. I decided to get back into Angular recently since they released Angular 17 with some big improvements for SSR and SSG. I wanted to document my experience getting set up with Angular SSR and SSG from scratch as someone relearning Angular.

## Creating a New Angular App

I started off by scaffolding a new Angular app using the Angular CLI:

```sh
ng new testing-17
```

The CLI now asks if you want to enable SSR and SSG which is awesome! I chose yes to scaffold it with SSR and SSG enabled out of the box.

The CLI generated the basic app files including an `app.component.ts`. One small change I made was to switch it to use inline templates instead of external template URLs, similar to how it's done in React and Svelte:

```ts
template: `<h1>Welcome to {{title}}!</h1>`;
```

This allows defining the template right in the component file rather than splitting it out into separate files.

## Adding Routes and Components

Next, I wanted to create some routes and components to try rendering. I used the CLI to generate a component:

```
ng generate component about
```

Then I added it to the routes definition:

```
const routes: Routes = [{ path: 'about', component: AboutComponent }];
```

I did the same to generate a `JordanComponent` and route.

To link between the two pages, I added anchor tags to each component:

```
<a href="/about">About Page</a><a href="/jordan">Jordan Page</a>
```

This allowed navigating between the client-rendered pages.

## Trying to Get SSR/SSG Working

This is where things started to get tricky! I expected adding routes and components was all I needed to get pages to render via SSR/SSG but I was quite wrong.

I tried various ways to build and serve the app but couldn't get the routes to actually render ahead of time. Just using `ng serve` served it in a normal dev mode.

After a lot of googling I figured out I needed to specifically call `ng serve --configuration=production` to serve a production build with SSR enabled. That got the About and Jordan pages to actually render!

However, it required a full page refresh each time which wasn't ideal. I wanted to get route-based SSG working.

## Configuring Prerendering Routes

After a lot more searching, I finally figured out that the routes needed to be defined in a `routes.txt` file for prerendering to work properly.

I created a `routes.txt` file with the routes:

```ts
/about/adjnor;
```

And updated `angular.json` to point to it:

```ts
"prerender": {"routes": "src/routes.txt"}
```

Once I rebuilt, the routes now rendered via SSG! Navigating between them was seamless without full page refreshes.

## Passing Route Parameters

I wanted to try passing some route parameters next. I updated the routes config to have a wildcard parameter:

```ts
/product/:id
```

And created a `ProductComponent` that reads the parameter:

```ts
const id = this.route.snapshot.paramMap.get('id');
```

This allowed visiting URLs like `/product/1` and `/product/2` successfully!

## Final Thoughts

Getting started with Angular SSR and SSG was definitely more involved compared to other frameworks I've used like Next.js. There's a lot of configuration required to get it all wired up properly.

However, once set up it works quite nicely! I'm sure building robust applications will introduce more complexity but the foundations seem solid. The Angular team has clearly put significant effort into improving the SSR and SSG story.

Overall I'm impressed with the progress on Angular 17. The CLI integration, inline templates, and SSR/SSG support are great modern additions. Angular feels fresh again while still maintaining its strong enterprise foundation. I'm looking forward to building more with it!

Let me know if you have any other questions on getting started with Angular SSR and SSG!

## Shorts
