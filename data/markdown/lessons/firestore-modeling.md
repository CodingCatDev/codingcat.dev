---
title: "Firestore Modeling"
date: "2020-09-16"
---

https://youtu.be/XfOaUonBTsk?t=4048

> You must have [Node](https://nodejs.org/en/download/) installed so you can leverage npm.  
> This module is part of a series if you would like to start from here please execute

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git && cd ajonp-ajsbooks-nextjs && git checkout 04-Navigation && npm i && code .
```

> If you notice any issues please submit a [pull request](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/pulls)

# Next.js Firebase Firestore

Just a warning up front there is a lot in this module, I would recommend doing it in two parts. I gave a lot of thought into breaking it up into another module but ultimately decided that the material was too tightly coupled to break apart.

## Firestore[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firestore)

Cloud Firestore is a NoSQL, document-oriented database. Unlike a SQL database, there are no tables or rows. Instead, you store data in documents, which are organized into collections. Each document contains a set of key-value pairs. Cloud Firestore is optimized for storing large collections of small documents. All documents must be stored in collections. Documents can contain subcollections and nested objects, both of which can include primitive fields like strings or complex objects like lists. Collections and documents are created implicitly in Cloud Firestore. Simply assign data to a document within a collection. If either the collection or document does not exist, Cloud Firestore creates it.If this is a new concept for you please read through [Cloud Firestore Data model](https://firebase.google.com/docs/firestore/data-model).

### Firestore Data Model[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firestore-data-model)

This is how I typically think of the data model, it is very similar (if not the same) as how Firebase's Firestore guide shows.

![Firestore Model](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Firestore_Model.png)

### AJ's Data Model[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#ajs-data-model)

Specifically for AJ's Books application we will have a structure that seems like this (although there are no folders):

![AJ's Books Model](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Base-Model.png)

### Firestore Example Book[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firestore-example-book)

![AJ Book Model](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Book-Data-Model.png)

### Firestore Example Author[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firestore-example-author)

![AJ Author Model](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Author-Data-Model.png)

### Create Firestore Database[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#create-firestore-database)

On the side menu under Develop, select Database. You will then be presented with a screen to `Create Database`.

![Create Firestore DB](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.23.38_PM.png)

Please leave your Firestore Database in Locked mode. This prevents any security concerns.

![Locked Mode](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.23.46_PM.png)

### Firebase Admin SDK Private Key[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firebase-admin-sdk-private-key)

In order to use this tool you will need to add your own firebase credentials, you can find this in your project settings under service accounts `https://console.firebase.google.com/project/ajonp-ajs-books/settings/serviceaccounts/adminsdk`.

![Firebase SDK Private Key](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Firebase_Private_Key.png)

You will get a warning, this is fine and why I put in our `.gitignore` the file we are creating `firebase_credentials.json`.

![Private Key Generate](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.20.56_PM.png)

### Adding Firestore Sample Data[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#adding-firestore-sample-data)

You are going to create sample data for the books collection in Firestore by using the Firebase Admin API. There is probably more efficent ways to do this but I really like using the [Faker API](https://github.com/Marak/faker.js).Please clone this repo locally and install the dependencies.

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-db-example.git && cd ajonp-ajsbooks-db-example && npm i 
```

Make sure you rename any file you download to `firebase_credentials.json` then place that file into the root of our project.

![root of project](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.28.51_PM.png)

If you forget this you will get this error:

![Firestore Error](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.49.05_PM.png)

Now you can run the config script:

```
npm run config 
```

This adds dropdown based data that we will use later.

```
module.exports = { ageCategory: { board: 'Age 0-2', earlyReader: 'Age 6-8', middleGrade: 'Age 9-12', picture: 'Age 3-5', youngAdult: 'Age 13-18' }, fiction: [ 'Classic', 'Comics/Graphic novel', 'Crime/detective', 'Fable', 'Fairy tale', 'Fan fiction', 'Fantasy', 'Folklore', 'Historical Fiction', 'Horror', 'Humor', 'Legend', 'Magical Realism', 'Meta Fiction', 'Mystery', 'Mythology', 'Mythopoeia', 'Picture Book', 'Realistic Fiction', 'Science Fiction', 'Short Story', 'Suspense/thriller', 'Swashbuckler', 'Tall Tale', 'Western' ], nonFiction: [ 'Biography', 'Essay', 'Owners Manual', 'Journalism', 'Lab Report', 'Memoir', 'Narrative', 'Reference Book', 'Self-Help Book', 'Speech', 'Text Book' ], options: { hasAudio: false, hasPhotos: false, hasVideo: false }, status: ['Published', 'Working Copy'] }; 
```

Now (finally), we can add all the important book data.

```
npm run start 
```

You should see an output like:

![book script output](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_3.44.59_PM.png)

You can also open your Firebase console and take a look at all the books, with subcollection of chapters, with subcollection of pages. There should be 5 books, with 5 chapters, and 50 pages, each time your run the program.

> Okay you made it! We are half way there, go grab a ☕️ or maybe a ????.

## Add Firebase Frontend Config[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#add-firebase-frontend-config)

If you are new to Firebase you could be asking yourself right now why is he splashing his keys all over the place?You must remember that this is front end coding and it will be public anyways. So this is where I will mention in order to have a secure app, you must put solid security rules into your database.

### Full code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#full-code)

/lib/firebase.ts

```
const firebaseConfig = { apiKey: 'AIzaSyCXLldoMUB_AxaLpvG4pQ9Pzg9bEqpMgTA', authDomain: 'ajonp-ajs-books.firebaseapp.com', databaseURL: 'https://ajonp-ajs-books.firebaseio.com', projectId: 'ajonp-ajs-books', storageBucket: 'ajonp-ajs-books.appspot.com', messagingSenderId: '936263241017', appId: '1:936263241017:web:5faee456c1ed2da8' }; export default async function loadFirebase() { const firebase = await import('firebase/app'); await import('firebase/firestore'); try { const app = firebase.initializeApp(firebaseConfig); firebase.firestore(app); } catch (err) { // we skip the "already exists" message which is // not an actual error when we're hot-reloading console.log(err); if (!/already exists/.test(err.message)) { console.error('Firebase initialization error', err.stack); } } return firebase; } 
```

## Firestore rules[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#firestore-rules)

For now we are going to manually update our rules (later we will use the Firebase CLI) to match below:

### Full Code (rules)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#full-code-rules)

```
service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read, write: if false; } // This function allows us to look at AuthZ (Authorization) roles within our database, to see who is allowed for activities. function getRole(role) { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles[role] } // Users match /users/{userId} { allow read: if request.auth.uid != null; allow create: if request.resource.data.roles.keys().hasAny(['admin', 'editor']) == false; allow update: if request.resource.data.roles.keys().hasAny(['admin', 'editor']) == false || resource.data.roles.keys().hasAny(['admin', 'editor']) == true; } match /config/{configId}{ allow read: if true; } match /books/{bookId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; match /chapters/{chapterId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; match /pages/{pageId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; } } } match /authors/{authorId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; } match /graphicnovels/{gnId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; } } } 
```

### Staying Locked[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#staying-locked)

This snippet should always remain, you will see errors in your console that will help you to determine if you should update your rules further.

```
 match /{document=**} { allow read, write: if false; } 
```

### Custom Rule Functions[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#custom-rule-functions)

[Custom Rule Functions](https://firebase.google.com/docs/firestore/security/rules-conditions#custom_functions) help us easily address how secure we want to lock down our app. For now we don't want anyone but a user who has `admin` rights to create/update/delete our data.The function below returns a boolean value based on the currently signedin user.

```
 // This function allows us to look at AuthZ (Authorization) roles within our database, to see who is allowed for activities. function getRole(role) { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles[role] } 
```

We can then easily check for this value by calling the function `getRole()`, which will lookup the currently signed in user and see if they have the role `admin` set to true in our roles `map`. You can find all the data types available in [Firestore Data Types](https://firebase.google.com/docs/firestore/manage-data/data-types).

```
allow create: if getRole('admin') == true; 
```

Here you can see that I have set my `admin@ajonp.com` user to be an `admin`. Note: all users in our application get the role `subscriber`.

![](https://codingcat.dev/wp-content/uploads/2020/09/image-62.png)

![user admin](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-09-03_at_12.56.44_PM.png)

### Books rules[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#books-rules)

Now if you remember from our [Model Diagram](https://ajonp.com/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling/#aj-s-data-model), we will be adding a `books` main collection with `chapters` subcollection then within `chapters` you will have a `pages` subcollection.

```
 match /books/{bookId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; match /chapters/{chapterId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; match /pages/{pageId}{ allow create: if getRole('admin') == true; allow read: if true; allow update: if getRole('editor') == true || getRole('admin') == true; allow delete: if getRole('admin') == true; } } } 
```

### Manual upload[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#manual-upload)

Navigate to the firebase console -> Database -> Rules tab. Then copy and paste all of the code from above, you should then be able to publish.

![Rules Publish](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/6-firebase-project/Screen_Shot_2019-09-03_at_1.05.36_PM.png)

### Lazy Loading Modules[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#lazy-loading-modules)

This example of loading firebase is based on the [Next.js Lazy Loading Modules Tutorial](https://nextjs.org/learn/excel/lazy-loading-modules). This is the best way to add firebase into your project. If you have a requirement to switch between multiple environments, you can check for the Node Env variables and also set this up.

## Add Models[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#add-models)

Yes models take time to setup and make you fight ever instinct you have to be lazy, this is JS right? Well no you are in TS land now, you need to have well defined objects so that you don't miss any data, and can also utilize things like creating a new class for data. You will also recognize the file types are typescript, since you are not using JSX at this time only TypeScript.

### AjonpUser Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#ajonpuser-full-code)

/models/AjonpUser.ts

```
export default class AjonpUser { aboutYou?: string; created?: number; displayName?: string; email?: string; emailVerified?: boolean; favoriteColor?: string; lastActive?: number; phoneNumber?: string; photoURL?: string; roles?: AjonpRoles; token?: string; uid?: string; untappd?: { access_token?: string; }; website?: string; public constructor(init?: Partial<AjonpUser>) { Object.assign(this, init); } } export class AjonpRoles { admin?: boolean; editor?: boolean; subscriber?: boolean; } 
```

### Book Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#book-full-code)

/models/Book.ts

```
import { Timestamp } from '@firebase/firestore-types'; export default class Book { ageCategory?: string; authorDisplayName?: string; authorId?: string; description?: string; fiction?: boolean; genre?: string; hasAudio?: boolean; hasPhotos?: boolean; hasVideos?: boolean; id?: string; image?: string; publishDate?: Timestamp | Date; rating?: number; status?: string; title?: string; updatedAt?: Timestamp | Date; public constructor(init?: Partial<Book>) { Object.assign(this, init); } } 
```

### Author Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#author-full-code)

Author is one of those special cases where you want to know all the books that this Author has written. Maybe not the full object but a number of key fields.

```
import Book from './Book'; export default class Author { books?: Book[]; displayName?: string; email?: string; id?: string; name?: string; profileImage?: string; social?: Map<string, string>; summary?: string; uid?: string; website?: string; public constructor(init?: Partial<Author>) { Object.assign(this, init); } } 
```

### Chapter Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#chapter-full-code)

/models/Chapter.ts

```
export default class Chapter { id?: string; sort?: number; title?: string; numOfSections?: number; public constructor(init?: Partial<Chapter>) { Object.assign(this, init); } } 
```

### ConfigBook Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#configbook-full-code)

/models/ConfigBook.ts

```
export default class ConfigBook { ageCategory?: Map<string, string>; fiction?: Array<string>; nonFiction?: Array<string>; options?: Map<string, string>; public constructor(init?: Partial<ConfigBook>) { Object.assign(this, init); } } 
```

### GraphicNovel Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#graphicnovel-full-code)

/models/GraphicNovel.ts

```
import { Timestamp } from '@firebase/firestore-types'; export default class GraphicNovel { ageCategory?: string; description?: string; fiction?: boolean; genre?: string; hasAudio?: boolean; hasPhotos?: boolean; hasVideos?: boolean; id?: string; image?: string; publishDate?: Timestamp | Date; rating?: number; status?: string; title?: string; updatedAt?: Timestamp | Date; public constructor(init?: Partial<GraphicNovel>) { Object.assign(this, init); } } 
```

### Page Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#page-full-code)

/models/Page.ts

```
export default class Page { draft?: boolean; id?: string; number?: number; numOfWords?: number; version?: number; public constructor(init?: Partial<Page>) { Object.assign(this, init); } } 
```

### Section Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#section-full-code)

/models/Section.ts

```
export default class Section { description?: string; id?: string; sort?: number; title?: string; numOfPages?: number; public constructor(init?: Partial<Section>) { Object.assign(this, init); } } 
```

## Update BookCard[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#update-bookcard)

### Key MaterialUI Components[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#key-materialui-components)

- CardActionArea: [https://material-ui.com/api/card-action-area/](https://material-ui.com/api/card-action-area/)
- Card: [https://material-ui.com/api/card/](https://material-ui.com/api/card/)
- CardActions: [https://material-ui.com/api/card-actions/](https://material-ui.com/api/card-actions/)
- CardContent: [https://material-ui.com/api/card-content/](https://material-ui.com/api/card-content/)
- CardMedia: [https://material-ui.com/api/card-media/](https://material-ui.com/api/card-media/)
- Collapse: [https://material-ui.com/api/collapse/](https://material-ui.com/api/collapse/)

> Not technically MaterialUI Component but it helps a lot clsx: [https://github.com/lukeed/clsx](https://github.com/lukeed/clsx)

### Key Next.js Components[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#key-nextjs-components)

- Link: [https://nextjs.org/docs#with-link](https://nextjs.org/docs#with-link)

> Please note I chose to use the name NextLink, as it was confusing with other link components at the time.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#full-code)

There is a lot of code here to digest, please take the time to click the links above and dive into those components so you know why they are used.

```
import { CardActionArea } from '@material-ui/core'; import Card from '@material-ui/core/Card'; import CardActions from '@material-ui/core/CardActions'; import CardContent from '@material-ui/core/CardContent'; import CardMedia from '@material-ui/core/CardMedia'; import Collapse from '@material-ui/core/Collapse'; import IconButton from '@material-ui/core/IconButton'; import { makeStyles } from '@material-ui/core/styles'; import Typography from '@material-ui/core/Typography'; import ExpandMoreIcon from '@material-ui/icons/ExpandMore'; import clsx from 'clsx'; import NextLink from 'next/link'; import React from 'react'; const useStyles = makeStyles(theme => ({ card: { minWidth: 400, margin: 5, display: 'flex', flexDirection: 'column' }, cardContent: { display: 'flex', flex: '1 0 auto', flexDirection: 'column' }, cardMedia: { height: 0, paddingTop: '65%', backgroundRepeat: 'no-repeat', backgroundSize: 'auto', cursor: 'pointer' }, cardDescription: { width: 368, height: 190, overflow: 'auto' }, cardActions: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, expand: { transform: 'rotate(0deg)', marginLeft: 'auto', transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }) }, expandOpen: { transform: 'rotate(180deg)' } })); const BookCard = ({ book }: any) => { const classes = useStyles(); const [expanded, setExpanded] = React.useState(false); const handleExpandClick = () => { setExpanded(!expanded); }; return ( <Card className={classes.card}> <NextLink href="/"> <CardActionArea> <CardMedia className={classes.cardMedia} image="/static/images/cards/book.webp" title={book.title} /> <CardContent className={classes.cardContent}> <Typography variant="h3" component="h1"> {book.title} </Typography> <Typography component="p"> Author: { ${book.authorDisplayName}} </Typography> </CardContent> </CardActionArea> </NextLink> <CardActions className={classes.cardActions}> Summary: <IconButton className={clsx(classes.expand, { [classes.expandOpen]: expanded })} onClick={handleExpandClick} aria-expanded={expanded} aria-label="Show more" > <ExpandMoreIcon /> </IconButton>{' '} </CardActions> <Collapse in={expanded} timeout="auto" unmountOnExit> <CardContent className={classes.cardContent}> <Typography paragraph className={classes.cardDescription}> {book.description} </Typography> </CardContent> </Collapse> </Card> );- }; export default BookCard; 
```

Notice how the `<CardActionArea>` is surrounded by the `<NextLink>`, this makes a very nice clickable section at the top of our Book Card. MaterialUI does a really nice job with subtle touches like this, I am really digging it!!

![Action Area Highlight](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/5-Firebase/Screen_Shot_2019-08-29_at_4.05.40_PM.png)

There are some downsides (mostly from my inexperience), with things like the CardAction and how the Flexbox is working. Notice in this video that when expanded all cards grow, but only the one you select shows text.

## Update books Page[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#update-books-page)

### What is RxFire[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#what-is-rxfire)

[RxFire Intro Blog](https://firebase.googleblog.com/2018/09/introducing-rxfire-easy-async-firebase.html) I have two demos currently on how you can use this wonderful javascript package to get streams from Firestore. I have heard that their is an RxFire specific to ReactJS that is coming out soon too.

1. [RxFire in Svelte 3](https://ajonp.com/lessons/rxfire-in-svelte-3-using-firebase-firestore-and-authentication/)
2. [RxFire in ReactJS](https://ajonp.com/lessons/rxfire-in-reactjs-using-firebase-firestore-and-authentication/)

`collectionData` Returns a stream of documents mapped to their data payload, and optionally the document ID. You provide `bookId` so that it does return the ID. Now anytime the books collection in Firestore is updated the observable streams this to our application.

### Key RxFire Components[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#key-rxfire-components)

- collectionDate: [https://github.com/firebase/firebase-js-sdk/blob/master/packages/rxfire/README.md#example-use](https://github.com/firebase/firebase-js-sdk/blob/master/packages/rxfire/README.md#example-use)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#full-code)

You are going to finally add some "real" logic to one of our pages. The key here is the introduction of Firebase.

1. Use `await loadFirebase();` so that we wait for the firebase package to finish loading.
2. Then aquire a reference to the collections in Firestore `const booksRef = firebase.firestore().collection('books');`.
3. Setup an [Observable](https://rxjs-dev.firebaseapp.com/guide/observable) that a [Subscription](https://rxjs-dev.firebaseapp.com/api/index/class/Subscription) can be setup to listen to any changes. This is where the power of RxFire shines. Any time we see an update coming we will simple update the current state with an array of books.
4. For each of the books we will then use the BookCard Component and populate the data to show on the screen.

```
<Grid container direction="row" justify="center"> {this.state.books.map((book: Book) => { return <BookCard book={book} key={book.id} />; })} </Grid> 
```

/pages/books.tsx

```
import Grid from '@material-ui/core/Grid'; import React, { Component } from 'react'; import { collectionData } from 'rxfire/firestore'; import BookCard from '../components/BookCard'; import loadFirebase from '../lib/firebase'; import Book from '../models/Book'; export default class Books extends Component { state: { books: Book[] } = { books: [] }; async componentDidMount() { const firebase = await loadFirebase(); const booksRef = firebase.firestore().collection('books'); collectionData(booksRef, 'bookId').subscribe(books => { this.setState({ books }); }); } render() { return ( <Grid container direction="row" justify="center"> {this.state.books.map((book: Book) => { return <BookCard book={book} key={book.id} />; })} </Grid> ); } } 
```

## Theme Update(optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#theme-updateoptional)

I decided my eyes were hurting at this point so I switched the theme file to have a dark type and included deepPurple as primary and pink as secondary. Feel free to change as much or as little as you want! I could probably do a full course on [MaterialUI Theming](https://material-ui.com/customization/theming/), and who knows maybe I will ????.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#full-code)

```
import deepPurple from '@material-ui/core/colors/deepPurple'; import pink from '@material-ui/core/colors/pink'; import red from '@material-ui/core/colors/red'; import { createMuiTheme } from '@material-ui/core/styles'; // Create a theme instance. const theme = createMuiTheme({ palette: { type: 'dark', primary: deepPurple, secondary: pink, error: { main: red.A400 } } }); export default theme; 
```

### Analyze Bundle(optional)[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-firestore-modeling#analyze-bundleoptional)

Please take the time to checkout why it is important that we load Firebase using an `await import` statement instead of just declaring it as a `const`;

> If you get to the end and something is broken just grab the full branch

```
git checkout 05-Firebase -f && npm i
```
