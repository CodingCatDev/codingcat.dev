---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1609704326/main-codingcatdev-photo/courses/Angular%20Material/sfpbcnbqvqj6udq4rb1r.png
published: published
slug: angular-material-dynamic-navigation-using-firestore
start: June 1, 2022
title: Angular Material Dynamic Navigation using Firestore
weight: 5
youtube: https://youtu.be/sZoiLcq7N6Q
---
[Demo](https://ajonp-lesson-11.firebaseapp.com/books/)The goal of this lesson is to take our [Angular Material Theming](https://ajonp.com/courses/angularmaterial/angular-material-theming) and add navigational elements. The two for this lesson will include [Angular Material Tree](https://material.angular.io/components/tree/overview) and [Angular Material Expansion Panel](https://material.angular.io/components/expansion/overview)If you are well versed in Firebase and are just wondering how to get this tree to work with Firestore, you might want to jump to Tree

## Lesson Steps

1. Project Setup
2. Firestore
3. Router Updates
4. Component Updates

# Project Setup

## Create Firebase Project

Angular Firebase has an amazing guide for this [Beginners Guide to Firebase](https://angularfirebase.com/lessons/the-ultimate-beginners-guide-to-firebase/), so you could check that out as well.

> You will need a Google Account
> 

Please navigate to [Firebase Console](https://console.firebase.google.com/) here you can create a new project with any name that you would like. Once inside of your new project please create a firestore database, under the `Database` tab.When prompted select `locked mode`.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548346547/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/krp63uw43udiq94ndkrw.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548346547/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/krp63uw43udiq94ndkrw.png)

## GitHub Lesson 10 clone

For our starter template we will use our previes lesson repo, make sure you are in a directory you would like to place the repo locally and begin [work.In](http://work.in/) your terminal, clone the repo to a new folder

```bash
git clone <https://github.com/AJONPLLC/lesson-10-angular-material-theming.git> lesson-11

```

Remove the old origin

```bash
git remote rm origin

```

You can then add your own git repo if you would like, or just track changes locally. Add remote

```bash
git remote add origin -yourgiturl-

```

## Add firebase

> If you have not yet downloaded firebase CLI please install npm install -g firebase-tools.
> 

After install

```bash
firebase login

```

Now we will initialize this project

```bash
firebase init

```

Make sure to select Firestore, and accept all other defaults

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548346992/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/x7r97se1ymusolimrtfz.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548346992/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/x7r97se1ymusolimrtfz.png)

You will then need to add firebase to your project, again please checkout the link from above how to do this, of follow the video.

# Firestore

## Firestore Service Creation

> If you don't have the Angular CLI npm install -g @angular/cli.
> 

Using the Angular CLI we will start by creating a service.

```bash
ng g service core/services/firestore

```

This service will allow us to connect to Firebase Firestore.

## Firestore Database Setup

We want to build this structure inside of Firestore

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548347396/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/books_hierarchy.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1548347396/ajonp-ajonp-com/11-lesson-angular-navigation-firestore/books_hierarchy.png)

In Firestore we will setup this basic structure. Remember every collection must have a document. You can find more in the [Firestore Docs Overview](https://cloud.google.com/firestore/docs/overview)

## Add Angular Firebase Service

This service was somthing that was created by Jeff in [Advanced Firestore Usage Guide with Angular](https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/)

```bash
ng g service core/services/angularfirebase

```

Code

```tsx
import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreDocument,
    AngularFirestoreCollection,
    DocumentChangeAction,
    Action,
    DocumentSnapshotDoesNotExist,
    DocumentSnapshotExists
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, tap, take, mergeMap, expand, takeWhile, finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({ providedIn: 'root' })

export class AngularfirebaseService {
    constructor(public aFirestore: AngularFirestore, public aFireStorage: AngularFireStorage) { }
    /// ************** /// Get a Reference /// **************
    col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
        return typeof ref === 'string' ? this.aFirestore.collection<T>(ref, queryFn) : ref;
    }
    doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
        return typeof ref === 'string' ? this.aFirestore.doc<T>(ref) : ref;
    }
    /// ************** /// Get Data /// **************
    doc$<T>(ref: DocPredicate<T>): Observable<T> {
        return this.doc(ref).snapshotChanges().pipe(
            map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
                return doc.payload.data() as T;
            })
        );
    }
    col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
        return this.col(ref, queryFn).snapshotChanges().pipe(
            map((docs: DocumentChangeAction<T>[]) => {
                return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
            })
        );
    }
    /// with Ids
    colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
        return this.col(ref, queryFn).snapshotChanges().pipe(
            map((actions: DocumentChangeAction<T>[]) => {
                return actions.map((a: DocumentChangeAction<T>) => {
                    const data: Object = a.payload.doc.data() as T;
                    const id = a.payload.doc.id; return { id, ...data };
                });
            })
        );
    }
    /// ************** /// Write Data /// **************
    /// Firebase Server Timestamp get
    timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }
    set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const timestamp = this.timestamp;
        return this.doc(ref).set({ ...data, updatedAt: timestamp, createdAt: timestamp });
    }
    update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        return this.doc(ref).update({ ...data, updatedAt: this.timestamp });
    }
    delete<T>(ref: DocPredicate<T>): Promise<void> {
        return this.doc(ref).delete();
    }
    add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
        const timestamp = this.timestamp;
        return this.col(ref).add({ ...data, updatedAt: timestamp, createdAt: timestamp });
    }
    geopoint(lat: number, lng: number): firebase.firestore.GeoPoint {
        return new firebase.firestore.GeoPoint(lat, lng);
    }
    /// If doc exists update, otherwise set
    upsert<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const doc = this.doc(ref).snapshotChanges().pipe(take(1)).toPromise();
        return doc.then((snap: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
            return snap.payload.exists ? this.update(ref, data) : this.set(ref, data);
        });
    }
    /// ************** /// Inspect Data /// **************
    inspectDoc(ref: DocPredicate<any>): void {
        const tick = new Date().getTime();
        this.doc(ref).snapshotChanges().pipe(
            take(1),
            tap((d: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<any>>) => {
                const tock = new Date().getTime() - tick; console.log(Loaded Document in ${ tock }ms, d);
            })).subscribe();
    } inspectCol(ref: CollectionPredicate<any>): void { const tick = new Date().getTime(); this.col(ref).snapshotChanges().pipe(take(1), tap((c: DocumentChangeAction<any>[]) => { const tock = new Date().getTime() - tick; console.log(Loaded Collection in ${ tock }ms, c); })).subscribe(); }
    /// ************** 
    /// Create and read doc references 
    /// ************** 
    /// create a reference between two documents 
    connect(host: DocPredicate<any>, key: string, doc: DocPredicate<any>) { return this.doc(host).update({ [key]: this.doc(doc).ref }); }
    /// returns a documents references mapped to AngularFirestoreDocument 
    docWithRefs$<T>(ref: DocPredicate<T>) { return this.doc$(ref).pipe(map((doc: T) => { for (const k of Object.keys(doc)) { if (doc[k] instanceof firebase.firestore.DocumentReference) { doc[k] = this.doc(doc[k].path); } } return doc; })); }
    /// ************** 
    /// Atomic batch example 
    /// ************** 
    /// Just an example, you will need to customize this method. 
    atomic() {
        const batch = firebase.firestore().batch();
        /// add your operations here 
        const
            itemDoc = firebase.firestore().doc('items/myCoolItem');
        const userDoc = firebase.firestore().doc('users/userId'); const currentTime = this.timestamp; batch.update(itemDoc, { timestamp: currentTime }); batch.update(userDoc, { timestamp: currentTime });
        /// commit operations 
        return batch.commit();
    }
    /** * Delete a collection, in batches of batchSize. Note that this does 
     * * not recursively delete subcollections of documents in the collection 
     * * from: <https://github.com/AngularFirebase/80-delete-firestore-collections/blob/master/src/app/firestore.service.ts> */
    deleteCollection(path: string, batchSize: number): Observable<any> {
        const source = this.deleteBatch(path, batchSize);
        // expand will call deleteBatch recursively until the collection is deleted 
        return source.pipe(expand(val => this.deleteBatch(path, batchSize)), takeWhile(val => val > 0));
    }
    // Detetes documents as batched transaction private 
    deleteBatch(path: string, batchSize: number): Observable<any> {
        const colRef = this.aFirestore.collection(path, ref => ref.orderBy('__name__').limit(batchSize)); return colRef.snapshotChanges().pipe(take(1), mergeMap((snapshot: DocumentChangeAction<{}>[]) => {
            // Delete documents in a batch 
            const batch = this.aFirestore.firestore.batch(); snapshot.forEach(doc => { batch.delete(doc.payload.doc.ref); }); return from(batch.commit()).pipe(map(() => snapshot.length));
        }));
    }
}
```

## Update Firstore Service

```tsx
import { Author } from './../models/author';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { switchMap } from 'rxjs/operators';
import { AngularfirebaseService } from './angularfirebase.service';
import { Chapter } from '../models/chapter';
import { Section } from '../models/section';
import { Graphicnovel } from '../models/graphicnovel';

@Injectable({ providedIn: 'root' })

export class FirestoreService {
    constructor(private afb: AngularfirebaseService) { }
    // Books
    getBooks(): Observable<Book[]> {
        // Start Using AngularFirebase Service!!
        return this.afb.colWithIds$<Book[]>('books');
    }
    getBook(bookId: string): Observable<Book> {
        // Start Using AngularFirebase Service!!
        return this.afb.doc$<Book>(books / ${ bookId });
    }
    // Chapters 
    getBookChapters(bookId: string): Observable<Chapter[]> { return this.afb.colWithIds$<Chapter[]>(books / ${ bookId } / chapters); } getBookChapter(bookId: string, chapterId: string): Observable<Chapter> {
        // Start Using AngularFirebase Service!! 
        return this.afb.doc$<Chapter>(books / ${ bookId } / chapters / ${ chapterId });
    }
    // Sections 
    getBookSections(bookId: string, chapterId: string): Observable<Section[]> {
        return this.fs.collection('books').doc(bookId).collection('chapters').doc(chapterId).collection('sections').valueChanges();
        return this.afb.colWithIds$<Section[]>(books / ${ bookId } / chapters / ${ chapterId } / sections);
    }
    getBookSection(bookId: string, chapterId: string, sectionId: string): Observable<Section> {
        // Start Using AngularFirebase Service!! 
        return this.afb.doc$<Section>(books / ${ bookId } / chapters / ${ chapterId } / sections / ${ sectionId });
    }
    // Get Authors 
    getAuthors(): Observable<Author[]> {
        // Start Using AngularFirebase Service!! 
        return this.afb.colWithIds$<Author[]>('authors');
    }
    // Graphic Novels 
    getGraphicNovels(): Observable<Graphicnovel[]> {
        // Start Using AngularFirebase Service!! 
        return this.afb.colWithIds$<Graphicnovel[]>('graphicnovels');
    }
	}
```

# Router Updates

The following routes are setup in order of which they will lazy load and be traversed to display the books path.

## App Router

Need to update the main router to reference booksapp-routing.module.ts

```tsx
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'welcome',
        loadChildren: './modules/welcome/welcome.module#WelcomeModule'
    },
    {
        path: 'books',
        loadChildren: './modules/books/books.module#BooksModule'
    },
    { path: 'kitchensink', loadChildren: './modules/kitchensink/kitchensink.module#KitchensinkModule' },
    { path: '', redirectTo: '/books', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)], exports: [RouterModule]
})
export class AppRoutingModule { }

```

## Book Top Level Router

In our updated setup for our book router we need to lazy load the book list (for all of our books), as well as the book detail (for a single book).books-routing.modules.ts

```tsx
import { BooksComponent } from './books.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: BooksComponent,
        children: [
            { path: '', loadChildren: './book-list/book-list.module#BookListModule' },
            { path: ':bookId', loadChildren: './book-detail/book-detail.module#BookDetailModule' }
        ]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BooksRoutingModule { }

```

## Book Detail Router

Remember this is where we added the named outlet in the last lesson `book-drawer`. This component is where we will focus on loading our new tree.

```tsx
import { BookDrawerComponent } from './../book-drawer/book-drawer.component';
import { BookDetailComponent } from './book-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', component: BookDetailComponent },
    { path: '', component: BookDrawerComponent, outlet: 'book-drawer' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookDetailRoutingModule { }

```

# Component Updates

Now that we have all the plumbing set we can add a new component to our `book-drawer` component.

## Create book-list

We need to first be able to select a book before navigating to the book detail. For this we will create a book-list module.

```bash
ng g m modules/books/book-list && ng g c modules/books/book-list

```

### Expansion Panel for book-list

```html
<mat-accordion [displayMode]="'flat'">
    <mat-expansion-panel [expanded]="rlaBooks.isActive">
        <mat-expansion-panel-header>
            <mat-panel-title routerLink="/books" routerLinkActive="active-link" (click)="$event.stopPropagation()"
                #rlaBooks="routerLinkActive">Books</mat-panel-title>
        </mat-expansion-panel-header>
        <mat-nav-list class="nav-links"> <a mat-list-item [routerLink]="['/books', book.id]"
                routerLinkActive="active-link" *ngFor="let book of (bookList | async)">
                <h4 matLine>{{ book.title }}</h4>
            </a> </mat-nav-list>
    </mat-expansion-panel>
    <mat-expansion-panel>
        <mat-expansion-panel-header>
            <mat-panel-title>Graphic Novels</mat-panel-title>
        </mat-expansion-panel-header>
        <mat-nav-list class="nav-links"> <a mat-list-item [routerLink]="['/graphicnovels', gn.id]"
                routerLinkActive="active-link" *ngFor="let gn of (graphicNovelList | async)">
                <h4 matLine>{{ gn.title }}</h4>
            </a> </mat-nav-list>
    </mat-expansion-panel>
    <mat-expansion-panel>
        <mat-expansion-panel-header>
            <mat-panel-title (click)="$event.stopPropagation()">Authors</mat-panel-title>
        </mat-expansion-panel-header>
        <mat-nav-list class="nav-links"> <a mat-list-item [routerLink]="['/authors', author.id]"
                routerLinkActive="active-link" *ngFor="let author of (authorList | async)">
                <h4 matLine>{{ author.name }}</h4>
            </a> </mat-nav-list>
    </mat-expansion-panel>
</mat-accordion>

```

### Populating the expansion panel

Use the firestore service to populate the Observables for each book.

```tsx
@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit {
    bookList: Observable<Book[]>;
    graphicNovelList: Observable<Graphicnovel[]>;
    authorList: Observable<Author[]>;

    constructor(private fs: FirestoreService, private router: Router) { }

    ngOnInit() {
        this.bookList = this.fs.getBooks();
        this.graphicNovelList = this.fs.getGraphicNovels();
        this.authorList = this.fs.getAuthors();
    }
}

```

## Create book-tree

```bash
ng g m modules/books/book-tree && ng g c modules/books/book-tree

```

```html
<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodePadding> <button mat-icon-button disabled></button> <button
            mat-button (click)="section(node)">{{ node.item }}</button> </mat-tree-node>
    <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding> <button mat-icon-button
            [attr.aria-label]="'toggle ' + node.filename" matTreeNodeToggle>
            <mat-icon class="mat-icon-rtl-mirror"> {{ treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right' }}
            </mat-icon>
        </button> {{ node.item }} <mat-progress-bar *ngIf="node.isLoading" mode="indeterminate"
            class="example-tree-progress-bar"></mat-progress-bar>
    </mat-tree-node>
</mat-tree>

```

I will break down this entire comopnent in further detail below, for now here is the code.

```tsx
import { Book } from 'src/app/core/models/book';
import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, merge, Subscription } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { map, tap, take } from 'rxjs/operators';
import { Chapter } from 'src/app/core/models/chapter';
import { Section } from 'src/app/core/models/section';
/** Flat node with expandable and level information */

export class DynamicFlatNode {
    constructor(
        public item: string,
        public level = 1,
        public expandable = false,
        public isLoading = false,
        public book?: Book,
        public chapter?: Chapter,
        public section?: Section
    ) { }
}

@Injectable() export class DynamicDataSource {
    dataChange = new BehaviorSubject<DynamicFlatNode[]>([]); bookTree = {};
    subscriptions: Subscription[] = [];
    get data(): DynamicFlatNode[] {
        return this.dataChange.value;
    }
    set data(value: DynamicFlatNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(
        private treeControl: FlatTreeControl<DynamicFlatNode>,
        private route: ActivatedRoute,
        private fs: FirestoreService,
        private router: Router) {

        /** Initial data from database */
        this.subscriptions.push(
            this.route.queryParams.subscribe(params => { console.log(params); })
        );
        this.subscriptions.push(
            this.route.paramMap.subscribe(paramMap => {
                const bookId = paramMap.get('bookId');
                this.fs.getBookChapters(bookId).subscribe(chapters => {
                    const nodes: DynamicFlatNode[] = [];
                    chapters.sort((a, b) => (a.sort < b.sort ? -1 : 1));
                    chapters.forEach(chapter => nodes.push(
                        new DynamicFlatNode(chapter.title, 0, true, false, { id: bookId }, chapter)
                    ));
                    this.data = nodes;
                });
            })
        );
    }
    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this.treeControl.expansionModel.onChange.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added || (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });
        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }
    /** Handle expand/collapse behaviors */
    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) { change.added.forEach(node => this.toggleNode(node, true)); }
        if (change.removed) {
            change.removed.slice().reverse().forEach(node =>
                this.toggleNode(node, false)
            );
        }
    }
    /** * Toggle the node, remove from display list */
    toggleNode(node: DynamicFlatNode, expand: boolean) {
        const index = this.data.indexOf(node);
        node.isLoading = true;
        if (expand) {
            this.subscriptions.push(
                this.fs.getBookSections(node.book.id, node.chapter.id).subscribe(async sections => {
                    console.log(sections);
                    const nodes: DynamicFlatNode[] = [];
                    sections.sort((a, b) => (a.sort < b.sort ? -1 : 1));
                    sections.forEach(section => nodes.push(new DynamicFlatNode(section.title, 1, false, false, node.book, node.chapter, section)));
                    this.data.splice(index + 1, 0, ...nodes);
                    this.dataChange.next(this.data);

                    // Update query params on current chapter
                    await this.router.navigate([], { relativeTo: this.route, queryParams: { chapterId: node.chapter.id }, queryParamsHandling: 'merge' });

                    // Remove any left over section params
                    await this.router.navigate([], { relativeTo: this.route, queryParams: { sectionId: '' }, queryParamsHandling: 'merge' });
                    node.isLoading = false;
                }));
        }
        else {
            let count = 0; for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++ , count++) { } this.data.splice(index + 1, count);
            // notify the change
            this.dataChange.next(this.data); node.isLoading = false;
        }
    }
}

@Component({
    selector: 'app-book-tree',
    templateUrl: './book-tree.component.html',
    styleUrls: ['./book-tree.component.scss']
})

export class BookTreeComponent implements OnInit, OnDestroy {
    treeControl: FlatTreeControl<DynamicFlatNode>;
    dataSource: DynamicDataSource;

    constructor(
        private route: ActivatedRoute,
        private fs: FirestoreService,
        private router: Router) {
        this.treeControl = new FlatTreeControl<DynamicFlatNode>(
            this.getLevel, this.isExpandable
        );
        this.dataSource = new DynamicDataSource(
            this.treeControl,
            this.route,
            this.fs,
            this.router
        );
    }

    ngOnInit() { }
    ngOnDestroy() {
        this.dataSource.subscriptions.forEach(s => { s.unsubscribe(); });
    }
    section(node: DynamicFlatNode) {
        // Update query params on current chapter
        this.router.navigate([], { relativeTo: this.route, queryParams: { sectionId: node.section.id }, queryParamsHandling: 'merge' });
    }
    getLevel = (node: DynamicFlatNode) => node.level;
    isExpandable = (node: DynamicFlatNode) => node.expandable;
    hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
}

```

### Reference book-tree inside book-drawer

We can now update `book-drawer`.book-drawer.component.html

```
<app-book-tree></app-book-tree>

```

Please make sure to also import `BookTreeModule` in `book-drawer.module.ts`.

```
... imports: [CommonModule, BookTreeModule], ...

```

# Tree

[Angular Material Tree](https://material.angular.io/components/tree/overview)

## Breaking down the dynamic Tree

There are two key directives that drive the dynamic tree `dataSource` and `treeControl`.

- dataSource: Provides a stream containing the latest data array to render. Influenced by the tree's stream of view window (what dataNodes are currently on screen). Data source can be an observable of data array, or a data array to render.
- treeControl: Controls layout and functionality of the visual tree.

book-tree.comopnent.html

```
<mat-tree [dataSource]="dataSource" [treeControl]="treeControl">

```

### dataSource

In our example we assign dataSource to a new object from class `DynamicDataSource`. This class is passed off the necessary dependency injected classes that we will need from our `BookTreeComponent`.

```
 this.dataSource = new DynamicDataSource( this.treeControl, this.route, this.fs, this.router );

```

### DynamicDataSource

The `DynamicDataSource's` main job is to get initial data for the setup of the tree, control the flow of any additional data, and react when the tree is toggled.The data type that we are using in our tree is defined by class `DynamicFlatNode`, this class holds the data that we use throughout our tree as an array. Maybe better put our Tree is made up of an Array of `DynamicFlatNode`.

```
export class DynamicFlatNode {
    constructor(
        public item: string,
        public level = 1,
        public expandable = false,
        public isLoading = false,
        public book?: Book,
        public chapter?: Chapter,
        public section?: Section
    ) {}
}

```

You can see in the first line of `DynamicDataSource` that we create a new BehaviorSubject for the array. This makes essentially an empty array for the tree's `dataSource`.

```
export class DynamicDataSource { dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

```

For our example we set the initial data for this by subscribing to our `bookId` and getting the corresponding book's chapters. You will notice that we create a `DynamicFlatNode` Object and add that to the array `nodes`. We then assign `DynamicDataSource`'s `data` property the array that we have created.

```
/** Initial data from database */
this.subscriptions.push(
    this.route.paramMap.subscribe(paramMap => {
        const bookId = paramMap.get('bookId');
        this.fs.getBookChapters(bookId).subscribe(chapters => {
            const nodes: DynamicFlatNode[] = [];
            chapters.sort((a, b) => (a.sort < b.sort ? -1 : 1));
            chapters.forEach(chapter => nodes.push(
                new DynamicFlatNode(
                    chapter.title,
                    // chapter
                    title 0,
                    // Tree Level
                    true,
                    // Expandable
                    false,
                    // Is Loading
                    { id: bookId },
                    // Object representing book
                    chapter
                    // Object for our current Chapter from firestore
                )));
            this.data = nodes;
        });
    }));

```