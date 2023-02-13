---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1600704486/ccd-cloudinary/debug_angular_9.png
devto: https://dev.to/codingcatdev/debug-angular-9-in-chrome-console-5c4b
hashnode: https://hashnode.codingcat.dev/post-debug-angular-9-in-chrome-console
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=debug-angular-9-in-chrome-console&_id=8a52979b1f214315b1c8379c490eaa45
published: published
slug: debug-angular-9-in-chrome-console
start: April 20, 2020
title: Debug Angular 9 in Chrome Console
---

> These functions are exposed via the global `ng` "namespace" variable automatically when you import from `@angular/core` and run your application in development mode. These functions are not exposed when the application runs in a production mode.
> 

## Chrome Console Utilities

The great part about using the Chrome console is that it gives you access any DOM element that you have selected. For the last item you can get the reference by typing `$0` in the console. Below you will see that you can use the selection tool to easily find the element. Once this is selected you can then use `$0` as it will be the latest in your selection history. You can read further about this in [Console Utilities API Reference](https://developers.google.com/web/tools/chrome-devtools/console/utilities).

![https://media.codingcat.dev/image/upload/v1657636833/main-codingcatdev-photo/4364bc2c-d750-4827-8fa1-0fb96af36555.png](https://media.codingcat.dev/image/upload/v1657636833/main-codingcatdev-photo/4364bc2c-d750-4827-8fa1-0fb96af36555.png)

## Getting the Angular Component reference

Now that we know how to get a DOM reference we can use the Angular [code>@angular/core/global</code](mailto:code%3E@angular/core/global%3C/code) utilities, you can find more details here: [https://angular.io/api/core/global#entry-point-exports](https://angular.io/api/core/global#entry-point-exports).Using `ng.getContext($0)` we can access the angular component instance.

```jsx
// Get this component
let dialogComponent = ng.getContext($0)

// Get parent component
let dialogParentComponent = ng.getOwningComponent($0)
```

## Changing values in the Component

Now that you have a reference to the component using `let dialogComponent = ng.getContext($0)` we can now update the properties within the component. For this example we will change the qty in our recipeIngredient object.

```jsx
dialogComponent.data.recipeIngredient.qty = 5
```

You should also note that you can display the entire component as well incase you are unaware of the structure.

![https://media.codingcat.dev/image/upload/v1657636833/main-codingcatdev-photo/0620068a-7f3b-4289-ac1d-4f492743e6e5.png](https://media.codingcat.dev/image/upload/v1657636833/main-codingcatdev-photo/0620068a-7f3b-4289-ac1d-4f492743e6e5.png)

## Making Component Update

In order to get the value change to show within the component you must trigger change detection.

```jsx
// Apply change detection
ng.applyChanges(dialogComponent)
```