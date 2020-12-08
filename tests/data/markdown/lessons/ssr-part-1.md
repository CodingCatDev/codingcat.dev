---
title: "SSR Part 1"
date: "2020-09-16"
---

https://youtu.be/XfOaUonBTsk?t=6766

> You must have [Node](https://nodejs.org/en/download/) installed so you can leverage npm.  
> This module is part of a series if you would like to start from here please execute

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git && cd ajonp-ajsbooks-nextjs && git checkout 06-Firebase-Project && npm i && code .
```

> If you notice any issues please submit a [pull request](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/pulls).

## Book Navigation - SSR #1

> I fully admit that this is an *ADVANCED* course, but I would love any suggestions or pull requests to make it easier!

Server Side Rendering(SSR) is a popular technique for rendering a normally client-side only single page app (SPA) on the server and then sending a fully rendered page to the client. - From [alligator.io](https://alligator.io/react/server-side-rendering/)SSR is not to be confused with Static Site Generators (SSG) like [Hugo](https://gohugo.io/) or [Gatsby](https://www.gatsbyjs.org/) where it generates all of your sites pages in a build step (not dynamically on the server).Typically a React application is run only on the client side, this is where Next.js comes into play.[Next.js SSR Benefits](https://nextjs.org/features/server-side-rendering#benefits) include:

- Superior Performance
- Optimized for Discovery
- Lightning Fast Delivery

So in this module you will start to create the correct framework required to continuously build a Next.js SSR site, then in the next module we will add several additional SSR features.

## Update next.config.js[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#update-nextconfigjs)

You will setup this project to use [Next.js Serverless Deployment](https://nextjs.org/docs#serverless-deployment). This will allow us to create [lambdas](https://zeit.co/docs/v2/advanced/concepts/lambdas/) or in the Firebase world fully baked [Cloud Functions](https://firebase.google.com/docs/functions/get-started).

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#full-code)

[next.config.js](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/next.config.js)

```
module.exports = { target: 'serverless', distDir: './dist/functions/_next' };
```

## Update firebase.json[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#update-firebasejson)

It is very important to understand what is happening in this file. You are telling Firebase Hosting how to direct traffic:

- `/book/**` path -> towards a static html file called `book`.
- `/books` path -> towards a static html file called `books`.
- `**/**` path -> covers every other call. It will push these calls towards our static files.

These cloud functions will be found in our `dist/functions` directory.[/firebase.json](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/firebase.json)

### Full code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#full-code)

```
{ "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" }, "functions": { "source": "dist/functions" }, "hosting": [ { "public": "dist/public", "target": "ajsbooks-nextjs", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"], "rewrites": [ { "source": "/book/**", "function": "book" }, { "source": "/books", "function": "books" }, { "source": "**/**", "function": "index" } ] } ], "storage": { "rules": "storage.rules" } }
```

## Update Firebase functions[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#update-firebase-functions)

[/functions/src/index.ts](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/functions/src/index.ts)

## Update package.json[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#update-packagejson)

This file has gotten a little crazy in the scripts area, so let me try and break down the steps:

firebase:serve > Starts the build process

firebase:build ->

- clean -> Cleans out our build folders
- build -> calls `next build` which outputs to `.next`
- build:functions ->
  - build:functions:lint -> moves into the `functions` directory, lints then builds (this build is self contained) and outputs to `functions/lib`
  - cpx -> copies all the `functions/lib/` over to `dist/functions`
- build:public ->
  - cpx -> copies all `static/` files to `dist/public/static`, `dist/functions/_next/static/` files to `dist/public/_next/static`
- copy:deps -> copies `package.json,package-lock.json` to dist/functions, moves into directory and then runs `npm install`

firebase serve -> you can run everything locally to test

firebase:deploy is the same as firebase:serve but actaully deploys all of your code.If nothing else you can copy and paste and all should work ????.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#full-code)

[package.json](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/package.json)

```
{ "name": "ajonp-ajsbooks-nextjs", "version": "0.0.1", "description": "Next.js Example using Firestore, Firebase Hosting", "main": "index.js", "repository": { "type": "git", "url": "git+https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git" }, "keywords": [ "nextjs", "firestore", "firebase", "materialui" ], "author": "Alex Patterson <alex@ajonp.com> (https://ajonp.com/)", "license": "MIT", "bugs": { "url": "https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/issues" }, "homepage": "https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs#readme", "dependencies": { "@material-ui/core": "^4.3.0", "@material-ui/icons": "^4.2.1", "@material-ui/styles": "^4.3.0", "firebase": "^6.3.4", "firebase-admin": "^8.4.0", "firebase-functions": "^3.2.0", "next": "^9.0.3", "react": "^16.8.6", "react-dom": "^16.8.6", "rxfire": "^3.6.9", "rxjs": "^6.5.2" }, "engines": { "node": "8" }, "scripts": { "dev": "npm run clean && next", "build": "next build", "start": "next start", "export": "next export", "analyze": "cross-env BUNDLE_ANALYZE=both next build", "analyze:server": "cross-env BUNDLE_ANALYZE=server next build", "analyze:browser": "cross-env BUNDLE_ANALYZE=browser next build", "build:functions": "npm run build:functions:lint && cpx \"functions/lib/**/*.*\" dist/functions", "build:functions:lint": "cd functions && npm install && npm run lint && npm run build", "build:public": "cpx \"static/**/*.*\" dist/public/static && cpx \"dist/functions/_next/static/**/*.*\" dist/public/_next/static && cpx \"dist/functions/_next/serverless/pages/**/*.*\" dist/public/", "clean": "rimraf dist && rimraf functions/lib && rimraf .next", "copy:deps": "cpx \"*{package.json,package-lock.json}\" dist/functions && cd dist/functions && npm install", "firebase:build": "npm run clean && npm run build:functions && npm run build && npm run build:public && npm run copy:deps", "firebase:serve": "npm run firebase:build && firebase serve", "firebase:deploy": "npm run firebase:build && firebase deploy" }, "devDependencies": { "cpx": "^1.5.0", "cross-env": "^5.2.0", "typescript": "^3.5.3" } }
```

## Watch Next.js Build Output[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#watch-nextjs-build-output)

Look carefully in the terminal output when you are building, right now we are only setting up the next step on our journey. Next.js is still just outputting static html files, not lambdas.

![Static Only](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/7-book-nav-ssr1/Screen_Shot_2019-09-03_at_3.39.46_PM.png)

## Update Book Card[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#update-book-card)

Main change here is just in the TypeScript updates.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#full-code)

[/components/BookCard.tsx](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/components/BookCard.tsx)

```
import { CardActionArea } from '@material-ui/core'; import Card from '@material-ui/core/Card'; import CardActions from '@material-ui/core/CardActions'; import CardContent from '@material-ui/core/CardContent'; import CardMedia from '@material-ui/core/CardMedia'; import Collapse from '@material-ui/core/Collapse'; import IconButton from '@material-ui/core/IconButton'; import { makeStyles } from '@material-ui/core/styles'; import Typography from '@material-ui/core/Typography'; import ExpandMoreIcon from '@material-ui/icons/ExpandMore'; import clsx from 'clsx'; import NextLink from 'next/link'; import React from 'react'; import Book from '../models/Book'; const useStyles = makeStyles(theme => ({ card: { width: 400, margin: 5, display: 'flex', flexDirection: 'column' }, cardContent: { display: 'flex', flex: '1 0 auto', flexDirection: 'column', width: '375px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', '& h1': { fontSize: '1.4rem', textTransform: 'uppercase' } }, cardMedia: { height: 0, paddingTop: '65%', backgroundRepeat: 'no-repeat', backgroundSize: 'auto', cursor: 'pointer' }, cardDescription: { width: 368, height: 190, overflow: 'auto', whiteSpace: 'normal' }, cardActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, expand: { transform: 'rotate(0deg)', marginLeft: 'auto', transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }) }, expandOpen: { transform: 'rotate(180deg)' } })); const BookCard = ({ book }: { book: Book }) => { const classes = useStyles(); const [expanded, setExpanded] = React.useState(false); const handleExpandClick = () => { setExpanded(!expanded); }; return ( <Card className={classes.card}> <NextLink href={/book?id=${book.id}} as={/book/${book.slug}}> <CardActionArea> <CardMedia className={classes.cardMedia} image={book.cover || '/static/images/cards/book.webp'} title={book.title} /> <CardContent className={classes.cardContent}> <Typography component="h1">{book.title}</Typography> <Typography component="p"> Author: { ${book.authorDisplayName}} </Typography> </CardContent> </CardActionArea> </NextLink> <CardActions className={classes.cardActions}> Summary: <IconButton className={clsx(classes.expand, { [classes.expandOpen]: expanded })} onClick={handleExpandClick} aria-expanded={expanded} aria-label="Show more" > <ExpandMoreIcon /> </IconButton>{' '} </CardActions> <Collapse in={expanded} timeout="auto" unmountOnExit> <CardContent className={classes.cardContent}> <Typography paragraph className={classes.cardDescription}> {book.description} </Typography> </CardContent> </Collapse> </Card> ); }; export default BookCard;
```

## Prevent Duplicate Firebase Instances[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#prevent-duplicate-firebase-instances)

The biggest change here is just an `if` statement `if (!firebase.apps.length)`, that doesn't allow another initialization to occur.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#full-code)

[/lib/firebase.ts](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/lib/firebase.ts)

```
const firebaseConfig = { apiKey: 'AIzaSyCXLldoMUB_AxaLpvG4pQ9Pzg9bEqpMgTA', authDomain: 'ajonp-ajs-books.firebaseapp.com', databaseURL: 'https://ajonp-ajs-books.firebaseio.com', projectId: 'ajonp-ajs-books', storageBucket: 'ajonp-ajs-books.appspot.com', messagingSenderId: '936263241017', appId: '1:936263241017:web:5faee456c1ed2da8' }; export default async function loadFirebase() { const firebase = await import('firebase/app'); await import('firebase/firestore'); try { if (!firebase.apps.length) { const app = firebase.initializeApp(firebaseConfig); firebase.firestore(app); } } catch (err) { // we skip the "already exists" message which is // not an actual error when we're hot-reloading console.log(err); if (!/already exists/.test(err.message)) { console.error('Firebase initialization error', err.stack); } } return firebase; }
```

## Wrap Up[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-1#wrap-up)

You can now build a static site for all of the components and you are ready to convert them into lambdas. Navigate to `books` when selecting one it will open a template.

```
npm run firebase:serve
```

> If you get to the end and something is broken just grab the full branch

```
git checkout 07-Book-Navigation -f && npm i
```
