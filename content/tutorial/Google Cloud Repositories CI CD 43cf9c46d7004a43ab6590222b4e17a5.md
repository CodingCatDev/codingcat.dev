---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1600989114/ccd-cloudinary/Google-Cloud-Repositories-CICD-.png
devto: https://dev.to/codingcatdev/google-cloud-repositories-cicd-4i56
excerpt: Google Cloud Continuous Integration and Delivery (CI/CD)
hashnode: https://hashnode.codingcat.dev/tutorial-google-cloud-repositories-ci-cd
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=google-cloud-repositories-ci-cd&_id=43cf9c46d7004a43ab6590222b4e17a5
published: published
slug: google-cloud-repositories-ci-cd
start: May 16, 2022
title: Google Cloud Repositories CI/CD
youtube: https://youtu.be/MijHRE5h6Gg
---

We will continue our hello world example from [Firebase Project Hosting](https://codingcat.dev/courses/angularmaterial/lessons/firebase-project-hosting/) and extend this into publishing our site to firebase using CI/CD. The final hosting example will create the site in the initial project folder (in my case ajonp-lesson-1)

1. Source Code Repositories Pricing
2. Create Github Repository
3. Create Google Cloud Source Repository
4. Create Dockerfile for uploading to Firebase
5. Create cloudbuil.yaml for Google Cloud Build to trigger build
6. Setup Triggers
7. Commit to cause a trigger to run
8. Update content to change Hello World

# Why do I use Google Source Repositories?

> Because it is cheaper! (and I develop on a shoestring budget) The negative is that it is not as straight forward to use as git clone
> 

![https://media.codingcat.dev/image/upload/v1657636861/main-codingcatdev-photo/26c8dc64-6c51-4d81-8303-f7bc61fd5d84.png](https://media.codingcat.dev/image/upload/v1657636861/main-codingcatdev-photo/26c8dc64-6c51-4d81-8303-f7bc61fd5d84.png)

## Github

Don't get me wrong I think that $7 a month is a great deal, but you have to pay it the minute you want to start using private repos.

![https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/78e072a5-521b-4d05-a2ee-2a5fbb837ac4.png](https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/78e072a5-521b-4d05-a2ee-2a5fbb837ac4.png)

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/0ef13a2d-3283-491a-a3a5-f4d15168331d.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/0ef13a2d-3283-491a-a3a5-f4d15168331d.png)

## Google Cloud Source Repositories

Basically free until you scall to a large level.

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/ac2c687f-834c-47ca-8d6e-1c8c0f1bd01c.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/ac2c687f-834c-47ca-8d6e-1c8c0f1bd01c.png)

## Create Repository

Select new

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/a681627c-e478-4fd1-b821-e272c947d9d5.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/a681627c-e478-4fd1-b821-e272c947d9d5.png)

Create name for repo

![https://media.codingcat.dev/image/upload/v1657636861/main-codingcatdev-photo/eaa07d70-6efb-4b02-a6dc-440e25597611.png](https://media.codingcat.dev/image/upload/v1657636861/main-codingcatdev-photo/eaa07d70-6efb-4b02-a6dc-440e25597611.png)

Clone our existing "Hello World" project

```
git clone https://github.com/AJONPLLC/lesson-1-firebase-project.git cd lesson-1-firebase-project/

```

## Remove remote references

When you are cloning an existing repository you need to cleanup the remote reference to store this into a new repository.

Lets look at the remotes currently

This should show something like

```jsx
origin [https://github.com/AJONPLLC/lesson-1-firebase-project.git](https://github.com/AJONPLLC/lesson-1-firebase-project.git) (fetch) 
origin [https://github.com/AJONPLLC/lesson-1-firebase-project.git](https://github.com/AJONPLLC/lesson-1-firebase-project.git) (push)
```

Let's remove this remote

```bash
git remote rm origin
```

## Add Newly created repo

```bash
git remote add origin https://github.com/AJONPLLC/lesson-2-firebase-ci.git git push -u origin master

```

![https://media.codingcat.dev/image/upload/v1657636660/main-codingcatdev-photo/8369ecc8-8051-4035-99d3-6153ba2668f2.png](https://media.codingcat.dev/image/upload/v1657636660/main-codingcatdev-photo/8369ecc8-8051-4035-99d3-6153ba2668f2.png)

# Google Cloud

> As of right now *December 3, 2018* Google has this message: This version of Cloud Source Repositories will permanently redirect to the new version of Cloud Source Repositories starting December 3rd. Try the new version today for fast code search, an improved code browser, and much more.
> 

## Google Cloud Source Repositories

Open [Source Cloud Repositories](https://source.cloud.google.com/). Now you can select "Add repository".

### Add Google Cloud Repository (standalone)

Select "Create new repository" option.

![https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/0b73b310-7847-455f-b005-1b10f15d8c17.png](https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/0b73b310-7847-455f-b005-1b10f15d8c17.png)

From the first lesson you should have a project that was created from firebase, you can use the dropdown under "Project" to select. Then Click "Create" (Not Create Project, unless you want this to be seperated).

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/eb50173c-95e0-4b39-a8c3-e2537af7586c.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/eb50173c-95e0-4b39-a8c3-e2537af7586c.png)

### Add Code to Google Cloud Repository

Typically on a fresh repo you would now clone this and start working.

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/b65705b6-ef8c-4e57-8d08-6e0d4ddc85d0.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/b65705b6-ef8c-4e57-8d08-6e0d4ddc85d0.png)

For this example we are going to select "Push code from a local Git repository" because we have an example we are already working with.

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/533504b7-1018-4daf-8d7b-8894dfa01fbf.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/533504b7-1018-4daf-8d7b-8894dfa01fbf.png)

You can skip the first command (unless you skipped both the Lesson 1 and hosting in GitHub).

First verify that we have the correct origin for your project (mine should be lesson-2 not lesson-1)

> 
> 
> 
> origin [https://github.com/AJONPLLC/lesson-2-firebase-ci.git](https://github.com/AJONPLLC/lesson-2-firebase-ci.git) (fetch) origin [https://github.com/AJONPLLC/lesson-2-firebase-ci.git](https://github.com/AJONPLLC/lesson-2-firebase-ci.git) (push)
> 

Now add Google Source Repository as an additional remote location

```bash
git remote add google https://source.developers.google.com/p/ajonp-ajonp-com/r/ajonp-lesson-2
```

Look at your remotes once again and you should see two.

> google [https://source.developers.google.com/p/ajonp-ajonp-com/r/ajonp-lesson-2](https://source.developers.google.com/p/ajonp-ajonp-com/r/ajonp-lesson-2) (fetch) google [https://source.developers.google.com/p/ajonp-ajonp-com/r/ajonp-lesson-2](https://source.developers.google.com/p/ajonp-ajonp-com/r/ajonp-lesson-2) (push) origin [https://github.com/AJONPLLC/lesson-2-firebase-ci.git](https://github.com/AJONPLLC/lesson-2-firebase-ci.git) (fetch) origin [https://github.com/AJONPLLC/lesson-2-firebase-ci.git](https://github.com/AJONPLLC/lesson-2-firebase-ci.git) (push)
> 

Helpful hint for multiple remotes in VSCode, you can access the git tab, then "...", then "Push to...". This will show you the remotes.

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/a66edf29-5f8b-4007-96e6-775abebae03e.jpg](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/a66edf29-5f8b-4007-96e6-775abebae03e.jpg)

To remove your GitHub based remote you can execute, however we will not do this now as we want to test pushing code to both repositories.

```
git remote remove origin
```

## Create Dockerfile

I like to create a folder for all of my dockerfiles, this allows you to easily locate and access them all. There are many references in the [Official Guide](https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts#deploying_artifacts), but they always seem to place this file alongside your cloudbuild.yaml file (in my opinion this confuses things).

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/f220f3e8-f536-4590-8fcf-85eabb131e46.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/f220f3e8-f536-4590-8fcf-85eabb131e46.png)

This Dockerfile is utilizing a prebuilt node image from node. dockerfiles/firebase/Dockerfile

We need to make sure that billing and the cloud build API are setup. You can follow a great guide [Enable Billing](https://cloud.google.com/cloud-build/docs/quickstart-docker).

Again we are doing this on the cheap, other places will charge you a monthly fee for this. Google allows for 120 build minutes a day!!

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/fee9bf8a-ea9a-428c-83e7-544d50b0b75d.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/fee9bf8a-ea9a-428c-83e7-544d50b0b75d.png)

## Create Cloudbuild

This cloudbuild.yaml file will leverage the gcloud trigger. [https://cloud.google.com/cloud-build/docs/cloud-builders](https://cloud.google.com/cloud-build/docs/cloud-builders)

cloudbuild.yaml (place in root directory)

```yaml
steps:
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker' args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase' ]
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase' args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
# Optionally you can keep the build images
# images: ['gcr.io/$PROJECT_ID/hugo', 'gcr.io/$PROJECT_ID/firebase']

```

> You may have noticed an interesting line here, this allows for an argument called _FIREBASE_TOKEN to be setup in our cloud deploy, so it doesn't leak out in our GitHub/GCP Repositories. args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
> 

We will need a token from firebase for this next Patterson

This will walk you through the process (same as login before). When this finishes back in the terminal you should receive a token like `1/8V_izvEco3KY8EXAMPLEONLYpnLGpGLPAvofC_0YX3qx2NE_Zxs Along with a message Example: firebase deploy --token "$FIREBASE_TOKEN"`

You will need to capture this token, or leave your terminal open for setting up a trigger.

## Setup trigger

Go back to Google Cloud Platform [Console](https://console.cloud.google.com/home/dashboard). Using the hamburger navigation Cloud Build > [Triggers](https://console.cloud.google.com/cloud-build/triggers).

![https://media.codingcat.dev/image/upload/v1657636660/main-codingcatdev-photo/0ef3aa1d-0435-4d1e-a8b6-17ea54172f1d.png](https://media.codingcat.dev/image/upload/v1657636660/main-codingcatdev-photo/0ef3aa1d-0435-4d1e-a8b6-17ea54172f1d.png)

### Github Trigger

Select Github as source, then authenticate.

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/19d5b428-9f76-4df2-930d-36ec4a613a55.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/19d5b428-9f76-4df2-930d-36ec4a613a55.png)

Select Repository

![https://media.codingcat.dev/image/upload/v1657636661/main-codingcatdev-photo/106d89f0-0e90-4859-be80-36b787d00f6a.png](https://media.codingcat.dev/image/upload/v1657636661/main-codingcatdev-photo/106d89f0-0e90-4859-be80-36b787d00f6a.png)

Setup Trigger Settings

> Pay close attention to add the Firebase Token from the steps above.
> 

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/426062d0-82af-41f4-9aad-dc3fb27b778b.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/426062d0-82af-41f4-9aad-dc3fb27b778b.png)

### GitHub Commit for trigger

Now you can run the commands to add the changes dockerfile and cloudbuild.yaml

Now remember we have commited these changes locally, we still need to push them to origin (which is our GitHub remote)

You can now check that your trigger didn't fail by going to [Google Cloud Platform - Cloud Build History](https://console.cloud.google.com/cloud-build/builds)

### Google Source Repository Trigger

This will be the identical setup.

![https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/9b14f930-80b8-4ebd-be8d-1620fca90379.png](https://media.codingcat.dev/image/upload/v1657636664/main-codingcatdev-photo/9b14f930-80b8-4ebd-be8d-1620fca90379.png)

![https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/6d235f72-f0a7-468a-8ace-fd89cc8e3b86.png](https://media.codingcat.dev/image/upload/v1657636659/main-codingcatdev-photo/6d235f72-f0a7-468a-8ace-fd89cc8e3b86.png)

Now we just need to push to a different remote (Google Cloud Repository)

# Update Content - see CI/CD in Action

Update your index file to show something changed.

public/index.html

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Firebase Hosting</title>
</head>

<body> Firebase is not building everytime I commit, just from following<a
        href="https://ajonp.com/lessons/2-firebase-ci/">Google Cloud Repositories CI/CD</a> <img
        src="https://res.cloudinary.com/ajonp/image/upload/q_auto/v1543793005/ajonp-ajonp-com/2-lesson-gcp-cloud-build/aj_on_firebaseCI.webp"
        alt="Hero Image"> </body>

</html>

```

Add, commit, push files

```bash
git add . git commit -m "CI/CD" git push --set-upstream google master

```