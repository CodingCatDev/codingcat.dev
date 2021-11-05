# CodingCatDev

This is the main repo for https://codingcat.dev

## Status
### Dev
- ![](https://img.shields.io/github/deployments/CodingCatDev/codingcat.dev/Production%20%E2%80%93%20admin-dev-codingcat-dev) admin-dev.codingcat.dev
- ![](https://img.shields.io/github/deployments/CodingCatDev/codingcat.dev/Production%20%E2%80%93%20dev-codingcat-dev) dev.codingcat.dev
### Prod (Main)
- ![](https://img.shields.io/github/deployments/CodingCatDev/codingcat.dev/Production%20%E2%80%93%20admin-codingcat-dev) admin.codingcat.dev
- ![](https://img.shields.io/github/deployments/CodingCatDev/codingcat.dev/Production%20%E2%80%93%20codingcat-dev) codingcat.dev

## Setup

First install [Learna](https://lerna.js.org/)
Install Learn by running `npm run install`
To install dependencies run `npm run bootstrap`

### Firebase Backend

You must first setup a project in the firebase [console](https://console.firebase.google.com/).
Then you will need to `cd backend/firebase` and add firebase by running `firebase use --add` and provide your new project.

There are several keys that you will need to set for your functions to work fully.
You can add them by running `firebase functions:config:set`
For example to set the cloudinary.api_secret you would run `firebase functions:config:set cloudinary.api_secret=abcdefg`

Validate this is setup correctly by running `firebase functions:config:get` you should get something like below when you are done

```json
{
  "firestore_backup": {
    "bucket": ""
  },
  "algolia": {
    "search_key": "",
    "index": "",
    "app_id": "",
    "api_key": ""
  },
  "cloudinary": {
    "name": "",
    "api_key": "",
    "api_secret": ""
  }
}
```

You must obtain your private key information from
https://console.firebase.google.com/u/0/project/[YOURPROJECT]/settings/serviceaccounts/adminsdk

Then you will add this to `backend/firebase/serviceAccountKey.json`.
You can find an example template at `backend/firebase/serviceAccountKey.json.template`.

TODO: Build out sample test data

### Firebase Emulator

In order to run locally you will need your config values, you can get those by running the following

> Make sure you are in the backend/firebase/functions when running!

```bash
firebase functions:config:get > .runtimeconfig.json
# If using Windows PowerShell, replace the above with:
# firebase functions:config:get | ac .runtimeconfig.json
firebase functions:shell
```

### Run Locally

Connect with vercel project
TODO: Add logic for using console

You will need to setup a `.env.local` within any project that requires Firebase.

There are example files located at
`frontend/main/.env.local.template`
`frontend/admin/.env.local.template`

To run all repos in frontend you can run either

`npm run dev` for all the dev builds and live reload
`npm run start` for all production builds (builds and runs local server)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)