---
title: "Setup"
date: "2019-08-28"
---

https://youtu.be/oUTz8JbQQww

> You must have [Node](https://nodejs.org/en/download/) installed so you can leverage npm.  
> This module is part of a series if you would like to start from here please execute

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git && cd ajonp-ajsbooks-nextjs && git checkout 01-Intro && npm i && code .
```

> If you notice any issues please submit a [pull request](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/pulls)

# Next.js Setup

> If at any point in time you feel as though the course/module is moving at a pace you are not comfortable, please let me know in your [Slack Channel](http://bit.ly/ajonp-slack-invite).

## Initial Setup[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#initial-setup)

I will be using [Visual Studio Code](https://code.visualstudio.com/download) throughout the Course for all of the coding requirements, however you can use the IDE of your choice. My recommendation is to open two tabs, one with the Youtube video, and the other with the lesson page.

## Create Directory[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#create-directory)

```
mkdir ajonp-ajsbooks-nextjs && cd ajonp-ajsbooks-nextjs 
```

## Initialize NPM[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#initialize-npm)

```
npm init 
```

## Install Initial Dependencies[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#install-initial-dependencies)

- [React](https://www.npmjs.com/package/react)
- [React Dom](https://www.npmjs.com/package/react-dom)
- [Material UI](https://www.npmjs.com/package/@material-ui/core)
- [Next.js](https://www.npmjs.com/package/next)
- [Firebase](https://www.npmjs.com/package/firebase)
- [RxFire](https://www.npmjs.com/package/rxfire)

```
npm i react react-dom next @material-ui/core @material-ui/styles firebase rxfire rxjs 
```

## Create pages Directory[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#create-pages-directory)

Pages in Next.js are where the app "lives"

```
mkdir pages 
```

# Development

At this time I would recommend using VSCode to follow along with the tutorials. [VSCode](https://code.visualstudio.com/download)

## Setup NPM scripts for development[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#setup-npm-scripts-for-development)

Because next is an npm package, it is easy to use it when running much of your application, for both development and production builds. You are going to add these to `package.json` and use NPM to run each command. Just add the following below dependencies.package.json

```
 "scripts": { "dev": "next", "build": "next build", "start": "next start", "export": "next export" } 
```

## Start Next.js server[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#start-nextjs-server)

Start the next server.

```
npm run dev 
```

At this time you are just verifying that the server is up and running and you don't yet have any content. So if you check [http://localhost:3000](http://localhost:3000/), you should see a `404` page which in your case is correct and it tells us that Next.js is being correctly served, but you don't yet have any pages.

![404](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/svi7pymfttwcheopwtqi.png)

## Hello world[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#hello-world)

Now for the legendary "Hello World" example. In your pages directory you can simple add a new file called `index.js`. If you are new to ReactJS this is considered a Functional Component, which is a very basic component that is only presenting html markup without state.pages/index.js

```
const Index = () => ( <div> <p>Hello Next.js</p> </div> ) export default Index 
```

Now that you have content make sure that your server is still running or run command `npm run dev` and refresh the browser.

## Babel Config[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#babel-config)

.babelrc

```
{ "presets": ["next/babel"] } 
```

## Typescrpt Config[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#typescrpt-config)

Next.js 9 is now including this for you, no need to change anything.

## Include Next.js types definition[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#include-nextjs-types-definition)

If you miss this your application might not break, but VSCode should start to highlight things that have not been included for it to understand where files and modules can be found.

## Index Change from .js to .tsx[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#index-change-from-js-to-tsx)

Change the file extension, or just delete `pages/index.js`.pages/index.tsx

```
import * as React from 'react'; const IndexPage: React.FunctionComponent = () => { return <h1>Hello Next.js ????</h1>; }; export default IndexPage; 
```

# Tracking changes

Now that you have a solid start to your project lets add tracking from here on out, you will be using [git](https://git-scm.com/)First lets add an ignore file so you don't pickup your unintended files that you don't want to track.

- `node_modules` this is the folder where your dependencies are held.
- `.next` contains any of your dynamically build content that the dev server is browsing.
- `out` contains the final production static build

.gitignore

```
node_modules .next out 
```

After this is done just run the command.

```
git init 
```

## Tracking remotely (Optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#tracking-remotely-optional)

This is not required to track changes locally but if you want to push your commits out to a remote repository you can do so by first creating your repository.

### Removing remote (Optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#removing-remote-optional)

If you are using the remote repo from AJONPLLC, you need to first remove this so you can track your changes in your own remote repository.

```
git remote remove origin 
```

### Add remote github and push (Optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#add-remote-github-and-push-optional)

Add the remote repository and then push your changes.

```
git remote add origin <your_repo> git push -u origin master 
```

## Checkout Branch Forcibly (Optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-setup#checkout-branch-forcibly-optional)

The modules are built one on top of the other, so you can always jump around if you wish by executing `git checkout <branch_name> -f`. You will not receive any warnings for overwrite but it will set you back to a nice starting point.

```
git checkout 01-Intro -f 
```

> If you get to the end and something is broken just grab the full branch

```
git checkout 02-Setup -f && npm i
```
