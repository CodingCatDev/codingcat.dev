---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1609704055/main-codingcatdev-photo/courses/Angular%20Material/xtqvthhf2qpxssymrg40.png
published: published
slug: angular-material-router-outlet
start: June 1, 2022
title: Angular Material Router outlet
weight: 2
youtube: https://youtu.be/niJrSNQ1KwI
---
This lesson will start from a new Angular Project and walk through how to use Angular Material [Sidenav](https://material.angular.io/components/sidenav/overview) using the Angular [Router](https://angular.io/guide/router) with [Named Outlets](https://angular.io/guide/router#displaying-multiple-routes-in-named-outlets). This will be the begining of building a app for publishing book reviews.???? Demo: [https://ajonp-lesson-9.firebaseapp.com/](https://ajonp-lesson-9.firebaseapp.com/)

# Create Angular Project

If you have never used the [Angular CLI](https://cli.angular.io/) you will want to checkout the main page to get started.

```bash
ng new angular-material-router-outlet
```

Please choose Yes for routing and SCSS.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547496414/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/ukc1dpxppxkumbid4aql.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547496414/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/ukc1dpxppxkumbid4aql.png)

## Add Material to Angular Project

> Make sure you have changed to the correct directory cd angular-material-router-outlet
> 

We will now run an Angular schematic command, you can think of this as a workflow to help get your project up and running quicker. There are several schematics available and I would recommend reading [Angular Blog](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) about schematics and [Angular Console](https://angularconsole.com/).

```bash
ng add @angular/material
```

For the selections please choose custom, as we will add these in our next lesson.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499455/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/rcbcfajzbwkjlptbhk08.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499455/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/rcbcfajzbwkjlptbhk08.png)

## Open Project

Now you can open your new Angular project, if using VSCode

```bash
cd angular-material-router-outlet && code .
```

You should see the base angular structure, including a routing module `app-routing.module.ts`

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499630/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/wds1pzbwihb4p6efpnks.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499630/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/wds1pzbwihb4p6efpnks.png)

package.json

```json
{
  "name": "angular-material-router-outlet",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~7.1.0",
    "@angular/cdk": "~7.2.1",
    "@angular/common": "~7.1.0",
    "@angular/compiler": "~7.1.0",
    "@angular/core": "~7.1.0",
    "@angular/forms": "~7.1.0",
    "@angular/material": "^7.2.1",
    "@angular/platform-browser": "~7.1.0",
    "@angular/platform-browser-dynamic": "~7.1.0",
    "@angular/router": "~7.1.0",
    "core-js": "^2.5.4",
    "hammerjs": "^2.0.8",
    "rxjs": "~6.3.3",
    "tslib": "^1.9.0",
    "zone.js": "~0.8.26"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.11.0",
    "@angular/cli": "~7.1.3",
    "@angular/compiler-cli": "~7.1.0",
    "@angular/language-service": "~7.1.0",
    "@types/node": "~8.9.4",
    "@types/jasmine": "~2.8.8",
    "@types/jasminewd2": "~2.0.3",
    "codelyzer": "~4.5.0",
    "jasmine-core": "~2.99.1",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~3.1.1",
    "karma-chrome-launcher": "~2.2.0",
    "karma-coverage-istanbul-reporter": "~2.0.1",
    "karma-jasmine": "~1.1.2",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "~5.4.0",
    "ts-node": "~7.0.0",
    "tslint": "~5.11.0",
    "typescript": "~3.1.6"
  }
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AngularMaterialRouterOutlet</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link
      href="<https://fonts.googleapis.com/css?family=Roboto:300,400,500>"
      rel="stylesheet"
    />
    <link
      href="<https://fonts.googleapis.com/icon?family=Material+Icons>"
      rel="stylesheet"
    />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

# Serve Angular Project

In order to preview this base setup you will need to run the angular serve command.

```bash
ng serve
```

Now on [http://localhost:4200](http://localhost:4200/) you will see the default Angular page displayed.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499873/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/cq7rdkftk6km9kmtism0.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499873/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/cq7rdkftk6km9kmtism0.png)

# Angular Modules

In general a module is a way of packaging up several Angular based files that logically belong together. Direct from Angular's [docs](https://angular.io/guide/architecture-modules), "NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities."We will use both [NgModule](https://angular.io/api/core/NgModule) and [Component](https://angular.io/api/core/Component) extensively through this lesson (and any Angular project).Many tutorials will have you start putting everything into app.component\*, I like to keep the main app clean and load as much as possible after lazy loading. Creating a modules folder keeps things a little more concise, but do what you prefer most.

# Angular Material Sidenav

The Sidenav consists of three main html elements `<mat-sidenav-container>`, `<mat-sidenav>`, and `<mat-sidenav-content>`. Visually these can be represented like

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500528/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/mat-sidenav-content.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500528/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/mat-sidenav-content.png)

## Creating Sidenav Module

To create a module we can leverage the Angular CLI and run

```bash
ng g m modules/sidenav
```

Then we will need a component to display the Angular Material Sidenav.

```bash
ng g c modules/sidenav
```

The output of these commands should give you this structure.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500863/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/dbap7swjuk06qig0jtg2.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500863/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/dbap7swjuk06qig0jtg2.png)

You can then replace any contents in `app.component.html` with

```bash
<app-sidenav></app-sidenav>
```

Sidenav will be the main entrypoint for the entire application, so it will need to reside directly in app.component. If you are asking yourself where did `app-sidenav` come from, Great question! This is defined in `sidenav.component.ts` in the `@Component` decorator, in the property `selector: app-sidenav`. Now at this point `app.component.ts` still does not now how to find `sidenav.component.ts` so we must export it from `sidenav.module.ts` and import it into `app.module.ts`.sidenav.module.ts

```tsx
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SidenavComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatListModule
    ],
    exports: [SidenavComponent]
})

export class SidenavModule { }
```

app.module.ts

```tsx
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { OverlayContainer } from '@angular/cdk/overlay';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SidenavModule],
    providers: [], bootstrap: [AppComponent]
})

export class AppModule {
    constructor(overlayContainer: OverlayContainer) {
        overlayContainer.getContainerElement().classList.add('angular-material-router-app-theme');
    }
}
```

Now our app can find the Sidenav module and can use it to show any of the exported components. If you open the preview again [http://localhost:4200](http://localhost:4200/), you should now see "sidenav works!"I would recommend committing at this point.

```bash
git add . && git commit -m "Initial sidenav"
```

## Update sidenav.component

Now that we know our component can be seen as plain text lets start using the Angular Material Sidenav component for styling our app. First we will need to tell `sidenav.module.ts` that we need to include this new component, by adding it to our imports from `@angular/material`.

```tsx
import { MatSidenavModule} from '@angular/material';

...

imports: [ CommonModule, MatSidenavModule, ...

```

Now we can will update sidenav.component.html to include the sidenav elements.

```html
<mat-sidenav-container>
    <mat-sidenav>drawer</mat-sidenav>
    <mat-sidenav-content>content</mat-sidenav-content>
</mat-sidenav-container>
```

> If you were to preview the page now you will only see "content" as the drawer is automatically hidden.
> 

Update `mat-sidenav` element to have the drawer open and beside content.

```html
<mat-sidenav opened=false mode="over"> ...
```

Now you can preview again [http://localhost:4200](http://localhost:4200/).

## Add MatToolbar

We can make our site look like most by adding a toolbar to the top

```html
<mat-sidenav-container>
    <mat-sidenav opened=false mode="over" #snav> drawer </mat-sidenav>
    <mat-sidenav-content>
        <mat-toolbar color="primary"> <button type="button" aria-label="Toggle sidenav" mat-icon-button
                (click)="snavToggle(snav)">
                <mat-icon>menu</mat-icon>
            </button> content
    </mat-sidenav-content>
</mat-sidenav-container>
```

Because we have added three new Angular Material elements `mat-toolbar`, `mat-icon-button` and `mat-icon` to our component, we will need to let `sidenav.component.ts` know where they are defined, so you need to import them in `sidenav.module.ts`.

```tsx
@NgModule({ declarations: [SidenavComponent], imports: [ CommonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule,
...

```

## Add Angular Router Outlet

The main content of our app needs a place to end up, this is what Angular's `router-outlet` accompishes. It is a placeholder that takes the markup from another component and places it on the page. For our app this will be the main outlet that other child outlets will nest under.

```html
... <router-outlet></router-outlet> </mat-sidenav-content> </mat-sidenav-container>

```

Also remember to add RouterModule to `sidenav.module` so that Angular understands the element `<router-outlet>`.

```tsx
@NgModule({ 
    declarations: [SidenavComponent], 
    imports: [
        CommonModule, 
        MatSidenavModule, 
        MatToolbarModule, 
        MatIconModule, 
        MatButtonModule, 
        RouterModule, 
        MatListModule], 
    exports: [SidenavComponent] 
})
```

This is a visual representation of what is happening in our code so far, mat-sidenav-content->router-outlet is where the reaminder of our app will live.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547502835/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/main-router-outlet.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547502835/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/main-router-outlet.png)

# Lazy Loading Books Feature Module

The first child route that we will setup is a book route. This will require us to create a new module and component. This time we will use an optional parameter `--routing` which will also create a routing module.Create Book Modules

```bash
ng g m modules/books --routing
```

Create Book Component

```bash
ng g c modules/books
```

## Update App routing

We now need to configure the router so that the books feature module can be accessed. So we will go back to `app-routing.module.ts` and add a new route with path `books`. There is a special way to load modules in a lazy fashion, meaning they were not downloaded when first accessing the app but when first accessing the route. You can read more about Lazy Loading Modules in the [Angular Guide](https://angular.io/guide/lazy-loading-ngmodules).

```tsx
const routes: Routes = [ { path: 'books', loadChildren: './modules/books/books.module#BooksModule' } ];

```

## App Routing Default Route

If someone enters the app without a specified path we need to redirect that request over to books so that content will show up correctly.Add to constant routes.

```tsx
 { path: '', redirectTo: '/books', pathMatch: 'full' }

```

## Update Books Feature Module Route

Now that we have told the app router about a feature module we need to make sure that feature module knows which component it should load, so we will add an empty path.

```tsx
const routes: Routes = [ { path: '', component: BooksComponent, } ]

```

You should now see in the live preview [http://localhost/books](http://localhost/books) a message that says "books works!".

# Lazy Loading Welcome Feature Module

Many sites will often have a welcome or home module that you will route your traffic to incase there are notifications, logins, or basic info requirements. So we will switch our base path over to this new feature module and leave books on a seperate path. This will be the same setup as our Books Module.Create Welcome Modules

```bash
ng g m modules/welcome --routing
```

Create Welcome Component

```bash
ng g c modules/welcome
```

## Update App routing

```tsx
const routes: Routes = [ { path: 'welcome', loadChildren: './modules/books/books.module#BooksModule' } ];

```

## App Routing Default Route

Change this redirect from books to Welcome.app-routing.module.ts

```tsx
const routes: Routes = [
  {
    path: "welcome",
    loadChildren: "./modules/welcome/welcome.module#WelcomeModule",
  },
  { path: "books", loadChildren: "./modules/books/books.module#BooksModule" },
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
];
```

## Update Welcome Feature Module Route

welcome-routing.module.ts

```bash
const routes: Routes = [ { path: '', component: WelcomeComponent, } ]
```

# Using Router Link for Navigation

In order for us to navigate the site we need to add some navigational elements. Using an [Angular Material List](https://material.angular.io/components/list/overview#navigation-lists) with a specific `mat-nav-list` element type is just what we need for our sidenav drawer.

```html
...
<mat-sidenav opened=false mode="over">
    <mat-nav-list>
        <mat-list-item>
            <h4 matLine routerLink="/welcome" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="active-link">
                Home</h4>
        </mat-list-item>
        <mat-list-item>
            <h4 matLine routerLink="/books" routerLinkActive="active-link">Books</h4>
        </mat-list-item>
    </mat-nav-list>
</mat-sidenav>
...

```

Don't forget that you will now need to add `RouterModule` and `MatListModule` in your `sidenav.module.ts` imports.sidenav.module.ts

```tsx
@NgModule({
    declarations: [SidenavComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatListModule
    ],
    ...

```

If you now preview [http://localhost:4200](http://localhost:4200/) you will see in the sidenav you can click on Home or Books and the content will change to "welcome works!" and books works!" respectively.

## Active Router Link

You can style your link to know which link you are currently using by adding the attribute `routerLinkActive` and passing a class. We have already assigned ours to `active-link`.We can then add our style to `sidenav.component.scss` so that the active link changes to a bold blue.

```css
.active-link { color: blue; font-weight: bold !important; border: none; }

```

Because we have our home (welcome) route path assigned to '/' if you preview now both Books and Home would be highlighed. By changing our routerlink to `/welcome` this issue will be resolved. In later lessons we will also discuss routerLinkOptions such as `[routerLinkActiveOptions]="{exact:true}"`.

# Toolbar Updates

In our `mat-toolbar` we placed a button that currently calls a function that has not yet been defined. We need to assign a variable called snav by using `#snav` in the element `mat-sidenav`.

## Sidenav Toggle

sidenav.component.html

```html
<mat-sidenav opened=false mode="over" #snav>

```

We can then use this new variable and pass it on the button click output `(click)="snavToggle(snav)"`sidenav.component.html

```html
<button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="snavToggle(snav)" >

```

## Function for Toggle

Using our new snav reference we can just call the method that exists on this object, it will open or close the sidenav drawer.sidenav.component.ts

```tsx
snavToggle(snav) { snav.toggle(); }

```

If you now preview [http://localhost:4200](http://localhost:4200/) you will see that the toolbar hamburger (three horizontal lines) button will open and close the sidenav drawer.

## Toolbar Title

We can also specify a title to allow our home routerlink to return home.

```html
<a class="home-link" routerLink=".">{{ title }}</a>

```

sidenav.component.ts

```tsx
 title = 'Lesson 9 - Angular Material Router Outlet';

```

# Book Drawer as Named Outlet

Now that we have our book feature module all setup with working navigation and toolbar, we are going to add a named outlet for a drawer on this page.Visually it will look like this

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547511788/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/book-drawer.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547511788/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/book-drawer.png)

We will change our `books.component.html` from having text to including an Angular Material Drawer (mat-drawer). Remember now we have `one` router-outlet in our `sidenav.component` and `two` router-outlets in `books.component`, one named for the drawer and one for content.

## Create Drawer Component

No routing needed for this module as it will be used only inside of our books module and not as a feature module.module

```bash
ng g m modules/books/book-drawer

```

component

```bash
ng g c modules/books/book-drawer

```

> Don't forget to export this component as it will be used in book-detail.
> 

book-drawer.module.ts

```
... @NgModule({ 
declarations: [BookDrawerComponent], 
imports: [ CommonModule ], 
exports: [ BookDrawerComponent ] ...

```

## Add mat-drawer to Books

There are three parts to the drawer just like sidenav, this is because they are the same with sidenav having a few additional structural features.Having attributes opened="true" will show the drawer on screen and having mode="side" will push the content to beside the drawer.modules/books/books.component.html

```html
<mat-drawer-container>
    <mat-drawer opened="true" mode="side">
        <router-outlet name="book-drawer"></router-outlet>
    </mat-drawer>
    <mat-drawer-content>
        <router-outlet></router-outlet>
    </mat-drawer-content>
</mat-drawer-container>

```

Remember to add MatSidenavModule to `books.module.ts`, or the `mat-drawer` element will not be recognized.

```tsx
@NgModule({ declarations: [BooksComponent], imports: [ CommonModule, BooksRoutingModule, MatSidenavModule ] })

```

## Create Book Detail Component

We will use this as an additional child feature route of books, so we need the router module.module

```bash
ng g m modules/books/book-detail --routing

```

component

```bash
ng g c modules/books/book-detail

```

## Update Books Routing

We no longer want just the BookComponent to load when the `/books` route is hit, we want it to load its children as well. We do this the same as we did with our `app-routing.module.ts` and we will lazy load it with `loadChildren`.

```tsx
const routes: Routes = [
    {
        path: '',
        component: BooksComponent,
        children: [
            {
                path: '',
                loadChildren: './book-detail/book-detail.module#BookDetailModule'
            }
        ]
    }
];

```

## Update Book-Detail Routing with Named Outlet

Now that the books module knows to lazy load the book-detail module on its base path we need to update the route in book-detail to load its own component. This however will have a special route with an `outlet` for the drawer as well, this tells the router that it must use only this named route for its [component.So](http://component.so/) the router will load:
book-detail -> `<router-outlet>`
book-drawer -> `<router-outlet name="book-drawer">`

```tsx
const routes: Routes = [
    {
        path: '',
        component: BookDetailComponent
    },
    {
        path: '',
        component: BookDrawerComponent,
        outlet: 'book-drawer'
    }
];

```

If you now preview [http://localhost:4200/books](http://localhost:4200/books) you will see in a drawer "book-drawer works!" and in the content area "book-detail works!".

# Final Thoughts

The Angular Router is amazingly powerful, you can create sever nested routes, named routes, guarded routes...If you cloned the final GitHub repo you will see some additional style updates, I will be covering those in the next Angular Material Themeing lesson.

# Angular Material Router Outlet

This lesson will start from a new Angular Project and walk through how to use Angular Material [Sidenav](https://material.angular.io/components/sidenav/overview) using the Angular [Router](https://angular.io/guide/router) with [Named Outlets](https://angular.io/guide/router#displaying-multiple-routes-in-named-outlets). This will be the begining of building a app for publishing book reviews.???? Demo: [https://ajonp-lesson-9.firebaseapp.com/](https://ajonp-lesson-9.firebaseapp.com/)

# Create Angular Project

If you have never used the [Angular CLI](https://cli.angular.io/) you will want to checkout the main page to get started.

```bash
ng new angular-material-router-outlet

```

Please choose Yes for routing and SCSS.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547496414/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/ukc1dpxppxkumbid4aql.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547496414/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/ukc1dpxppxkumbid4aql.png)

## Add Material to Angular Project

> Make sure you have changed to the correct directory cd angular-material-router-outlet
> 

We will now run an Angular schematic command, you can think of this as a workflow to help get your project up and running quicker. There are several schematics available and I would recommend reading [Angular Blog](https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2) about schematics and [Angular Console](https://angularconsole.com/).

```
ng add @angular/material

```

For the selections please choose custom, as we will add these in our next lesson.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499455/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/rcbcfajzbwkjlptbhk08.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499455/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/rcbcfajzbwkjlptbhk08.png)

## Open Project

Now you can open your new Angular project, if using VSCode

```bash
cd angular-material-router-outlet && code .

```

You should see the base angular structure, including a routing module `app-routing.module.ts`

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499630/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/wds1pzbwihb4p6efpnks.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499630/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/wds1pzbwihb4p6efpnks.png)

package.json

```json
{
  "name": "angular-material-router-outlet",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~7.1.0",
    "@angular/cdk": "~7.2.1",
    "@angular/common": "~7.1.0",
    "@angular/compiler": "~7.1.0",
    "@angular/core": "~7.1.0",
    "@angular/forms": "~7.1.0",
    "@angular/material": "^7.2.1",
    "@angular/platform-browser": "~7.1.0",
    "@angular/platform-browser-dynamic": "~7.1.0",
    "@angular/router": "~7.1.0",
    "core-js": "^2.5.4",
    "hammerjs": "^2.0.8",
    "rxjs": "~6.3.3",
    "tslib": "^1.9.0",
    "zone.js": "~0.8.26"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.11.0",
    "@angular/cli": "~7.1.3",
    "@angular/compiler-cli": "~7.1.0",
    "@angular/language-service": "~7.1.0",
    "@types/node": "~8.9.4",
    "@types/jasmine": "~2.8.8",
    "@types/jasminewd2": "~2.0.3",
    "codelyzer": "~4.5.0",
    "jasmine-core": "~2.99.1",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~3.1.1",
    "karma-chrome-launcher": "~2.2.0",
    "karma-coverage-istanbul-reporter": "~2.0.1",
    "karma-jasmine": "~1.1.2",
    "karma-jasmine-html-reporter": "^0.2.2",
    "protractor": "~5.4.0",
    "ts-node": "~7.0.0",
    "tslint": "~5.11.0",
    "typescript": "~3.1.6"
  }
}

```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AngularMaterialRouterOutlet</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link
      href="<https://fonts.googleapis.com/css?family=Roboto:300,400,500>"
      rel="stylesheet"
    />
    <link
      href="<https://fonts.googleapis.com/icon?family=Material+Icons>"
      rel="stylesheet"
    />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

# Serve Angular Project

In order to preview this base setup you will need to run the angular serve command.

```bash
ng serve

```

Now on [http://localhost:4200](http://localhost:4200/) you will see the default Angular page displayed.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499873/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/cq7rdkftk6km9kmtism0.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547499873/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/cq7rdkftk6km9kmtism0.png)

# Angular Modules

In general a module is a way of packaging up several Angular based files that logically belong together. Direct from Angular's [docs](https://angular.io/guide/architecture-modules), "NgModules are containers for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities."We will use both [NgModule](https://angular.io/api/core/NgModule) and [Component](https://angular.io/api/core/Component) extensively through this lesson (and any Angular project).Many tutorials will have you start putting everything into app.component\*, I like to keep the main app clean and load as much as possible after lazy loading. Creating a modules folder keeps things a little more concise, but do what you prefer most.

# Angular Material Sidenav

The Sidenav consists of three main html elements `<mat-sidenav-container>`, `<mat-sidenav>`, and `<mat-sidenav-content>`. Visually these can be represented like

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500528/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/mat-sidenav-content.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500528/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/mat-sidenav-content.png)

## Creating Sidenav Module

To create a module we can leverage the Angular CLI and run

```bash
ng g m modules/sidenav

```

Then we will need a component to display the Angular Material Sidenav.

```bash
ng g c modules/sidenav

```

The output of these commands should give you this structure.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500863/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/dbap7swjuk06qig0jtg2.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547500863/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/dbap7swjuk06qig0jtg2.png)

You can then replace any contents in `app.component.html` with

```html
<app-sidenav></app-sidenav>

```

Sidenav will be the main entrypoint for the entire application, so it will need to reside directly in app.component. If you are asking yourself where did `app-sidenav` come from, Great question! This is defined in `sidenav.component.ts` in the `@Component` decorator, in the property `selector: app-sidenav`. Now at this point `app.component.ts` still does not now how to find `sidenav.component.ts` so we must export it from `sidenav.module.ts` and import it into `app.module.ts`.sidenav.module.ts

```tsx
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [SidenavComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatListModule
    ],
    exports: [SidenavComponent]
})

export class SidenavModule { }

```

app.module.ts

```tsx
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { OverlayContainer } from '@angular/cdk/overlay';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SidenavModule],
    providers: [], bootstrap: [AppComponent]
})

export class AppModule {
    constructor(overlayContainer: OverlayContainer) {
        overlayContainer.getContainerElement().classList.add('angular-material-router-app-theme');
    }
}
```

Now our app can find the Sidenav module and can use it to show any of the exported components. If you open the preview again [http://localhost:4200](http://localhost:4200/), you should now see "sidenav works!"I would recommend committing at this point.

```bash
git add . && git commit -m "Initial sidenav"
```

## Update sidenav.component\*

Now that we know our component can be seen as plain text lets start using the Angular Material Sidenav component for styling our app. First we will need to tell `sidenav.module.ts` that we need to include this new component, by adding it to our imports from `@angular/material`.

```tsx
import { MatSidenavModule} from '@angular/material';

...

imports: [ CommonModule, MatSidenavModule, ...

```

Now we can will update sidenav.component.html to include the sidenav elements.

```html
<mat-sidenav-container>
    <mat-sidenav>drawer</mat-sidenav>
    <mat-sidenav-content>content</mat-sidenav-content>
</mat-sidenav-container>

```

> If you were to preview the page now you will only see "content" as the drawer is automatically hidden.
> 

Update `mat-sidenav` element to have the drawer open and beside content.

```html
<mat-sidenav opened=false mode="over"> ...

```

Now you can preview again [http://localhost:4200](http://localhost:4200/).

## Add MatToolbar

We can make our site look like most by adding a toolbar to the top

```html
<mat-sidenav-container>
    <mat-sidenav opened=false mode="over" #snav> drawer </mat-sidenav>
    <mat-sidenav-content>
        <mat-toolbar color="primary"> <button type="button" aria-label="Toggle sidenav" mat-icon-button
                (click)="snavToggle(snav)">
                <mat-icon>menu</mat-icon>
            </button> content
    </mat-sidenav-content>
</mat-sidenav-container>
```

Because we have added three new Angular Material elements `mat-toolbar`, `mat-icon-button` and `mat-icon` to our component, we will need to let `sidenav.component.ts` know where they are defined, so you need to import them in `sidenav.module.ts`.

```tsx
@NgModule({ declarations: [SidenavComponent], imports: [ CommonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule,
...

```

## Add Angular Router Outlet

The main content of our app needs a place to end up, this is what Angular's `router-outlet` accompishes. It is a placeholder that takes the markup from another component and places it on the page. For our app this will be the main outlet that other child outlets will nest under.

```html
... <router-outlet></router-outlet> </mat-sidenav-content> </mat-sidenav-container>

```

Also remember to add RouterModule to `sidenav.module` so that Angular understands the element `<router-outlet>`.

```tsx
@NgModule({ declarations: [SidenavComponent], imports: [ CommonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule, MatListModule ], exports: [SidenavComponent] })

```

This is a visual representation of what is happening in our code so far, mat-sidenav-content->router-outlet is where the reaminder of our app will live.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547502835/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/main-router-outlet.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547502835/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/main-router-outlet.png)

# Lazy Loading Books Feature Module

The first child route that we will setup is a book route. This will require us to create a new module and component. This time we will use an optional parameter `--routing` which will also create a routing module.Create Book Modules

```bash
ng g m modules/books --routing

```

Create Book Component

```bash
ng g c modules/books

```

## Update App routing

We now need to configure the router so that the books feature module can be accessed. So we will go back to `app-routing.module.ts` and add a new route with path `books`. There is a special way to load modules in a lazy fashion, meaning they were not downloaded when first accessing the app but when first accessing the route. You can read more about Lazy Loading Modules in the [Angular Guide](https://angular.io/guide/lazy-loading-ngmodules).

```tsx
const routes: Routes = [ { path: 'books', loadChildren: './modules/books/books.module#BooksModule' } ];

```

## App Routing Default Route

If someone enters the app without a specified path we need to redirect that request over to books so that content will show up correctly.Add to constant routes.

```tsx
 { path: '', redirectTo: '/books', pathMatch: 'full' }

```

## Update Books Feature Module Route

Now that we have told the app router about a feature module we need to make sure that feature module knows which component it should load, so we will add an empty path.

```tsx
const routes: Routes = [ { path: '', component: BooksComponent, } ]

```

You should now see in the live preview [http://localhost/books](http://localhost/books) a message that says "books works!".

# Lazy Loading Welcome Feature Module

Many sites will often have a welcome or home module that you will route your traffic to incase there are notifications, logins, or basic info requirements. So we will switch our base path over to this new feature module and leave books on a seperate path. This will be the same setup as our Books Module.Create Welcome Modules

```bash
ng g m modules/welcome --routing
```

Create Welcome Component

```bash
ng g c modules/welcome
```

## Update App routing

```tsx
const routes: Routes = [ { path: 'welcome', loadChildren: './modules/books/books.module#BooksModule' } ];

```

## App Routing Default Route

Change this redirect from books to Welcome.app-routing.module.ts

```tsx
const routes: Routes = [ { path: 'welcome', loadChildren: './modules/welcome/welcome.module#WelcomeModule' }, { path: 'books', loadChildren: './modules/books/books.module#BooksModule' }, { path: '', redirectTo: '/welcome', pathMatch: 'full' } ];

```

## Update Welcome Feature Module Route

welcome-routing.module.ts

```tsx
const routes: Routes = [ { path: '', component: WelcomeComponent, } ]
```

# Using Router Link for Navigation

In order for us to navigate the site we need to add some navigational elements. Using an [Angular Material List](https://material.angular.io/components/list/overview#navigation-lists) with a specific `mat-nav-list` element type is just what we need for our sidenav drawer.

```html
...
<mat-sidenav opened=false mode="over">
    <mat-nav-list>
        <mat-list-item>
            <h4 matLine routerLink="/welcome" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="active-link">
                Home</h4>
        </mat-list-item>
        <mat-list-item>
            <h4 matLine routerLink="/books" routerLinkActive="active-link">Books</h4>
        </mat-list-item>
    </mat-nav-list>
</mat-sidenav>
...

```

Don't forget that you will now need to add `RouterModule` and `MatListModule` in your `sidenav.module.ts` imports.sidenav.module.ts

```tsx
@NgModule({
    declarations: [SidenavComponent],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatListModule
    ],
    ...

```

If you now preview [http://localhost:4200](http://localhost:4200/) you will see in the sidenav you can click on Home or Books and the content will change to "welcome works!" and books works!" respectively.

## Active Router Link

You can style your link to know which link you are currently using by adding the attribute `routerLinkActive` and passing a class. We have already assigned ours to `active-link`.We can then add our style to `sidenav.component.scss` so that the active link changes to a bold blue.

```css
.active-link { color: blue; font-weight: bold !important; border: none; }
```

Because we have our home (welcome) route path assigned to '/' if you preview now both Books and Home would be highlighed. By changing our routerlink to `/welcome` this issue will be resolved. In later lessons we will also discuss routerLinkOptions such as `[routerLinkActiveOptions]="{exact:true}"`.

# Toolbar Updates

In our `mat-toolbar` we placed a button that currently calls a function that has not yet been defined. We need to assign a variable called snav by using `#snav` in the element `mat-sidenav`.

## Sidenav Toggle

sidenav.component.html

```html
<mat-sidenav opened=false mode="over" #snav>
```

We can then use this new variable and pass it on the button click output `(click)="snavToggle(snav)"`sidenav.component.html

```html
<button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="snavToggle(snav)" >
```

## Function for Toggle

Using our new snav reference we can just call the method that exists on this object, it will open or close the sidenav drawer.sidenav.component.ts

```tsx
snavToggle(snav) { snav.toggle(); }
```

If you now preview [http://localhost:4200](http://localhost:4200/) you will see that the toolbar hamburger (three horizontal lines) button will open and close the sidenav drawer.

## Toolbar Title

We can also specify a title to allow our home routerlink to return home.

```html
<a class="home-link" routerLink=".">{{ title }}</a>
```

sidenav.component.ts

```tsx
 title = 'Lesson 9 - Angular Material Router Outlet';
```

# Book Drawer as Named Outlet

Now that we have our book feature module all setup with working navigation and toolbar, we are going to add a named outlet for a drawer on this page.Visually it will look like this

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547511788/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/book-drawer.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto//v1547511788/ajonp-ajonp-com/9-lesson-angular-material-router-outlet/book-drawer.png)

We will change our `books.component.html` from having text to including an Angular Material Drawer (mat-drawer). Remember now we have `one` router-outlet in our `sidenav.component` and `two` router-outlets in `books.component`, one named for the drawer and one for content.

## Create Drawer Component

No routing needed for this module as it will be used only inside of our books module and not as a feature module.module

```bash
ng g m modules/books/book-drawer
```

component

```bash
ng g c modules/books/book-drawer
```

> Don't forget to export this component as it will be used in book-detail.
> 

book-drawer.module.ts

```tsx
... @NgModule({ declarations: [BookDrawerComponent], imports: [ CommonModule ], exports: [ BookDrawerComponent ] ...

```

## Add mat-drawer to Books

There are three parts to the drawer just like sidenav, this is because they are the same with sidenav having a few additional structural features.Having attributes opened="true" will show the drawer on screen and having mode="side" will push the content to beside the drawer.modules/books/books.component.html

```html
<mat-drawer-container>
    <mat-drawer opened="true" mode="side">
        <router-outlet name="book-drawer"></router-outlet>
    </mat-drawer>
    <mat-drawer-content>
        <router-outlet></router-outlet>
    </mat-drawer-content>
</mat-drawer-container>
```

Remember to add MatSidenavModule to `books.module.ts`, or the `mat-drawer` element will not be recognized.

```tsx
@NgModule({ declarations: [BooksComponent], imports: [ CommonModule, BooksRoutingModule, MatSidenavModule ] })

```

## Create Book Detail Component

We will use this as an additional child feature route of books, so we need the router module.module

```bash
ng g m modules/books/book-detail --routing
```

component

```bash
ng g c modules/books/book-detail
```

## Update Books Routing

We no longer want just the BookComponent to load when the `/books` route is hit, we want it to load its children as well. We do this the same as we did with our `app-routing.module.ts` and we will lazy load it with `loadChildren`.

```tsx
const routes: Routes = [
    {
        path: '',
        component: BooksComponent,
        children: [
            {
                path: '',
                loadChildren: './book-detail/book-detail.module#BookDetailModule'
            }
        ]
    }
];
```

## Update Book-Detail Routing with Named Outlet

Now that the books module knows to lazy load the book-detail module on its base path we need to update the route in book-detail to load its own component. This however will have a special route with an `outlet` for the drawer as well, this tells the router that it must use only this named route for its [component.So](http://component.so/) the router will load:
book-detail -> `<router-outlet>`
book-drawer -> `<router-outlet name="book-drawer">`

```tsx
const routes: Routes = [
    {
        path: '',
        component: BookDetailComponent
    },
    {
        path: '',
        component: BookDrawerComponent,
        outlet: 'book-drawer'
    }
];
```

If you now preview [http://localhost:4200/books](http://localhost:4200/books) you will see in a drawer "book-drawer works!" and in the content area "book-detail works!".

# Final Thoughts

The Angular Router is amazingly powerful, you can create sever nested routes, named routes, guarded routes...If you cloned the final GitHub repo you will see some additional style updates, I will be covering those in the next Angular Material Themeing lesson.