---
title: 'Debug Angular 9 in Chrome Console'
date: '2020-04-22'
---

[](https://youtu.be/H8GrzgQS-6c)[](https://youtu.be/H8GrzgQS-6c)[https://youtu.be/H8GrzgQS-6c](https://youtu.be/H8GrzgQS-6c)

# Debug Angular 9 in Chrome Console

> These functions are exposed via the global `ng` "namespace" variable automatically when you import from `@angular/core` and run your application in development mode. These functions are not exposed when the application runs in a production mode.

## Chrome Console Utilities

The great part about using the Chrome console is that it gives you access any DOM element that you have selected. For the last item you can get the reference by typing `$0` in the console. Below you will see that you can use the selection tool to easily find the element. Once this is selected you can then use `$0` as it will be the latest in your selection history. You can read further about this in [Console Utilities API Reference](https://developers.google.com/web/tools/chrome-devtools/console/utilities).

![Chrome Selection](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/debugAngular9/chromeSelection.png)

## Getting the Angular Component reference

Now that we know how to get a DOM reference we can use the Angular [code>@angular/core/global</code](mailto:code>@angular/core/global</code) utilities, you can find more details here: [](https://angular.io/api/core/global#entry-point-exports)[](https://angular.io/api/core/global#entry-point-exports)[https://angular.io/api/core/global#entry-point-exports](https://angular.io/api/core/global#entry-point-exports).Using `ng.getContext($0)` we can access the angular component instance.

```
// Get this component
let dialogComponent = ng.getContext($0)

// Get parent component
let dialogParentComponent = ng.getOwningComponent($0)
```

## Changing values in the Component

Now that you have a reference to the component using `let dialogComponent = ng.getContext($0)` we can now update the properties within the component. For this example we will change the qty in our recipeIngredient object.

```
dialogComponent.data.recipeIngredient.qty = 5
```

You should also note that you can display the entire component as well incase you are unaware of the structure.

![](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/debugAngular9/Screen_Shot_2020-04-22_at_2.55.22_PM.png)

## Making Component Update

In order to get the value change to show within the component you must trigger change detection.

```
// Apply change detection
ng.applyChanges(dialogComponent)
```
