---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1616547249/main-codingcatdev-photo/bht5m2y90wvuo9a3ziop.png
devto: https://dev.to/codingcatdev/scully-angular-static-site-generator-5ech
excerpt: In the Static Site Generator (SSG) space, ReactJs has Gatsby and VueJs has Vuepress/Gridsome. This left for a space to be filled for Angular, introducing Scully the Angular solution for SSG.
hashnode: https://hashnode.codingcat.dev/post-scully-io-angular-static-site-generator
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=scully-io-angular-static-site-generator&_id=bd88bd4ff1354399b2bc38f570218144
published: published
slug: scully-io-angular-static-site-generator
start: December 17, 2019
title: Scully - Angular Static Site Generator
---
## JAMStack with SSG

2019 has been another amazing year building up JAMStack (Javascript APIs and Markup) sites. AJonP joined this trend by moving over to Gatsby a React based Static Site generator. Growing up as an Angular developer I missed the fact that Angular didn't have an option that existed. For AJonP it came down to Hugo and Gatsby (writing and then rewriting).

## Scully

> The best way to build the fastest Angular apps. Scully is a static site generator for Angular projects looking to embrace the JAMStack.
> 

Just like the other frameworks what Scully offers is the ability to pre-render pages and then create HTML and CSS that loads highly performant pages for your browser to utilize without the SPA effect and whitescreen where you get loading times in the mix.

Make sure to checkout the [Scully Docs](https://github.com/scullyio/scully/tree/master/docs).

> Scully pre-renders each page in your app to plain HTML & CSS. To do this, Scully uses machine learning techniques to find all of the routes in your project. Scully then visits each route, rendering the view and saving it to an HTML file. You can then ship all of those HTML files to production. Each view in your app can now be delivered to your users in just a few KBs, as opposed to the hundreds/thousands of KBs require to download your entire Angular app. Your app appears INSTANTLY on any device (including mobile 3G).
> 
> - Scully Docs

### Alpha Release Video

Make sure to checkout Aaron Frost and the [HeroDevs](https://herodevs.com/) team [Introducing Scully: Angular + JAMStack](https://youtu.be/Sh37rIUL-d4).

## Try Scully

Of course you just need an Angular project. For an example I cloned the example from our [Angular Material Course](https://codingcat.dev/course/angularmaterial).

```bash
git clone https://github.com/AJONPLLC/lesson13-angular-material-reactive-forms
```

### Initialize

Then opening the terminal at the root of this project I ran the commands to initialize scully

This produced 6 file changes in my examplepackage.json and package-lock.json

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/d7e33222-93e8-4025-bfac-5f7be5466bbb.jpg](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/d7e33222-93e8-4025-bfac-5f7be5466bbb.jpg)

scullyconfig.js

![https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/ae75068c-bf6d-46a0-a5e1-69d784179683.jpg](https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/ae75068c-bf6d-46a0-a5e1-69d784179683.jpg)

polyfills.ts

![https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/bca5d459-c732-414e-912c-f6ce96bfaee6.jpg](https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/bca5d459-c732-414e-912c-f6ce96bfaee6.jpg)

app.component.ts

![https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/3c249d88-aae4-462f-8145-a58deccd0ccf.jpg](https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/3c249d88-aae4-462f-8145-a58deccd0ccf.jpg)

app.module.ts

![https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/3d8c44db-7e0c-4f51-acf3-d5da6b8e428b.jpg](https://media.codingcat.dev/image/upload/v1657636760/main-codingcatdev-photo/3d8c44db-7e0c-4f51-acf3-d5da6b8e428b.jpg)

### Build

Next you will create an Angular build just like normal, followed by `npm run scully` .

> 
> 
> 
> If you get an error I did have to place `"fs-extra": "^8.1.0",` as a dev dependency [https://github.com/scullyio/scully/issues/28](https://github.com/scullyio/scully/issues/28)
> 

You will see your normal build file in `dist` folder and a new `static` folder that contains your SSG files. You can then run the site by switching to the static directory and using a local server like [http-server](https://www.npmjs.com/package/http-server) to run the compliled code.

## What to Try Next

### Scully Generators

Add scully to your project and utilize [@schematics/angular](https://angular.io/cli/generate). This command will add the necessary packages that allow you to use the Angular CLI for scaffolding out

### Blogs

The below command allows you to create a blog and make posts. Try this out in a new Angular app to start up your blog from scratch.

```bash
ng g @scullyio/init:blog
ng g @scullyio/init:post

```

## Final Thoughts

I know that Aaron Frost, Sander Elias, Jorge Cano, and Andres Villanueva are Angular Wizards so the project is in good hands. It is just the beginning, but if you are looking for an amazing Angular project to be part of make sure you star this one!