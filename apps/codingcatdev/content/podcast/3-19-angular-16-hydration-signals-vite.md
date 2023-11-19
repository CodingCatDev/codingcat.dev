---
type: podcast
authors:
  - alex-patterson
  - brittney-postma
episode: 19
recording_date: June 22, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1683208745/main-codingcatdev-photo/Angular-16-Hydration-Signals-Vite.jpg
devto:
excerpt: 'Angular 16 is a major release of the Angular framework that introduces several new features.'
guests:
  - patricio-vargas
hashnode:
picks:
  [
    {
      author: 'patricio-vargas',
      name: 'Tulum in the City',
      site: 'https://partiful.com/e/JEySXFEz0nRYSIyJZPqZ'
    },
    {
      author: 'brittney-postma',
      name: 'Config Keynotes',
      site: 'https://www.youtube.com/watch?time_continue=2&v=JUTFghsG8nI&embeds_referring_euri=https%3A%2F%2Fwww.bing.com%2F&embeds_referring_origin=https%3A%2F%2Fwww.bing.com&source_ve_path=MjM4NTE&feature=emb_title'
    },
    { author: 'brittney-postma', name: 'Svelte 4', site: 'https://svelte.dev/blog/svelte-4' },
    { author: 'alex-patterson', name: 'Ticker', site: 'https://www.tiicker.com/' }
  ]
slug: 3-19-angular-16-hydration-signals-vite
sponsors:
  - storyblok
spotify: 'https://open.spotify.com/episode/3g1xbgaUBXWJStpdMDPNhG?si=agEy5pP7R0KJ5TGdVXDKWw'
start: July 5, 2023
title: 'Angular 16 Hydration, Signals, Vite'
youtube: https://youtu.be/UCsJKrt0GhE?si=QbMIiRlP9zAmWSHA
---

[Angular 16](https://blog.angular.io/angular-v16-is-here-4d7a28ec680d) is a major release of the Angular framework that introduces several new features, including:

- **Non-destructive SSR hydration:** This new hydration strategy avoids flickering and layout shifts by selectively updating the DOM instead of destroying and recreating it.
- **Signals:** Signals are a new reactivity mechanism that provides a more performant and declarative way to manage data in Angular applications.
- **Vite support:** Angular 16 now supports Vite, a new build tool that can significantly improve the performance of Angular applications.

We will take a look at these new features and how they can be used to improve Angular applications.

## Non-destructive SSR Hydration

One of the biggest challenges with server-side rendering (SSR) is that it can cause flickering and layout shifts when the DOM is hydrated on the client. This is because SSR typically involves rendering the entire application to a string of HTML, which is then sent to the client and parsed into DOM nodes. This process can be slow and can cause the DOM to be in an inconsistent state for a period of time.

Angular 16 introduces a new hydration strategy that avoids these problems by selectively updating the DOM. This strategy uses a technique called "patching" to identify the parts of the DOM that have changed since the server rendered the HTML. Angular then updates only those parts of the DOM, which avoids the need to destroy and recreate the entire DOM tree.

This new hydration strategy has several benefits, including:

- **Improved performance:** Patching is a much faster way to update the DOM than destroying and recreating it.
- **Smoother user experience:** There is no flickering or layout shifts when the DOM is hydrated on the client.
- **Reduced memory usage:** Patching only updates the parts of the DOM that have changed, which reduces the amount of memory that is used.

## Signals

[Signals](https://github.com/angular/angular/discussions/49683) are a new reactivity mechanism that provides a more performant and declarative way to manage data in Angular applications. Signals are similar to RxJS observables, but they are more lightweight and easier to use.

Signals are created using the `signal()` function. Signals can be either writable or read-only. Writable signals can be updated using the `set()` or `update()` methods. Read-only signals can only be read using the `get()` method.

Signals can be used to manage any type of data, including primitives, objects, and arrays. Signals are also composable, which means that they can be used to create more complex data structures.

## Vite Support

Angular 16 now supports [Vite](https://vitejs.dev/), a new build tool that can significantly improve the performance of Angular applications. Vite is a next-generation bundler that uses a pre-bundling strategy to significantly reduce the amount of time it takes to build Angular applications.

Vite also has several other features that can improve the performance of Angular applications, including:

- **Hot Module Replacement (HMR):** Vite supports HMR, which allows you to see changes to your application code reflected in the browser without having to reload the page.
- **Pre-fetching:** Vite can pre-fetch dependencies, which can improve the performance of your application by reducing the time it takes to load dependencies.
- **Compression:** Vite can compress your application's code, which can further improve performance.

## Conclusion

Angular 16 is a major release that introduces several new features that can improve the performance, user experience, and developer experience of Angular applications. The new hydration strategy, signals, and Vite support are all valuable features that can help you create better Angular applications.

## Additional Resources

- [Angular 16 Documentation](https://angular.io/docs/ts/latest/)
- [Vite Documentation](https://vitejs.dev/)
- [Angular Signals](https://angular.io/guide/signals)
