---
title: 'SSR Part 2'
date: '2020-09-16'
---

https://youtu.be/XfOaUonBTsk?t=5938

> You must have [Node](https://nodejs.org/en/download/) installed so you can leverage npm.  
> This module is part of a series if you would like to start from here please execute

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git && cd ajonp-ajsbooks-nextjs && git checkout 07-Book-Navigation && npm i && code .
```

> If you notice any issues please submit a [pull request](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/pulls).

# Book Page - SSR #2

> I fully admit that this is an *ADVANCED* course, but I would love any suggestions or pull requests to make it easier!

## Update firebase.json[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#update-firebasejson)

It is very important to understand what is happening in this file. You are telling Firebase Hosting how to direct traffic:

- `/book/**` path -> towards a Cloud Function called `book`.
- `/books` path -> towards a Cloud Function called `books`.

- `**/**` Notice how we have removed the full glob path.

These cloud functions will be found in our `dist/functions` directory.[/firebase.json](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/07-Book-Navigation/firebase.json)

### Full code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

```
{ "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" }, "functions": { "source": "dist/functions" }, "hosting": [ { "public": "dist/public", "target": "ajsbooks-nextjs", "ignore": ["firebase.json", "**/.*", "**/node_modules/**"], "rewrites": [ { "source": "/books", "function": "books" }, { "source": "/book{,/**}", "function": "book" } ] } ], "storage": { "rules": "storage.rules" } }
```

## Firebase Functions index.ts[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#firebase-functions-indexts)

There are three cloud functions referenced from the main file 1. api - This allows access to our Firebase backend to read book data 2. books - Lambda for list of books from `pages/books.tsx`. 3. book - Lamba for book details from `pages/book.tsx`.

## Main Firebase Cloud Function[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#main-firebase-cloud-function)

This allows you to tell Firebase where all of the exports are coming from to build the cloud functions from.

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

[/functions/src/index.ts](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/08-Book-Page/functions/src/index.ts)

```
import * as functions from 'firebase-functions'; import * as app from './api'; const onRequest = functions.https.onRequest; // These relative paths will exist after compiling everything // const index = require('./_next/serverless/pages/index'); //Removed as Next 9 only pushes static const books = require('./_next/serverless/pages/books'); const book = require('./_next/serverless/pages/book'); // These named exports will map to Firebase Function names // exports.index = onRequest((req, res) => index.render(req, res)); //Removed as Next 9 only pushes static exports.books = onRequest((req, res) => books.render(req, res)); exports.book = onRequest((req, res) => book.render(req, res)); // API exports.api = app.listener;
```

## Add api[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#add-api)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

[/functions/src/api/index.ts](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/08-Book-Page/functions/src/api/index.ts)

```
import * as cors from 'cors'; import * as express from 'express'; import * as admin from 'firebase-admin'; import * as functions from 'firebase-functions'; import BookModel from '../../../models/BookModel'; // Initialize Firebase Admin admin.initializeApp(); // Create Express App const app = express(); // Use cors middleware app.use(cors({ origin: true })); app.get('/book', async (req, res) => { const id = req.query.id; if (id) { console.log(Fetching ${id}); try { const bookRef = await admin .firestore() .collection('books') .doc(id) .get(); res.json(bookRef.data()); } catch (e) { console.log(e); return; } } else { res.status(403).send('Missing id'); return; } }); app.get('/books', async (req, res) => { try { const booksSnapshot = await admin .firestore() .collection('books') .get(); const books: BookModel[] = []; booksSnapshot.forEach(doc => { books.push(doc.data()); }); res.json(books); } catch (e) { console.log(e); return; } }); app.get('/chapter', async (req, res) => { const id = req.query.id; const chapterId = req.query.chapterId; if (id) { console.log(Fetching ${id}); try { const bookRef = await admin .firestore() .collection(books/${id}/chapters) .doc(chapterId) .get(); res.json(bookRef.data()); } catch (e) { console.log(e); return; } } else { res.status(403).send('Missing id'); return; } }); app.get('/page', async (req, res) => { const id = req.query.id; const chapterId = req.query.chapterId; const pageId = req.query.pageId; if (id) { console.log(Fetching ${id}); try { const bookRef = await admin .firestore() .collection(books/${id}/chapters/${chapterId}/pages) .doc(pageId) .get(); res.json(bookRef.data()); } catch (e) { console.log(e); return; } } else { res.status(403).send('Missing id'); return; } }); export const listener = functions.https.onRequest(app);
```

## Add BookDetail[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#add-bookdetail)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

[/components/BookDetail.tsx](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/08-Book-Page/components/BookDetail.tsx)

```
import { Avatar, Card, CardContent, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'; import { makeStyles } from '@material-ui/core/styles'; import Typography from '@material-ui/core/Typography'; import NextLink from 'next/link'; import React from 'react'; import Book from '../models/BookModel'; import Chapter from '../models/ChapterModel'; const useStyles = makeStyles(theme => ({ card: { width: '100%', maxWidth: 400, margin: 5, display: 'flex', flexDirection: 'column' }, list: { width: '100%', backgroundColor: theme.palette.background.paper } })); const BookDetail = (prop: { book: Book }) => { const classes = useStyles(); let listItems: any[] = []; if (prop.book && prop.book.chapters) { prop.book.chapters.map((chapter: Chapter) => { listItems.push( <NextLink href={/book?id=${prop.book.id}&chapterId=${chapter.id}} key={chapter.id} > <ListItem button> <ListItemAvatar> <Avatar alt={chapter.title} src={chapter.photo} /> </ListItemAvatar> <ListItemText primary={${chapter.number}. ${chapter.title}} /> </ListItem> </NextLink> ); }); } return ( <Card className={classes.card}> <CardContent> <Typography variant="h5" component="h1"> {prop.book.title} </Typography> <List className={classes.list} component="nav"> {listItems.map(item => { return item; })} </List> </CardContent> </Card> ); }; export default BookDetail;
```

## Add Chapter Detail[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#add-chapter-detail)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

[/components/ChapterDetail.tsx](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/08-Book-Page/components/ChapterDetail.tsx)

```
import { Button, Card, CardContent } from '@material-ui/core'; import { makeStyles } from '@material-ui/core/styles'; import Typography from '@material-ui/core/Typography'; import NextLink from 'next/link'; import React from 'react'; import BookModel from '../models/BookModel'; import Chapter from '../models/ChapterModel'; import PageModel from '../models/PageModel'; const useStyles = makeStyles(() => ({ card: { width: '100%', maxWidth: 400, margin: 5, display: 'flex', flexDirection: 'column' }, button: { margin: 2 } })); const ChapterDetail = (prop: { book: BookModel; chapter: Chapter }) => { const classes = useStyles(); let listItems: any[] = []; if (prop.chapter && prop.chapter.pages) { prop.chapter.pages.map((page: PageModel) => { listItems.push( <NextLink href={/book?id=${prop.book.id}&chapterId=${prop.chapter.id}&pageId=${ page.id }} key={page.id} > <Button variant="contained" color="secondary" className={classes.button} > {page.number} </Button> </NextLink> ); }); } return ( <Card className={classes.card}> <CardContent> <Typography variant="h5" component="h1"> {prop.chapter.title} Pages: </Typography> {listItems.map(item => { return item; })} </CardContent> </Card> ); }; export default ChapterDetail;
```

## Add Book Page[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#add-book-page)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-ssr-part-2#full-code)

[/components/BookPage.tsx](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/blob/08-Book-Page/components/BookPage.tsx)

```
import Paper from '@material-ui/core/Paper'; import { makeStyles } from '@material-ui/core/styles'; import Typography from '@material-ui/core/Typography'; import React from 'react'; import PageModel from '../models/PageModel'; const useStyles = makeStyles(theme => ({ root: { width: '100%', maxWidth: 400, margin: 5, display: 'flex', flexDirection: 'column', padding: theme.spacing(3, 2) } })); const BookPage = (prop: { page: PageModel }) => { const classes = useStyles(); let page; if (prop.page && prop.page.text) { page = <Typography component="p">{prop.page.text}</Typography>; } else { page = <Typography component="p">Please select a Chapter</Typography>; } return ( <div> <Paper className={classes.root}>{page}</Paper> </div> ); }; export default BookPage;
```
