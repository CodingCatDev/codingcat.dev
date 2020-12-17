---
title: 'Scully.io - Anguler Static Site Generator'
date: '2019-12-17'
---

## JAMStack with SSG[](https://codingcat.dev/blog/scully-io#scullyio---angular-static-site-generator)

2019 has been another amazing year building up JAMStack (Javascript APIs and Markup) sites. AJonP joined this trend by moving over to Gatsby a React based Static Site generator. Growing up as an Angular developer I missed the fact that Angular didn't have an option that existed. For AJonP it came down to Hugo and Gatsby (writing and then rewriting).

## Scully[](https://codingcat.dev/blog/scully-io#scully)

> The best way to build the fastest Angular apps. Scully is a static site generator for Angular projects looking to embrace the JAMStack.

Just like the other frameworks what Scully offers is the ability to pre-render pages and then create HTML and CSS that loads highly performant pages for your browser to utilize without the SPA effect and whitescreen where you get loading times in the mix.

Make sure to checkout the [Scully Docs](https://github.com/scullyio/scully/tree/master/docs).

> Scully pre-renders each page in your app to plain HTML & CSS. To do this, Scully uses machine learning techniques to find all of the routes in your project. Scully then visits each route, rendering the view and saving it to an HTML file.  
> You can then ship all of those HTML files to production. Each view in your app can now be delivered to your users in just a few KBs, as opposed to the hundreds/thousands of KBs require to download your entire Angular app.  
> Your app appears INSTANTLY on any device (including mobile 3G).
>
> \-Scully Docs

### Alpha Release Video[](https://codingcat.dev/blog/scully-io#alpha-release-video)

Make sure to checkout Aaron Frost and the [HeroDevs](https://herodevs.com/) team [Introducing Scully: Angular + JAMStack](https://youtu.be/Sh37rIUL-d4).

## Try Scully[](https://codingcat.dev/blog/scully-io#try-scully)

Of course you just need an Angular project. For an example I cloned the example from our [Angular Material Course](https://ajonp.com/courses/angularmaterial/angular-material-reactive-forms-update-firestore).

```
git clone https://github.com/AJONPLLC/lesson13-angular-material-reactive-forms
```

### Initialize[](https://codingcat.dev/blog/scully-io#initialize)

Then opening the terminal at the root of this project I ran the commands to initialize scully

```
ng add @scullyio/init
```

This produced 6 file changes in my examplepackage.json and package-lock.json

![package.json](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/scully.io-intro/Screen_Shot_2019-12-17_at_2.49.23_PM.png)

scullyconfig.js

![scullyconfig.js](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/scully.io-intro/Screen_Shot_2019-12-17_at_2.49.35_PM.png)

polyfills.ts

![](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/scully.io-intro/Screen_Shot_2019-12-17_at_2.49.47_PM.png)

app.component.ts

![app.component.ts](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/scully.io-intro/Screen_Shot_2019-12-17_at_2.50.02_PM.png)

app.module.ts

![app.module.ts](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/scully.io-intro/Screen_Shot_2019-12-17_at_2.50.16_PM.png)

### Build[](https://codingcat.dev/blog/scully-io#build)

Next you will create an Angular build just like normal, followed by `npm run scully` .

```
ng build && npm run scully
```

> If you get an error I did have to place `"fs-extra": "^8.1.0",` as a dev dependency  
> [https://github.com/scullyio/scully/issues/28](https://github.com/scullyio/scully/issues/28)

You will see your normal build file in `dist` folder and a new `static` folder that contains your SSG files. You can then run the site by switching to the static directory and using a local server like [http-server](https://www.npmjs.com/package/http-server) to run the compliled code.

## What to Try Next[](https://codingcat.dev/blog/scully-io#what-to-try-next)

### Scully Generators[](https://codingcat.dev/blog/scully-io#scully-generators)

Add scully to your project and utilize [@schematics/angular](https://angular.io/cli/generate). This command will add the necessary packages that allow you to use the Angular CLI for scaffolding out

```
ng add @scullyio/init
```

### Blogs[](https://codingcat.dev/blog/scully-io#blogs)

The below command allows you to create a blog and make posts. Try this out in a new Angular app to start up your blog from scratch.

```
ng g @scullyio/init:blog
ng g @scullyio/init:post
```

[https://github.com/scullyio/scully/blob/master/docs/blog.md](https://github.com/scullyio/scully/blob/master/docs/blog.md)

## Final Thoughts[](https://codingcat.dev/blog/scully-io#final-thoughts)

I know that Aaron Frost, Sander Elias, Jorge Cano, and Andres Villanueva are Angular Wizards so the project is in good hands. It is just the beginning, but if you are looking for an amazing Angular project to be part of make sure you star this one!
