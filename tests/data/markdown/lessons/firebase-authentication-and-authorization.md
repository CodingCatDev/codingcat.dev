---
title: 'Firebase Authentication and Authorization'
date: '2019-01-09'
---

https://youtu.be/II6TAjPWg54

> ⚠️ Notice: I may need to reshoot this video as FirebaseUI is up to [v4.1.0](https://github.com/firebase/firebaseui-web/releases/tag/v4.1.0)  
> [v4.0.0](https://github.com/firebase/firebaseui-web/releases/tag/v4.0.0) Removed all FirebaseUI underlying dependencies on deprecated and removed APIs in Firebase version 6.0.0.
> FirebaseUI no longer supports versions older than 6.0.0.

We will continue building out our app to Authorize users and then add Firestore rules to Authenticate within our Angular application. One of my favorite full time authentication companies is [Auth0](https://auth0.com/). Auth0 has many great articles, the one I refer to when trying to teach others about AuthN vs. AuthZ is [Authentication and Authorization](https://auth0.com/docs/authorization/concepts/authz-and-authn).The biggest takeaway is this:

- `Autentication (AuthN)` Determines whether users are who they claim to be
- `Authorization (AuthZ)` Determines what users can and cannot access

## Setup[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#setup)

We can start from the previous lesson and build upon it by adding AuthN and AuthZ. Previous Lesson: [Angular Material Router Awareness](https://github.com/AJONPLLC/lesson14-angular-material-router-awareness)

```
git clone https://github.com/AJONPLLC/lesson14-angular-material-router-awareness.git
```

This will give us a solid base to start working from, however if you are creating a new firebase project you should change the environment/environment.ts file to match your firebase details. If you have never done this please see [Angular Navigation Firestore](https://ajonp.com/courses/angularmaterial/angular-material-dynamic-navigation-using-firestore) as this will provide more details on how to update.Make sure you update your npm packages

```
npm install
```

## Firebase Authentication (AuthN)[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#firebase-authentication-authn)

The [Firebase Authentication](https://firebase.google.com/docs/auth/) docs have a great amount of detail on how exactly this works for each of their SDKs that they support. When I originally made this video I don't believe that [FirebaseUI](https://firebase.google.com/docs/auth/web/firebaseui) was fully supported and added to the documentation, but it is now. You can still find the main [github repo](https://github.com/firebase/firebaseui-web), which has several issues, but Authentication is the baine of my existence!Thankfully Firebase makes this super simple and I am going to show you how.

### FirebaseUI install[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#firebaseui-install)

FirebaseUI was always a seperate project but it gained huge amounts of popularity. It is a simple drop in solution for authentication that was much needed for Web based authentication with Firebase.First we will need to add `firebaseui` to our npm package dependencies.

```
npm i firebaseui@3.5.2
```

### Create User Module[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#create-user-module)

Using the [Angular CLI](https://angular.io/cli) to create modules and components. You can find specific details about this schematic in the [ng generate CLI section](https://angular.io/cli/generate).

- `ng g m` is a sort hand for `ng generate module`, more can be found [here](https://angular.io/cli/generate#module)
- `modules/user` is the directory from `src/app` where the module will be located.
- `--routing` adds the routing module

```
ng g m modules/user --routing
```

### Create User Signin Component[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#create-user-signin-component)

Using the [Angular CLI](https://angular.io/cli) to create modules and components. You can find specific details about this schematic in the [ng generate CLI section](https://angular.io/cli/generate).

- `ng g c` is a sort hand for `ng generate component`, more can be found [here](https://angular.io/cli/generate#component)
- `modules/user-signin` is the directory from `src/app` where the module will be located, this command will also understand that we want to add this component to the already generated module.

```
ng g c modules/user-signin
```

You should see an output similar to below: Loading image...

### Update User Signin Template[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#update-user-signin-template)

We just need a very simple div so that firebaseUI can locate the ID and then inject itself.[/src/app/modules/user/user-signin/user-signin.component.html](https://github.com/AJONPLLC/lesson15-firebase-AuthZ-AuthN/blob/47f8096c133371ac5d9116c0622abc01d553f100/src/app/modules/user/user-signin/user-signin.component.html#L1)

```
<div id="firebaseui-auth-container"></div>
```

## Firestore Authorization (AuthZ)[](https://codingcat.dev/courses/angularmaterial/firebase-authentication-and-authorization#firestore-authorization-authz)

> ⏸ Continuing to update...
