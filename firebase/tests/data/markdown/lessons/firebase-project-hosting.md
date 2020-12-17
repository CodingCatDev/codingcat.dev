---
title: 'Firebase Project Hosting'
date: '2018-11-26'
---

https://youtu.be/sOn3YMdpYR4

## Firebase Console

Go to the [Firebase Console](https://console.firebase.google.com/)If this is your first firebase project you will need to Sign in to Google

![Google Login](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543272442/ajonp-ajonp-com/1-lesson/Screen_Shot_2018-11-26_at_5.44.44_PM.png)

## Create Project

Now you can click the button to add a new Project

![Create Project](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543272442/ajonp-ajonp-com/1-lesson/Screen_Shot_2018-11-26_at_5.46.16_PM.png)

## Hosting

At this point many if the blogs will start talking about setting up the database, but I want to keep this really simple "Hello World" style.You can now navigate over to the hosting area within firebase.

![Firebase Hosting](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543452867/ajonp-ajonp-com/1-lesson/Screen_Shot_2018-11-28_at_7.49.10_PM.png)

If you take a look at [Firebase hosting quickstart](https://firebase.google.com/docs/hosting/) it also has a great guide.If you are all new to programming you may not have installed [Node or NPM](https://nodejs.org/en/) yet, just follow this link and install the LTS version.

![NodeJs with NPM](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543691205/ajonp-ajonp-com/1-lesson/node_download.png)

## Hosting Deploy

Now you can select "Get started" to walkthrough the guided tips from Firebase - Hosting.

![Hosting Get Started](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543691320/ajonp-ajonp-com/1-lesson/Screen_Shot_2018-12-01_at_2.08.17_PM.png)

### Install Firebase Tools

```
npm install -g firebase-tools
```

### Login with firebase

```
firebase login
```

### Make a new directory

```
mkdir ~/Downloads/lesson-1-firebase-project cd ~/Downloads/lesson-1-firebase-project
```

### Initialize firebase

```
firebase init
```

#### Selections

1. Up/Down key to move to Hosting
2. Hit spacebar to make selection
3. Enter to continue to next setup
4. Navigate to your newly created firebase project
5. Hit enter to accept public as location to serve files
6. Key n, Enter for not making this a single page app.
7. Firebase initialization complete!

#### Firebase project file

.firebaserc

```
{
  "projects": {
    "default": "ajonp-lesson-1"
  }
}

```

#### Firebase hosting file

firebase.json

```
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}

```

### Deploy firebase

Because you are logged into the CLI, the two files above tell firebase the project to use, and how they will be served on nginx. Now you just need to run the deploy command.

```
firebase deploy
```

Now back inside the firebase console you should see that hosting has now been completed.

![Firebase Hosting Files](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1543784444/ajonp-ajonp-com/1-lesson/hosting_after_deploy.png)
