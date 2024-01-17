---
type: podcast
authors:
  - alex-patterson
episode: 23
recording_date: 'Nov 13, 2023 4:00 PM'
season: 3
published: published
podcast: CodingCat.dev
chapters_done: false
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1699492773/main-codingcatdev-photo/3.24-angular-dev.png
devto: 'https://dev.to/codingcatdev/angulardev-4aa2'
excerpt: Angular.dev is the future home for Angular developers.
guests:
  - emma-twersky
hashnode: podcast-3-23-angular-17
picks:
  - author: emma-twersky
    name: Community College
    site: 'https://www.ccsf.edu/'
  - author: alex-patterson
    name: DJI Osmo Mobile 6 Gimbal
    site: >-
      https://www.amazon.com/dp/B0B7XD7R43?ref=ppx_yo2ov_dt_b_product_details&th=1
slug: 3-23-angular-17
sponsors:
  - storyblok
spotify: 'https://open.spotify.com/episode/7rsBtjwYOojkFGJQgunyQ7'
start: 'Nov 29, 2023'
title: Angular.dev
youtube: 'https://youtu.be/QHZRLrRRnhw'
---

Angular v17 is here, and it's the purrfect update for all you cat-loving developers. This new version of the popular JavaScript framework is packed with features that will make your development purr like a kitten. With us today is [Emma Twersky](/guest/emma-twersky) a Senior Developer Relations Engineer, to talk all about the new updates.

## Deferrable Views

One of the biggest new features in Angular v17 is deferrable views. This means that you can now tell Angular to wait to render a view until it's actually needed. This can be a huge performance improvement, especially for views that are rarely seen.

![Component tree where we defer the loading of the left subtree](https://media.codingcat.dev/image/upload/v1699493510/main-codingcatdev-photo/0_HFC_1HTlO0pN-_KN.png)

For example, if you have a view that only shows up when the user clicks a button, you can defer it until the button is clicked. This will save Angular from having to render the view unnecessarily, which can improve the performance of your application.

**Built-in Control Flow Loops**

Another great new feature in Angular v17 is built-in control flow loops. This means that you can now use `for` and `while` loops in your Angular templates. This can make your templates more concise and easier to read.

For example, the following code snippet shows how to use a `for` loop to iterate over an array of cats:

```ts
<ng-container *ngFor="let cat of cats">
  <div>{{cat.name}}</div>
</ng-container>
```

This code will loop over the `cats` array and print out the name of each cat.

## Up to 90% Faster Runtime

Angular v17 is also up to 90% faster than previous versions. This means that your applications will run faster than ever before.

The performance improvements in Angular v17 are due to a number of factors, including the new deferrable views feature and the built-in control flow loops.

## Up to 87% Faster Builds

In addition to being faster at runtime, Angular v17 is also up to 87% faster to build. This means that you can get your applications up and running faster than ever before.

![Comparison of the new esbuild + vite build pipeline versus the webpack-based legacy pipeline](https://media.codingcat.dev/image/upload/v1699493700/main-codingcatdev-photo/0_QgWDUlZy3ELEJmOS.png)

The build performance improvements in Angular v17 are due to a number of factors, including the new Ivy compiler and the improved TypeScript support.

## New MDC-based Angular Material Components

Angular v17 also includes new [MDC-based Angular Material components](https://github.com/material-components/material-components-web). These components are based on the Material Design Components (MDC) library, which is a collection of high-quality components that are designed to be beautiful, accessible, and performant.

The new MDC-based Angular Material components are a major improvement over the legacy components. They are more consistent with the Material Design specification, and they are also more performant. You can find the migration guide [here](https://material.angular.io/guide/mdc-migration).

## Deprecated Legacy Components

The legacy Angular Material components have been deprecated in Angular v17. This means that they will be removed in a future version of Angular.

If you are still using the legacy Angular Material components, you should update your applications to use the new MDC-based components as soon as possible.

## Conclusion

Angular v17 is a major release that brings a number of significant improvements to the framework. If you are a developer who uses Angular, you should definitely upgrade to v17 as soon as possible.

**P.S.** Don't forget to check out the new Angular website at [angular.dev](https://angular.dev)!
