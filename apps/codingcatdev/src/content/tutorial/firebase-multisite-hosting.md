---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1623783708/main-codingcatdev-photo/dhoffzsdzo9fld1xxpgj.jpg
devto: https://dev.to/codingcatdev/firebase-multisite-hosting-37d
excerpt: Creation of multiple sites within Hugo (main and amp), as well as multiple sites written in Angular (admin and app).
hashnode: https://hashnode.codingcat.dev/tutorial-firebase-multisite-hosting
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=firebase-multisite-hosting&_id=37c9748f228b402b94151c27ba077508
published: published
slug: firebase-multisite-hosting
start: May 20, 2022
title: Firebase Multisite Hosting
youtube: https://youtu.be/bLrZxoC0VlQ
---

This tutorial will focus on a very easy solution to having multiple web projects hosted under the same domain.

> Firebase limits a single domain for all of your projects. Once you have associated this domain you not be able to use it again for any other project. For example we would like to use lessons.ajonp.com but since we are using ajonp-ajonp-com for ajonp.com domain we are unable to use this.
> 

> We also wanted to mention that the video may not match exactly what is in the lesson7 repo, we are sorry about that, initially we were going to use two projects with a single domain. Please pull the repo directly and these steps should help you get to a finished setup quickly.
> 

## Steps

1. Switching Firebase Plans
2. Create 4 Firebase Hosting Sites
3. Example Multiple Hugo Themes deploying to Firebase Multisite
4. Example Angular Project with Multiple projects deploying to Firebase Multisite
5. Google Cloud Builder - Trigger

# Firebase Pricing Plans

## New Project

If you have just created a new project you will need to upgrade in order to use Multisite hosting.

![https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/b738f96f-8419-4c8a-be51-891fb6ef6a9a.png](https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/b738f96f-8419-4c8a-be51-891fb6ef6a9a.png)

> 
> 
> 
> Firebase [Pricing](https://firebase.google.com/pricing) is ever changing, so make sure to check on this.
> 

Hosting Free limit on the Blaze plan

![https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/b3a4edb4-eac9-44b9-9e15-7ae6fef1cf5b.png](https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/b3a4edb4-eac9-44b9-9e15-7ae6fef1cf5b.png)

# Create 4 Firebase Hosting Sites

You can name these whatever fits your project, if you using ajonp* you will probably have issues as we am already using those.

Example for your site:

- mysite
- mysite-admin
- mysite-amp
- mysite-app

![https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/43d83d54-073c-46e5-af22-2a1b03c08c97.png](https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/43d83d54-073c-46e5-af22-2a1b03c08c97.png)

![https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/09176f1e-c6a1-4ea4-a2bc-391cc32c3740.png](https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/09176f1e-c6a1-4ea4-a2bc-391cc32c3740.png)

# Example Multiple Hugo Themes deploying to Firebase Multisite

> You don't need to install anything if you just deploy to Google Cloud. In this lesson reference [Cloud Build](https://ajonp.com/lessons/7-firebase-multisite-hosting/#cloud-build) Also see [https://ajonp.com/lessons/google-cloud-repositories-ci-cd](https://ajonp.com/lessons/google-cloud-repositories-ci-cd) for more details on CI/CD.
> 

Once you clone [https://github.com/AJONPLLC/lesson-7-firebase-multisite-hosting](https://github.com/AJONPLLC/lesson-7-firebase-multisite-hosting.git) you can run it locally, but you must build out all of the sites before doing this.

## Remove git reference

Please remove the reference to AJONPLLC, then you can add any git repo you would like.

```bash
git remote rm origin
```

## Add new reference

Create a new github site (or Gitlab or Google Cloud or...)

Then add the new repo back to your site using this command, replace **ajonp/a-sample-repo.git** with yours.

```bash
git remote add origin https://github.com/ajonp/a-sample-repo.git git push -u origin master
```

## Steps for building hugo sites

1. Git Submodule commands, make sure you have [Git CLI](https://git-scm.com/downloads).

```bash
git submodule init git submodule update --recursive --remote
```

This will update to the latest remote builds for ajonp.com, including both the content and themes that we host publicly

1. Hugo commands, make sure you have the [Hugo CLI](https://gohugo.io/getting-started/installing/) installed.

```bash
hugo -d dist/ajonp -v -t ajonp-hugo-ionic --config config.toml,production-config.toml hugo -d dist/ajonp-amp -v -t ajonp-hugo-amp --config config.toml,production-config.toml
```

# Example Angular Project with Multiple projects deploying to Firebase Multisite

## Steps for building Angular sites

NPM commands, make sure you have [Node Js](https://nodejs.org/en/download/) installed.

```bash
npm install
```

Angular commands, make sure you have the [Angular CLI](https://cli.angular.io/) installed.

```bash
ng build --prod --project ajonp-admin ng build --prod --project ajonp-app
```

Serve locally using firebase, make sure you have [Firebase CLI](https://firebase.google.com/docs/cli/)

```bash
firebase serve
```

# Google Cloud Builder - Trigger

Please add a trigger to your repository reference [Firebase CI/CD lesson](https://ajonp.com/lessons/google-cloud-repositories-ci-cd) for more details.

## Cloud Build

Now after having tried all of the manual build steps out, you really don't need any of them. You can run all of this in the cloud by setting up the commit trigger from above.

cloudbuild.yaml

```yaml
steps:
# Pull in the required submodules for our themes and content
- name: gcr.io/cloud-builders/git
  args: ['submodule', 'init']
- name: gcr.io/cloud-builders/git
  args: ['submodule', 'update', '--recursive', '--remote']
# Install all of our dependencies
- name: 'gcr.io/cloud-builders/npm'
  args: ['install']
# Build the hugo image
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/hugo', './dockerfiles/hugo' ]
# Build ajonp-hugo-ionic -> dist/ajonp
- name: 'gcr.io/$PROJECT_ID/hugo'
  args: [ 'hugo',"-d", "dist/ajonp", "-v", "-t", "ajonp-hugo-ionic", "--config", "config.toml,production-config.toml"]
# Build ajonp-hugo-amp -> dist/ajonp-amp
- name: 'gcr.io/$PROJECT_ID/hugo'
  args: [ 'hugo',"-d", "dist/ajonp-amp", "-v", "-t", "ajonp-hugo-amp", "--config", "config.toml,production-config.toml"]
# Build the hugo image
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/ng:latest', './dockerfiles/ng' ]
# Build ajonp-admin -> dist/ajonp-admin
- name: 'gcr.io/$PROJECT_ID/ng:latest'
  args: ['build', '--prod', '--project', 'ajonp-admin']
# Build ajonp-admin -> dist/ajonp-app
- name: 'gcr.io/$PROJECT_ID/ng:latest'
  args: ['build', '--prod', '--project', 'ajonp-app']
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase' ]
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
# Optionally you can keep the build images
# images: ['gcr.io/$PROJECT_ID/hugo', 'gcr.io/$PROJECT_ID/firebase']

```

## Cloud Build locally

If you would like to debug locally please make sure you read [Building and debugging locally](https://cloud.google.com/cloud-build/docs/build-debug-locally). This will require that you have [Docker](https://docs.docker.com/install/#server) installed locally.

### Install necessary components

Install docker-credential-gcr

Configure Docker

Check to see if version is working

In the root directory of your project, you can then run this command (**don't forget** the "." as this tells Cloudbuild to use the current directory)

You will notice that this output matches what happens in the cloud when Google Cloud Build executes

```
Starting Step #0
Step #0: Pulling image: gcr.io/cloud-builders/git
Step #0: Unable to find image 'gcr.io/cloud-builders/docker:latest' locally
Step #0: latest: Pulling from cloud-builders/docker
Step #0: 75f546e73d8b: Pulling fs layer
Step #0: 0f3bb76fc390: Pulling fs layer
Step #0: 3c2cba919283: Pulling fs layer
Step #0: 252104ea43c6: Pulling fs layer
Step #0: 252104ea43c6: Waiting
Step #0: 3c2cba919283: Verifying Checksum
Step #0: 3c2cba919283: Download complete
Step #0: 0f3bb76fc390: Verifying Checksum
Step #0: 0f3bb76fc390: Download complete
Step #0: 75f546e73d8b: Verifying Checksum
Step #0: 75f546e73d8b: Download complete
Step #0: 75f546e73d8b: Pull complete
Step #0: 0f3bb76fc390: Pull complete
Step #0: 3c2cba919283: Pull complete

```

Google Cloud Builder Output

![https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/896ccf88-06ee-4ac6-a2ce-098e1f4b4fa2.png](https://media.codingcat.dev/image/upload/v1657636586/main-codingcatdev-photo/896ccf88-06ee-4ac6-a2ce-098e1f4b4fa2.png)