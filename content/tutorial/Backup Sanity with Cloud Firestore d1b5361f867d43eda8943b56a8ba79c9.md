---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1616545942/main-codingcatdev-photo/ivyj5svdql79xzaqx5ii.png
excerpt: How to utilize Sanity's Webhooks to trigger a Firebase Cloud Function that can backup your data in Cloud Firestore
hashnode: https://hashnode.codingcat.dev/tutorial-backup-sanity-with-cloud-firestore
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=backup-sanity-with-cloud-firestore&_id=d1b5361f867d43eda8943b56a8ba79c9
published: published
slug: backup-sanity-with-cloud-firestore
start: May 29, 2022
title: Backup Sanity with Cloud Firestore
youtube: https://youtu.be/ea1-Dv4z2nI
---

[Backup Sanity with Cloud Firestore](Backup%20Sanity%20with%20Cloud%20Firestore%20d1b5361f867d43eda8943b56a8ba79c9/Backup%20Sanity%20with%20Cloud%20Firestore%202b062a0d9f9e40cdbb909ee6fe281d64.md)

## New Firebase Project

In order to accept webhooks from Sanity you will need to have a firebase project setup, you can search this site for many examples. But most simply run `firebase init` on your command line and select Functions and Firestore, you can keep all other defaults.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ocpm7ygcvj8ttwmrvmme.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ocpm7ygcvj8ttwmrvmme.png)

After selecting an existing or creating a new project make sure to select TypeScript

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ghyvspk2skertrbksufv.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ghyvspk2skertrbksufv.png)

## Cloud Firestore

If you run into any issues on the command line, you can open the console and validate your Firestore database has been created.

The main thing that needs to happen in firestore is to make sure that your rules will allow you to write to the database. Make sure in firestore.rules, you have something similar to this based on the content that you are bringing over. Realisticly we are using the the admin functions so you don't need these rules to write, but it is nice to remember if you are getting blocked in your site for read access.

```jsx

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
    match /sanity/{sanityId} {
        allow read: if true;
        allow write: if false;

      match /courses/{courseId} {
        allow read: if true;
        allow write: if false;
      }
      match /sections/{sectionId} {
        allow read: if true;
        allow write: if false;
      }
      match /modules/{moduleId} {
        allow read: if true;
        allow write: if false;
      }
    }
  }
}

```

## Firebase Cloud Function WebHook

Within the directory `functions->src_index.ts` you can now update this file with the below code. Making sure to replace `'YOURKEY'` with the key from your sanity project id found in settings.

```tsx
import * as admin from 'firebase-admin';
admin.initializeApp();

import * as functions from 'firebase-functions';
export const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const fetch = require('node-fetch');

export const sanityWebhookHandler = functions.https.onRequest(async (req, res) => {
  if (req.body.projectId !== 'YOURKEY') {
    res.status(500).send();
  }
  try {
    console.log(JSON.stringify(req.body));
    await getSanityData(req.body);
    res.status(200).send();
  } catch (err) {
    console.log(JSON.stringify(err));
    res.status(400).send(err);
  }
}
);

const getSanityData = async (body) => {
  console.log('Setting up client', body.projectId, );

  for(const id of body.ids.all){
    const url = https://${body.projectId}.api.sanity.io/v1/data/query/${body.dataset}?query=*[_id%20==%20$id]&$id=%22${id}%22;
    console.log(url);
    const resp = await (await fetch(url)).json();
    const {result} = resp;

    for(const item of result){
      console.log('Updating', ${item._type}/${item._id});
      await db.doc(sanity/docs/${item._type}/${item._id}).set(item, { merge: true });
    }
  }
}

```

Once this is complete you can run command `firebase deploy`.

You can then go to the Firebase Console and copy your url, you will need this later for the sanity webhook url.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/b7flanuxebtvvqy6fnbd.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/b7flanuxebtvvqy6fnbd.png)

## Sanity Setup

In your Sanity Console you can edit webhooks in your settings `https://manage.sanity.io/projects/<your-projectid>/settings/api`

You can then add your Firebase Cloud Function URL and select the dataset you would like to get updates from.

![https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/dbdcaxyft3rby2kttzij.png](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/dbdcaxyft3rby2kttzij.png)

Now anytime you make a change in your

## Sanity Pro Tip

If you already have data in Sanity and would like to trigger all of your documents to update you can export and then import your entire dataset. Run the below commands inside of a project running sanity.

```bash
sanity dataset export something.tar.gz``sanity dataset import something.tar.gz --replace
```