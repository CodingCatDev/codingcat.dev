---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1609704595/main-codingcatdev-photo/courses/Angular%20Material/s0eh5vg6bud8mwzvkjfr.png
excerpt: This is about the Angular Router and how to use it with Angular Material
published: published
slug: angular-material-router-awareness
start: June 1, 2022
title: Angular Material Router Awareness
weight: 8
youtube: https://youtu.be/3roNVbp3RPg
---
## Setup

We can start from the previous lesson and build out our material router. Previous Lesson: [Angular Material Reactive Forms Update Firestore](https://ajonp.com/courses/angularmaterial/angular-material-reactive-forms-update-firestore)

```bash
git clone <https://github.com/AJONPLLC/lesson13-angular-material-reactive-forms.git>
```

This will give us a solid base to start working from, however if you are creating a new firebase project you should change the environment/environment.ts file to match your firebase details. If you have never done this please see [Angular Navigation Firestore](https://ajonp.com/courses/angularmaterial/angular-material-dynamic-navigation-using-firestore) as this will provide more details on how to update.Make sure you update your npm packages

```bash
npm install
```

## Open/Close Books Drawer

If you are not familiar with Angular [Input and Output Properties](https://angular.io/guide/template-syntax#input-and-output-properties), please do give it a good read so you can understand why we are using the syntax. For the visual learner out there `( )` looks like the letter O in Output and `[ ]` kinda looks like the N for iNput. That is how I try to remember it.

### Template

- `[opened]="showBooksDrawer$ | async"` will take an observable as input with a true/false value, which will open or close the drawer.
- `(activate)="onBooksDrawerActivate($event)"` will output the event observable when the drawer is activated
- `(deactivate)="onBooksDrawerDeactivate($event)"` will output the event observable when the drawer is deactivated

src/app/modules/books/

```html
<mat-drawer-container>
    <mat-drawer [opened]="showBooksDrawer$ | async" mode="side">
        <router-outlet name="book-drawer" (activate)="onBooksDrawerActivate($event)"
            (deactivate)="onBooksDrawerDeactivate($event)"> </router-outlet>
    </mat-drawer>
    <mat-drawer-content>
        <router-outlet></router-outlet>
    </mat-drawer-content>
</mat-drawer-container>

```

### Component

Now that we can pass observables into the `mat-drawer` and receive events out from `router-outlet`, we need to act upon these movements.We can use [RxJS's BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) to provide an initial value and a stream for observing changes to that value.`showBooksDrawer$ = new BehaviorSubject(false);` will now show a closed drawer upon creation because we are defaulting to a false value./src/app/modules/books/book-drawer/

```tsx
showBooksDrawer$ = new BehaviorSubject(false);

```

The below methods will handle the output that is emmited by the `router-outlet`. You can find more details in the [Angular docs](https://angular.io/api/router/RouterOutlet).

/src/app/modules/books/book-drawer/

```tsx
onBooksDrawerActivate(e) {
    this.showBooksDrawer$.next(true);
}
onBooksDrawerDeactivate(e) {
    this.showBooksDrawer$.next(false);
}

```

## Material Fab Button for book add

If you have never heard of a fab button it stands for [Floating Action Button](https://material.io/design/components/buttons-floating-action-button.html). You can see many different [material examples](https://material.angular.io/components/button/examples) to compare what you think might work best for your situation.Below you will see that we are going to create a pink button (our accent color). So that we can add books to our book list only when we are **verified** user and in the **correct** view.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.40_PM.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.40_PM.png)

### Adding Required Modules

We need to import both the `MatButtonModule` for the FAB button, as well as the `MatIconModule` for the plus sign.

/src/app/modules/books/

```tsx
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';
...
imports: [...MatIconModule, MatButtonModule]

```

### Positioning FAB

We will now need to update the styles so that we can correctly position this new button. Other platforms are good about placing this very specifically and then allowing you to override. If you forget to do this in Angular Material it does not have a default.[/src/app/modules/books/](https://github.com/AJONPLLC/lesson14-angular-material-router-awareness/blob/master/src/app/modules/books/books.component.scss#L19)

```css
.app-fab--absolute {
    position: fixed; bottom: 1rem; right: 1rem;
}
@media (min-width: 1024px) {
    .app-fab--absolute {
        bottom: 2rem; right: 2rem;
    }
}

```

### Adding FAB to template

Although this is using a `button` html tag, you then add attributes (technically directives):

- `mat-fab` to provide the rounded shape in our directive.
- `color="accent"` to give this our pink color Check [Material Theming](https://ajonp.com/courses/angularmaterial/angular-material-theming/) for more details.
- `class="app-fab-absolute` is setting up our class that we defined above in our styles
- `routerLink="/books/new"` this is the directive for the Angular router to take action when the button is clicked, see [Angular docs](https://angular.io/api/router/RouterLink)
- `aria-label="Add"` allows for accessiblity features [ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/)
- `<mat-icon aria-label="Add Book">add</mat-icon>` is the entire component required for the [add](https://material.angular.io/components/icon/overview) type icon.

/src/app/modules/books/

```html
<button mat-fab color="accent" class="app-fab--absolute" routerLink="/books/new" aria-label="Add">
    <mat-icon aria-label="Add Book">add</mat-icon>
</button>

```

## Unsubscribing from Subscriptions

> Please note I have since learned an easier way using a seperate Subject and it is used in the next chapter of this course, here is the source.
> 

If we don't remove subscription from the Observables, we have the chance of memory leaks in our application. So a bit of refactoring our subscriptions allows us to add them all together in an array of type Subscription.

- `subs: Array<Subscription> = [];` array for subscriptions.
- `OnDestroy` you must add the implementation for [OnDestroy](https://angular.io/guide/lifecycle-hooks#ondestroy), so we can remove the subscriptions prior to removing the component (aka directive).

/src/app/modules/books/

```tsx
 ngOnDestroy(): void { this.subs.forEach(sub => sub.unsubscribe()); }

```

## Router Events Subscription

In our constructor we can now subscribe to events that happen on the Angular Router instance. We actually only care about the [NavigationEnd](https://angular.io/guide/router#router-events), and also make sure that we are at the `/books` level. At this point we can properly add a true value to the `showBooksAdd$` BehaviorSubject and the UI will react accordingly and update to show the button.

/src/app/modules/books/

```tsx
constructor(private router: Router) {
    /* Only add Book Add Fab on /books */
    this.subs.push(this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd && e.urlAfterRedirects === '/books') {
            this.showBooksAdd$.next(true);
        } else {
            this.showBooksAdd$.next(false);
        }
    }));
}
```

### Hide FAB Button

Now that we are correctly passing the boolean (true/false) value to our BehaviorSubject we can observe this within the Angular UI and react. This is as simple as adding the [NgIf](https://angular.io/api/common/NgIf) directive. The easiest way to accomplish this is by usig the [async pipe](https://angular.io/guide/observables-in-angular#async-pipe) which will automatically subscribe and unsubscribe from our `showBooksAdd$` observable.

- `ngIf="(showBooksAdd$ | async)"` allows for hiding or showing our button determined by the router position.

/src/app/modules/books/

```html
<button
    mat-fab color="accent"
    class="app-fab--absolute"
    routerLink="/books/new"
    aria-label="Add"
    *ngIf="(showBooksAdd$ | async)"
>
    <mat-icon aria-label="Add Book">add</mat-icon>
</button>

```

## Summary

When we are on the `/books` path we want to see the button.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.40_PM.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.40_PM.png)

When we are on any other subpath of `/books/*` we want to hide the button, for example the chapter section.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.51_PM.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/14-angular-material-router-awareness/Screen_Shot_2019-02-11_at_12.19.51_PM.png)