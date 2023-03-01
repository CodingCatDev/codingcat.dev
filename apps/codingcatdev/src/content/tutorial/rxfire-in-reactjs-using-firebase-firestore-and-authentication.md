---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1616429614/main-codingcatdev-photo/q6a6amtmdfsobeguruak.png
devto: https://dev.to/codingcatdev/rxfire-in-reactjs-using-firebase-firestore-and-authentication-3ao
excerpt: Introduction to Create React App, Firebase, and RxFire. RxFire provides a set of observable creation methods. You simply call a function with some parameters to receive an RxJS observable. With that observable in hand you can use any operators provided by RxJS to transform the stream as you like.
hashnode: https://hashnode.codingcat.dev/tutorial-rxfire-in-reactjs-using-firebase-firestore-and-authentication
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=rxfire-in-reactjs-using-firebase-firestore-and-authentication&_id=3d9f19153a324ba1b0864c4b1d7434b7
published: published
slug: rxfire-in-reactjs-using-firebase-firestore-and-authentication
start: May 23, 2022
title: RxFire in ReactJS using Firebase Firestore and Authentication
youtube: https://youtu.be/hTzcRCAm5e0
---

[RxFire](https://github.com/firebase/firebase-js-sdk/tree/master/packages/rxfire) was created by [David East](https://twitter.com/_davideast), who is a Firebase Developer Advocate. Although [Firebase Blog](https://firebase.googleblog.com/2018/09/introducing-rxfire-easy-async-firebase.html) introduced RxFire in September, 2018 I thought it would be a good point of reference for beginners starting out with both [ReactJs](https://reactjs.org/) and [Firebase](https://www.firebase.com/).For those coming from an Angular background you might be familiar with [RxJS](https://github.com/ReactiveX/rxjs) and the [Angularfire2](https://github.com/angular/angularfire2) package. I know from my experience you *MUST* learn RxJS if you are going to use Angular on any size application. It can be one of the hardest parts to learn but there are several fantastic tutorials and sites dedicated to how RxJS works.Some of my favorites

New to React, Please checkout

## Example

In the example below it shows a quick preview of how the final React application will work. As you can see there are essentiall 4 steps that will occur.

1. Sign In
2. Add Cat Fact
3. Show Added Cat Fact in List
4. Sign Out

## Setup

You will need [NPM](https://nodejs.org/en/download/) which comes bundled with nodejs.Since we wil be the `create-react-app` cli you must install this first

You will also need to create your own Firebase project and initialize a Firestore database, please create this using strict mode.

## Final App Structure

![https://media.codingcat.dev/image/upload/v1657636623/main-codingcatdev-photo/9332e3a5-7d78-41bd-b92d-68f47a3e65e3.png](https://media.codingcat.dev/image/upload/v1657636623/main-codingcatdev-photo/9332e3a5-7d78-41bd-b92d-68f47a3e65e3.png)

## Install dependencies

You will need both [rxfire](https://www.npmjs.com/package/rxfire) and [firebase](https://www.npmjs.com/package/firebase)

`npm i rxfire firebase`

## Create Firebase.js

Firebase.js will be our main Firebase file and will include the tools for our firebase application, including the instantiation of firebase. This file includes rxfire for both the auth and firestore helper functions.Firebase.js

```
import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { authState } from 'rxfire/auth';
import { collectionData } from 'rxfire/firestore';
import { filter } from 'rxjs/operators';
const app = firebase.initializeApp({ /\* Place your configuration here \*/ });
const firestore = firebase.firestore(app); //Initialize firestore
const auth = firebase.auth(app); // Initialize firebase auth
const loggedIn$ = authState(auth).pipe(filter(user => !!user)); // Observable only return when user is logged in.
export { app, auth,firestore, collectionData, loggedIn$ };
export default firebase;

```

> You can skip the Instructions part of the lesson if you are already familiar with ReactJS.
> 

## Simple Initial Component

### Remove App.js and replace

Remove the core of App.js to start as we will be using the pattern of `extends React.Component`. We will now start simple by adding our first React Component Called Instructions.

```tsx
import "./App.css";
import React from "react";
import Instructions from "./components/Instructions";
class App extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "row wrap",
        }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexFlow: "column",
          }}
        >
          {" "}
          <Instructions />{" "}
        </div>{" "}
      </div>
    );
  }
}
export default App;

```

### Create Instructions.js

This is a very simple React Component that takes no [props](https://reactjs.org/docs/components-and-props.html), it just returns straight `html.components/Instructions.js`

```tsx
import React from "react";
class Instructions extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          flexFlow: "row wrap",
        }}
      >
        {" "}
        <div style={{ maxWidth: "500px" }}>
          {" "}
          <img
            src="https://res.cloudinary.com/ajonp/image/upload/q\_auto/ajonp-ajonp-com/17-rxfire-react-cats/RxFire\_3.webp"
            alt="rxfire for cats"
            width="100%"
          />{" "}
        </div>{" "}
        <div>
          {" "}
          <p>
            {" "}
            In this example we will use RxFire to Observe the Cat Facts that we
            add to our Firestore Database.{" "}
          </p>{" "}
          <a
            href="https://github.com/AJONPLLC/rxfire-react-cats"
            target="no\_index"
          >
            {" "}
            https://github.com/AJONPLLC/rxfire-react-cats{" "}
          </a>{" "}
          <ol>
            {" "}
            <li>
              {" "}
              Sign In{" "}
              <ul>
                {" "}
                <li>Uses Google Auth for Firebase</li> <li>Found in App.js</li>{" "}
              </ul>{" "}
            </li>{" "}
            <li>
              {" "}
              Add Cat Fact{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  This will use an API and Insert the facts into Firestore{" "}
                </li>{" "}
                <li>Found in components/AddCat.js</li>{" "}
              </ul>{" "}
            </li>{" "}
            <li>
              {" "}
              Firestore collection{" "}
              <ul>
                {" "}
                <li>
                  {" "}
                  Observing catfacts for changes, heart eyes are your facts{" "}
                </li>{" "}
                <li>Found in components/ListCatFacts.js</li>{" "}
              </ul>{" "}
            </li>{" "}
            <li>
              {" "}
              Sign Out{" "}
              <ul>
                {" "}
                <li>Observe that user is removed</li>{" "}
              </ul>{" "}
            </li>{" "}
          </ol>{" "}
        </div>{" "}
      </div>
    );
  }
}
export default Instructions;

```

## Update collection catfacts

### Create AddCat.js

The first button that we are going to add is simple enough it calls an API and pushes the data returned into a firestore collection as a new document. I always like to work from top down, so first lets import AddCat.js into our App.js.

`App.js`

```tsx
... import AddCat from './components/AddCat'; ... <div style={{ maxWidth: '800px' }}> <AddCat /> </div> ...
```

Now that it is in our App lets create the AddCat component. The only html that this passes back is `onClick={this.addCatFact}`. This is the JSX way of using onClick and passing a function. If you are new to ES6 arrow functions `addCatFact = () => {` is still just defining a function using a shortened syntax, it is becomming more standard these days.The `addCatFact` function calls an API that returns a single random cat fact from [https://cat-fact.herokuapp.com](https://cat-fact.herokuapp.com/). Because of CORS we have to pass it through a proxy, but you will see that we get a value back. We then use the javascript [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to create a new object by adding our `catFactDate` to the object. This allows us to later sort the facts in our list in descending 

`order.components/AddCat.js`

```tsx
import React from 'react';
import { firestore } from '../Firebase';
class AddCat extends React.Component {
    addCatFact = () => {
        /\* The dreaded CORS, had to pass through a proxy \*/
        fetch(`https://cors-anywhere.herokuapp.com/https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1`)
            .then(blob => blob.json())
            .then(value => {
                console.log('fetched', value);
                firestore.collection('catfacts')
                    .add({ ...value, catFactDate: new Date() })
                    .then(() => { }, reason => {
                        alert('Must Be Logged In To Add, See Console');
                        console.log('Failed Adding Cat Fact', reason);
                    });
            });
    };
    render() {
        return (
            <button className="myButton" onClick={this.addCatFact}> 2. Add Cat Fact </button>
        );
    }
}
export default AddCat;
```

Now if you try this right now it should fail with this alert

![https://media.codingcat.dev/image/upload/v1657636623/main-codingcatdev-photo/a32ef7f5-ec50-416a-bd29-6e113a2e61ed.jpg](https://media.codingcat.dev/image/upload/v1657636623/main-codingcatdev-photo/a32ef7f5-ec50-416a-bd29-6e113a2e61ed.jpg)

This is expected as our firestore.rules are set to strict mode, we will add those after we get through our authentication section next.You may also notice in the console (and on the screen fact jumps in and out) that firebase actually adds to our array, until failing on the backend. This is done on purpose as it gives us the fast UI that we expect while still maintaining the data integrity.

## Add Firebase Authentication

We need to store using state within our application, so we can define a state object with a field `user` we will then use this from firebase when a user is logged in. We will also import a new `SignIn` button that we can use to hide show Sign In / Sign Out depending on the current state.In the `SignIn` component we will for the first time start using props, we will pass the user state as well as a couple of our functions that are needed in the component to update our `user.App.js`

```tsx
... import { firestore, loggedIn$ } from './Firebase'; ...
state = { user: null }; componentDidMount() {
    /\* Observable from RxFire \*/
    loggedIn$.subscribe(user => { this.authHandler({ user });
    //Update state on load of app
    const { displayName, email, phoneNumber, photoURL } = user;
    firestore .collection('users') .doc(user.uid)
    .set({ displayName, email, phoneNumber, photoURL });
    }); }
    authHandler = async authData => {
        this.setUser(authData.user); };
        setUser = user => {
            this.setState({ user: user }); };
            ...
            <Instructions />
            <SignIn user={this.state.user} authHandler={this.authHandler} setUser={this.setUser} />
            <div style={{ maxWidth: '800px' }}>
            <AddCat user={this.state.user} />
            ...

```

`SignIn.js`

```
import React from "react";
import firebase, { app } from "../Firebase";
class SignIn extends React.Component {
  signIn = () => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    app.auth().signInWithPopup(authProvider).then(this.props.authHandler);
  };
  signOut = async () => {
    await firebase.auth().signOut();
    this.props.setUser(null);
  };
  render() {
    if (!this.props.user) {
      return (
        <button className="myButton" onClick={this.signIn}>
          {" "}
          1. Sign In{" "}
        </button>
      );
    } else {
      return (
        <div>
          {" "}
          <span>Welcome {this.props.user.email} </span>{" "}
          <button className="myButton" onClick={this.signOut}>
            {" "}
            4. Sign Out{" "}
          </button>{" "}
        </div>
      );
    }
  }
}
export default SignIn;

```

## Update AddCat to include user uid

### Pass user to AddCat

Update our main app to pass the user prop.App.js

Now we can use this to include with our data going to firestore. AddCat.js

```tsx
... .add({ ...value, uid: this.props.user.uid, catFactDate: new Date() }) ...

```

As well as whether or not to show the Add Cat Fact button, we check to see if the user exists. This button should only show when a user is signed in.

```tsx
 render() { let addCatButton = null; if (this.props.user) addCatButton = ( <button className="myButton" onClick={this.addCatFact}> 2. Add Cat Fact </button> ); return addCatButton; }

```

## Update firestore.rules

```
service cloud.firestore {
    match /databases/{database}/documents {
    // LockDown All
    match /{document=\*\*} {
        allow read: if false; allow write: if false;
        }
        // User
        match /users/{userId} {
            allow read: if false;
            allow write: if request.resource.id == request.auth.uid;
        }
        // CatFacts
        match /catfacts/{catFactId} {
            allow read: if true;
            allow write: if request.auth.uid != null && request.resource.data.uid == request.auth.uid;
        }
    }
}

```

## Create List of Cat Facts

### Create ListCatFacts

This is probably the most important part of `RxFire` it will return an Observable that you can subscribe to for all changes to a collection by using the function `collectionData` which takes the collection as paramater as well as an option id to create, in our case we pass `catFactsRef.orderBy('catFactDate', 'desc')` and `'catFactId'`.Now we can just use a map to iterate on each catFact, whenever the Observable updates the current `catFact` state the array is updated and we can show the full list update using `{this.state.catfacts.map(catFact => {`.ListCatFacts.js

```tsx
import React from 'react'; import { collectionData, firestore } from '../Firebase'; class ListCatFacts extends React.Compo

```