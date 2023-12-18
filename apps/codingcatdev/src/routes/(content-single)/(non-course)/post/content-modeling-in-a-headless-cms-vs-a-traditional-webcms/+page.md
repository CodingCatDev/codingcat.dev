---
type: post
authors:
  - alex-patterson
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1684343153/main-codingcatdev-photo/content-modeling-in-a-headless-cms-vs-a-traditional-webcms.png
devto: >-
  https://dev.to/codingcatdev/content-modeling-in-a-headless-cms-vs-traditional-web-cms-42jm-temp-slug-4276315
excerpt: Learn how to model content for Headless CMS
hashnode: null
published: published
slug: content-modeling-in-a-headless-cms-vs-a-traditional-webcms
start: 'May 17, 2023'
title: Content Modeling in a Headless CMS vs. Traditional Web CMS
youtube: null
---

<script lang="ts">
import Traditional from './Traditional.svelte';
import Headless from './Headless.svelte';
</script>

Before we get into the details of how page modeling differs between a Headless CMS and a Traditional CMS we must first understand what each of those architectures entail.

Like many of you, my first experience with a content management system (CMS) was with WordPress many years ago. [WordPress](https://wordpress.org/) was a great solution for presenting data on a single platform for the web. It was easy to use and customize, and it had a wide range of features that made it ideal for a variety of purposes.

[WordPress](https://wordpress.org/) is still used in several applications today, but the landscape has changed as we have moved to a multi-device world-spanning web. Now we must also have solutions for web, mobile, tablets, smartwatches, digital assistants, IoT, voice, VR/AR, the list continues. Along with this demand for multiple devices, users expect a more personalized digital experience across all of these devices. In today's world, efficiency requires flexibility. A headless CMS can help you achieve this.

## Traditional CMS Architecture

In a traditional CMS, the front and back ends are like two cats in a trench coat trying to pass as one human. They're both working towards the same goal, but they're constantly tripping over each other and getting in each other's way. The marketers and content editors are in the front end, trying to create a beautiful and engaging website for the users. The developers are in the back end, trying to keep the website running smoothly and securely. But because they're all sharing the same space, it's a constant battle of who can get their work done first. It's a mess, but somehow it worked in the past.

<aside class="flex flex-col items-start gap-2 alert variant-ghost">
  <div class="text-2xl">Traditional CMS Architecture</div>
  <ul>
    <li>A database for storing data and content
    <li>A backend where content is managed and updated, typically via a WYSIWYG form
    <li>An application to build design templates and schemas
  </ul>
</aside>

The **Content Management Application** (CMA) is like a cat's brain. It's where all the thinking and decision-making happens. It includes the back-end to administer the site and manage content.

The **Content Delivery Application** (CDA) is like a cat's body. It's what allows the CMA to interact with the world. This is where a frontend developer will spend most of their time making sure that the content is correctly formatted and looking good for presentation.

A **Traditional CMS** is like a Siamese cat. It's two cats in one, and they're always getting into trouble. The CMA and CDA are built together, so all programming, content and formatting are in a single system.

In the below illustration you can see how the different parts come together within a single server.

<Traditional />

## Headless CMS Architecture

A headless CMS is a content management system that does not have a built-in front end. Instead, it provides a back end for storing and managing content, and an API for delivering that content to any front end that you choose. This gives you the flexibility to create websites and apps that look and feel the way you want, without being limited by the capabilities of the CMS's front end.

As a frontend developer you know the landscape moves very fast and with meta-frameworks like [Astro](https://astro.build/), [Next.js](https://nextjs.org/), [Nuxt](https://nuxtjs.org/), and [SvelteKit](https://kit.svelte.dev/) adding features at a lightning pace, it is hard to keep a Traditional CMS updated with these changes.

<aside class="flex flex-col items-start gap-2 alert variant-ghost">
  <div class="text-2xl">Headless CMS Architecture</div>
  <ul>
    <li>A content management backend (often including text and media)
    <li>API/Web services support
    <li>Microservice Architecture
  </ul>
</aside>

A headless CMS is like a cat with two heads. One head is the back end, where all the content is stored and managed. The other head is the front end, where the content is displayed. This allows the content to be separated from the programming and formatting, which makes it easier to manage and update.

A headless API-first CMS is like a cat that can walk on water. It can deliver content to any device via APIs, which means that you can create websites, apps, and even smartwatch apps all from the same content. This is a great way to reach a wider audience and make your content more accessible.

A headless CMS frees developers to use any framework they want. This is because the CMS does not have a built-in front end, so developers can create their own front end that looks and feels the way they want. This gives developers more flexibility and control over their projects.

In the below illustration you can see three important differences from the Traditional CMS, the frontend template is removed, you no longer need to host your own server, and all devices are able to communicate via APIs to the CMS.

<Headless />

## Content Modeling

There are common requirements when you look at content modeling for pages in your web application between a traditional and headless CMS. You must first breakdown the end user experience of each page into different content types and properties. Amplience has an amazing guide on <a target="_blank" rel="noopener noreferrer" href="https://amplience.com/developers/docs/concepts/content-modeling/">the process of content modeling.</a>

This guide consists of the 4 steps below:

1. Requirements and Wireframes
1. Break it down into modules
1. Design content types
1. Evaluate and iterate

### Content Modeling in a Traditional CMS

1. **Identify the different types of content that will be on the page.** This could include text, images, videos, and other multimedia.

1. **Create a content model for each type of content.** The content model should define the properties of the content, such as the title, description, and format.

1. **Create a page template that will be used to display the content.** The page template should define the layout of the page, such as the header, footer, and sidebar.

1. **Assign the content models to the page template.** This will tell the CMS how to display the content on the page.

One of the biggest differences is the page template step. In a headless CMS you need to model the data and properties and not think about the page.

### Content Modeling in a Headless CMS

There are a few different approaches to content modeling in a headless CMS. One approach is to create a single page model that represents all of the pages in your website or app. This approach is simple and easy to implement, but it can be limiting if you need to create a large number of pages or if you need to create pages with different layouts.

Another approach is to create a separate page model for each page in your website or app. This approach gives you more flexibility, but it can be more complex to implement.

The best approach for content modeling in a headless CMS will depend on the specific needs of your website or app. However, it is important to choose an approach that will make it easy to create and manage your content.

One thing that I CANNOT stress enough is that you are modeling content and data not just for the developers on the other side of the API, but also for authors creating that content. So you need to make sure that both sides can easily understand that data that they are dealing with correctly and how it will impact all of the different devices that the data con be created on.

**Content Types** are an important part of this! Below you can see an example of a Blog object, it not only specifies all the correct properties, but the validation that is required for instance in `maxLength`.

```json
{
	"type": "object",
	"properties": {
		"title": { "type": "string", "maxLength": 50 },
		"author": { "type": "string" },
		"description": { "type": "string" }
	},
	"required": ["title", "author", "description"]
}
```

When you start to think about this type of modeling start to think of these as blocks building up a page for a website, and also think of it as a single small frame on a watch. This should help you start with the content that is needed and allow another frontend developer to create whatever style of application they want with the same schema.

## Popular Headless CMS Platforms

<section class="flex flex-col gap-2 md:gap-8">
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://amplience.com"
      class="text-3xl"
    >
      Amplience
    </a>
    <p>
    Amplience is a leading commerce experience platform that helps businesses create, launch, and iterate digital experiences faster. It offers a <a href="https://amplience.com/headless-cms/" target="_blank" rel="noopener noreferrer">Headless CMS</a> and <a href="https://amplience.com/product/content-hub/" target="_blank" rel="noopener noreferrer">DAM</a> that is designed to support better collaboration between business and technical teams. Amplience is designed to scale and deliver experiences thanks to a multi-CDN architecture and out-of-the-box media optimization capabilities.
    </p>
    <p>
    Amplience provides a very strong set of <a href="https://amplience.com/developers/docs/apis/" target="_blank" rel="noopener noreferrer">API's</a>, that make delivering Media a breeze!
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.contentful.com"
      class="text-3xl"
    >
      Contentful
    </a>
    <p>
      Contentful is API-first, which means that it can be integrated with other systems and applications. It is also designed to be scalable, so it can be used by businesses of all sizes. Contentful is a popular choice for businesses that want to create and deliver content quickly and easily. It is also a good choice for businesses that need to integrate content with other systems and applications.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.contentstack.com/"
      class="text-3xl"
    >
      ContentStack
    </a>
    <p>
      Contentstack is a composable digital experience platform (DXP) that empowers marketers and developers to deliver digital experiences at the speed of their imagination. It is a cloud-based, API-first platform that offers a wide range of features and capabilities, including content management, delivery, and personalization.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://hygraph.com/"
      class="text-3xl"
    >
      hygraph
    </a>
    <p>
      Hygraph is a federated content platform that allows you to build digital experiences the way you envisioned them. Hygraph gives you instant <a href="https://hygraph.com/graphql-headless-cms" target="_blank" rel="noopener noreferrer">GraphQL Content APIs</a> to create, enrich, unify, and deliver your content across platforms. It is a GraphQL-based federated content management system for digital creators and digital products. 
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://kontent.ai/"
      class="text-3xl"
    >
      Kontent.ai
    </a>
    <p>
      Its authoring experience supports content production, modular content reuse, and real-time collaboration and approvals to drive content that's consistent, optimized, and engaging.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.sanity.io"
      class="text-3xl"
    >
      Sanity
    </a>
    <p>
    Sanity offers it's GROQ language to make queries simple, yet very powerful. 
    You can see hear more on two of our podcast episode's <a href="/podcast/0-4-sanity-io">Sanity.io</a> and <a href="/podcast/1-42-using-content-as-data-with-sanity-io">Using Content as Data with Sanity.io</a>.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.storyblok.com"
      class="text-3xl"
    >
      Storyblok
    </a>
    <p>
     Storyblok is a cloud-native, enterprise-grade content management system that is built to scale. Storyblok also has a visual editing experience that makes it easy for anyone to create content, regardless of their technical expertise. Huge thanks goes to Storyblok for being such an amazing <a href="/sponsor/storyblok">sponsor</a>!
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 card variant-soft">
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://strapi.io"
      class="text-3xl"
    >
      Strapi
    </a>
    <p>
    Strapi is 100% JavaScript and fully customizable. It is a developer-first CMS that allows you to create and manage content in a flexible and efficient way. Strapi is also self-hosted, so you can choose where to host your project and how to scale it as your needs grow. 
    </p>
  </div>
</section>
