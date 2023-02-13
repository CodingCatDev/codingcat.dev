---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1626309301/main-codingcatdev-photo/pmjyfh1yllkhhyb3emcg.png
devto: https://dev.to/codingcatdev/nextjs-11-features-1e6f
excerpt: Learning about all of the amazing Next.js 11 features.
hashnode: https://hashnode.codingcat.dev/post-nextjs-11-features
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=nextjs-11-features&_id=6204fafa942142ad97736d018ef4d1ab
published: published
slug: nextjs-11-features
start: July 14, 2021
title: Next.js 11 Features
---
> Please take note the above video is not codingcat.dev's. I thought it was important to see the announcement in its full context.
> 

In research for my next (or should I say Next.js) series of courses I wanted to dive back into Next.js 11's new features. The items that really blew me away were best summarized by one of my favorite guest on our podcast Swyx in this [tweet](https://twitter.com/swyx/status/1404845602463043590).

- Collaborative preview edits (Next.js Live)
- "Conformance" perf guidelines
- `<Image>` size detection
- `<Script>` loading strategy
- Automatic Font optimization

## Collaborative preview edits

This is an interesting one to call a Next.js feature, one could argue that it is a Vercel feature but I am really splitting hairs here because the server that you need is in Next.js but the account you most likely will use is Vercel in the near future. You have most likely seen this same type of collaboration if you have worked on [Figma](https://www.figma.com/) or [Miro](https://miro.com/). This tends to stay in the design phase of how we work at OST in the "Design. Architect. Build. Run." experience. It is rarely something that you are seeing collaborated with on a live site that you are running code behind. I think this will bring together the Design, Architect, and Build phases of the project.

## Conformance

> Conformance is a system that provides carefully crafted solutions and rules to support optimal loading and Core Web Vitals, with further additions coming to support other quality aspects like security and accessibility.
> 

Basically this is the thing every developer wants without having to work so hard to achieve it. Next.js 11 will support ESLint directly so it will find any framework-specific issues during development. I am excited about the Core Web Vitals but I can't wait to see what the team has in store for Security and A11y!

Make sure to checkout Google's plans for project [Aurora](https://web.dev/introducing-aurora/) and specifically their blog on [Conformance in Next.js](https://web.dev/conformance/#conformance-in-next.js).

## Image Size Detection

For those of you not using the already built in feature for Image Providers like I talk about on [Media Jams](https://mediajams.dev/post/Using-Cloud-Providers-with-nextimage), this feature is amazing! It will allow you to import your local images and it will automagically determine width and height.

```tsx
import Image from 'next/image'
import cat from '../public/cat.png'

export default function Home() {
  return (
    // When importing the image as the source, you
    // don't need to define `width` and `height`.
    <Image src={cat} alt="Picture of AJ the Cat" />
  )
}

```

Something to also note is the cool placeholders you can add now as well using `placeholder="blur"`. You can read more about Image Imports in [Next.js Docs](https://nextjs.org/docs/basic-features/image-optimization#image-imports)

## Script Loading Strategy

This new Script Optimization is pretty bananas just like Gwen always said!

<iframe src="https://giphy.com/embed/q1VYLPcIVNzH2" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/gwen-stefani-gif-bananas-q1VYLPcIVNzH2">via GIPHY</a></p>

If you are a developer you 100% have run into that analytics package or ad requirement that you must use external scripts. They are typically a performance nightmare and often go unseen until your app is out in the public view. Now you can use the new `next/script` tag and define the appropriate `strategy`. There are three strategies involved and broken down very easily

- `beforeInteractive`: For critical scripts that need to be fetched and executed before the page is interactive, such as bot detection and consent management. These scripts are injected into the initial HTML from the server and run before self-bundled JavaScript is executed.
- `afterInteractive (default)`: For scripts that can fetch and execute after the page is interactive, such as tag managers and analytics. These scripts are injected on the client-side and will run after hydration.
- `lazyOnload` For scripts that can wait to load during idle time, such as chat support and social media widgets.

You can read all about it in the Next.js 11 blog post on [Script Optimization](https://nextjs.org/blog/next-11#script-optimization) or in the [Next.js Docs](https://nextjs.org/docs/basic-features/script).

## Automatic Font Optimization

Okay technically this one was added in [Next.js 10.2](https://nextjs.org/blog/next-10-2#automatic-webfont-optimization) but it was talked about in the conference and I for sure didn't know about it! There are several methods to include web font loading into your system. You can create them at build time and reference, have TailwindCSS do it for you like we do, or add the link manually. It will now look like the below code.

```html
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter"
  rel="stylesheet"
/>

// After
<style data-href="https://fonts.googleapis.com/css2?family=Inter">
  @font-face{font-family:'Inter';font-style:normal.....
</style>

```

The great part about this optimization especially in your static sites during build time Next.js optimizes and inlines font CSS at build time which will eliminate an extra round trip to fetch font declarations. This should also give you a better FCP and LCP. Checkout the [Next.js Docs](https://nextjs.org/docs/basic-features/font-optimization) for more information on Font Optimization.