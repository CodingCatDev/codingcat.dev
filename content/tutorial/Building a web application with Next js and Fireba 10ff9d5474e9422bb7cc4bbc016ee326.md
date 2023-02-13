---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1636118631/main-codingcatdev-photo/Firebase_Summit_2021_-_Building_a_web_application_with_Next.js_and_Firebase_1.png
excerpt: In this 20 minute demo I quickly show you how to get up and running with Next.js and Firebase.
hashnode: https://hashnode.codingcat.dev/tutorial-building-a-web-application-with-next-js-and-firebase-firebase-summit-2021
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=building-a-web-application-with-next-js-and-firebase-firebase-summit-2021&_id=10ff9d5474e9422bb7cc4bbc016ee326
published: published
slug: building-a-web-application-with-next-js-and-firebase-firebase-summit-2021
start: June 2, 2022
title: Building a web application with Next.js and Firebase - Firebase Summit 2021
youtube: https://youtu.be/kHrIyTLVerg
---
## GitHub Repo

In order to clone this application locally run the below command. Please note you will need [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

```bash
git clone https://github.com/CodingCatDev/ccd-starter-nextjs-tailwind-firebase.git

```

## Firebase

Make sure to setup a new project with a Firestore database.

### Install dependencies

```bash
cd backend/firebase && npm install

```

> Make sure you are first in the firebase directory
> 

```bash
firebase deploy

```

The video will cover how the different page types work for firebase.

## Install dependencies

To get started make sure to

```bash
cd frontent/nextjs-tailwind && npm install

```

## Run locally

Make sure to change the `.env.local.template` to `.env.local` and update the parameters from firebase.

To run the dev server (staying in the same directory)

```bash
npm run dev

```