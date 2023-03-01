---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1609704484/main-codingcatdev-photo/courses/Angular%20Material/z20eakfncqk5iyshaiek.png
excerpt: Reactive Forms Showing how to update the form based on updates to data.
published: published
slug: angular-material-reactive-forms-update-firestore
start: June 1, 2022
title: Angular Material Reactive Forms Update Firestore
weight: 6
youtube: https://youtu.be/92hYB6jivvQ
---
## Setup

We can start from the previous lesson and build out our reactive forms. Previous Lesson: [Angular Material Forms Firestore](https://github.com/AJONPLLC/lesson12-angular-material-forms-firestore)

```bash
git clone <https://github.com/AJONPLLC/lesson12-angular-material-forms-firestore>

```

This will give us a solid base to start working from, however if you are creating a new firebase project you should change the environment/environment.ts file to match your firebase details. If you have never done this please see [Angular Navigation Firestore](https://ajonp.com/courses/angularmaterial/angular-material-dynamic-navigation-using-firestore) as this will provide more details on how to update.Make sure you update your npm packages

```bash
npm install
```

# Update Book Model

Navigate to src/app/core/models/book.ts so that we can update more details about the books that we will be adding and editing in the tutorial.You will notice a big change instead of using this as an interface which only allows for typing, using the class will allow us to create new objects based on our definition of Book. I really enjoy Todd Moto's description of this the most in [Classes vs Interfaces in Typescript](https://ultimatecourses.com/blog/classes-vs-interfaces-in-typescript).You can see here that we have also provided a constructor that allows for a Partial Book type to be provided that assigns this as a new book, without requiring a full object. You can read more about Partial [here](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html). The Object assign will copy the values of all of the enumerable own properties from one or more source objects to a target object and returns the target object, which in our case will return a Book object.src/app/core/models/book.ts

```tsx
import { Timestamp } from '@firebase/firestore-types';

export class Book {
    ageCategory?: string;
    description?: string;
    fiction?: boolean;
    genre?: string;
    hasAudio?: boolean;
    hasPhotos?: boolean;
    hasVideos?: boolean;
    id?: string;
    publishDate?: Timestamp | Date;
    rating?: number;
    status?: string;
    title?: string;

    public constructor(init?: Partial<Book>) {
        Object.assign(this, init);
    }
}

```

# Firestore Current Book Value to Form

## Subscribing to book from Id

> Please note later I have updated the array push method of unsubscribing to a Subject and used takeUntil(this.unsubscribe$).
> 

What we are doing here in the first part of the ngOnInit is subscribing to the router and getting our specified `bookId` and setting the global variable to store this off so that we can use this ID to fetch data about the current book.src/app/modules/books/book-edit/book-edit.component.ts

```tsx
bookId: string;
...

ngOnInit() {
    // Get bookId for book document selection from Firestore
    this.subs.push( this.route.paramMap.subscribe(params => {
        this.bookId = params.get('bookId');
        this.rebuildForm();
    }));
}

```

## Building (or rebuilding) Angular Form

We can then use this to call the method `rebuildForm()` which will update any of the required bindings on our Angular Form. If we break down this method we can see that there is a line that sets the blobal `book$` variable Observable. Don't be confused by the `this.subs.push` you could even leave this out just for sake of the learning exercise (I would leave something to unsubsribe for a production app though).Next we have `this.book$.pipe(map(book` in which we are changing the `book.publishDate` which is a `Timestamp` over to a Javascript DateTime. This is necessary as our Angular Component is expecting this format.src/app/modules/books/book-edit/book-edit.component.ts

```tsx
bookForm: FormGroup;
book$: Observable<Book>;

...

rebuildForm() {
    if (this.bookForm) {
        this.bookForm.reset();
    }

    this.book$ = this.fs.getBook(this.bookId);
    this.subs.push(
        this.book$.pipe(
            map(book => {
                console.log(book.publishDate);
                if (book.publishDate) {
                    const timestamp = book.publishDate as Timestamp;
                    book.publishDate = timestamp.toDate();
                }
                return book;
            })
        ).subscribe(book => {
            this.bookForm = this.fb.group({
                ageCategory: [book.ageCategory, Validators.required],
                description: [ book.description, [Validators.required, Validators.maxLength(500)] ],
                fiction: [book.fiction || false, Validators.required],
                genre: [book.genre, Validators.required],
                asAudio: [book.hasAudio],
                hasPhotos: [book.hasPhotos],
                hasVideos: [book.hasVideos],
                id: [book.id],
                publishDate: [book.publishDate],
                rating: [book.rating, Validators.required],
                status: [book.status, Validators.required],
                title: [book.title, [Validators.required, Validators.maxLength(50)]]
            });
        })
    );
}

```

### Form Control using Form Builder

We also subscribe to the Observable coming from Firestore using `this.book$.subscribe(book` in which we setup the global variable `bookForm` with the values coming from Firestore. We use the dependency injected [Form Builder](https://angular.io/guide/form-validation#adding-to-reactive-forms)`private fb: FormBuilder` or `fb` to create a form group with all of the necessary form [controls.In](http://controls.in/) our form we can then reference these controls, for instance `ageCategory: [book.ageCategory, Validators.required],` ageCategory is now a FormControl that has a default value from Firestore of `book.ageCategory` and it is also a required field based on `Validators.required`.You can see here that we then use `formControlName="ageCategory"` in order to link that form control based on the name.

```html
<mat-select placeholder="Age Category" formControlName="ageCategory" >
```

Some of the more interesting use cases for FormControl validation is with something like `title: [book.title, [Validators.required, Validators.maxLength(50)]]` which says our title cannot be longer than 50. Just a reminder this is all front end based, so someone could maliciously still add a longer book.title, so you need to make sure if this is a hard requirement that you adjust your firestore.rules accordingly.

```html
<input matInput placeholder="Title" formControlName="title" />
```

### Form Field Errors

Like magic (okay programming), if a fields validation is incorrect you will see an error appear.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/sr7u3gojyeztganortmm.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/sr7u3gojyeztganortmm.png)

This is handled via html with component `mat-error` this must be inside of `mat-form-field` like all of the Angular Material Form components. In our case we are showing two messages for title it is blank we show required, then if it is in error and not currently required we show that max length of 50.

```html
<mat-form-field style="width: 100%">
    <input matInput placeholder="Title" formControlName="title" />
    <mat-error *ngIf="!bookForm.get('title').hasError('required')">
        Title has a max length of 50.
    </mat-error>
    <mat-error *ngIf="bookForm.get('title').hasError('required')">
        Title is <strong>required</strong>
    </mat-error>
</mat-form-field>
```

### Form Submit Only Pristine

Some of the logic here looks a little backwards but because we are disabling the buttons everything is applied in reverse. For cancel we only care if data was changed so we check for `pristine` (entered data), for the submit button data must be pristine and also valid. Meaning none of the Validators can be false, like required and length.Before Data Entered, we only have option to cancel.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/u2cngx79xvpu9h1hfybp.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/u2cngx79xvpu9h1hfybp.png)

After Data Entered if invalid we can only revert.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/jafwiibebcbqn7digvhe.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/jafwiibebcbqn7digvhe.png)

Finally good data we can save.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/fqqrn4hsnytvcadwag51.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/12-angular-material-from-firestore/fqqrn4hsnytvcadwag51.png)

## Submit and Save data

Once all the data is pristine and valid we can then push SAVE.

```html
<button
    mat-raised-button
    color="primary"
    type="submit"
    [disabled]="bookForm.pristine || !bookForm.valid"
    aria-label="Save"
>
Save
</button>

```

This button is within the form component and has this method being called `(ngSubmit)="saveBookChanges()"`.

```html
<form *ngIf="bookForm" [formGroup]="bookForm" (ngSubmit)="saveBookChanges()" fxLayout="column" >

```

When this calls the method `saveBookChanges` it will call the firestore updateBook `await this.fs.updateBook(book);` in which it waits before navigating back to the main books list. This is also where you could throw up a saving dialog before the await statement.You will notice the first thing that we did was create the `Book` class, this is where it becomes hugely valuable. We can directly pass the `bookForm.value` and it will create a new `Book` Object to make the update!

```tsx
async saveBookChanges() {
    const book = new Book(this.bookForm.value);
    await this.fs.updateBook(book);
    this.router.navigate(['/books', this.bookId]);
}
```

# Video

I think the [video](https://youtu.be/92hYB6jivvQ) for this lesson is the best guide, don't forget to put those breakpoints in to see what is happening in all the calls, and open up Firestore to watch it auto update.