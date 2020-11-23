---
title: "Firebase Multisite Hosting"
date: "2018-12-17"
---

https://youtu.be/bLrZxoC0VlQ

This lesson will focus on a very easy solution to having multiple web projects hosted under the same domain.

> Firebase limits a single domain for all of your projects. Once you have associated this domain you not be able to use it again for any other project. For example we would like to use lessons.ajonp.com but since we are using ajonp-ajonp-com for ajonp.com domain we are unable to use this.

> We also wanted to mention that the video may not match exactly what is in the lesson7 repo, we are sorry about that, initially we were going to use two projects with a single domain. Please pull the repo directly and these steps should help you get to a finished setup quickly.

## Lesson Steps

1. Switching Firebase Plans
2. Create 4 Firebase Hosting Sites
3. Example Multiple Hugo Themes deploying to Firebase Multisite
4. Example Angular Project with Multiple projects deploying to Firebase Multisite
5. Google Cloud Builder - Trigger

# Firebase Pricing Plans

## New Project

If you have just created a new project you will need to upgrade in order to use Multisite hosting.

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAGBAMAAAAmmzNnAAABdGlDQ1BpY20AAHicY2BgKkksKMhhYWBgyM0rKQpyd1KIiIxSYL/DwM3AwyDEYMUgnphcXOAYEODDgBN8u8bACKIv64LMSvP8edOmtXz+FjavmXJWJTq49YEBd0pqcTIDAyMHkJ2cUpycC2TnANk6yQVFJUD2DCBbt7ykAMQ+AWSLFAEdCGTfAbHTIewPIHYSmM3EAlYTEuQMZEsA2QJJELYGiJ0OYVuA2MkZiSlAtgfILogbwIDTw0XB3MBS15GAu0kGuTmlMDtAocWTmhcaDHIHEMsweDC4MCgwmDMYMFgy6DI4lqRWlIAUOucXVBZlpmeUKDgCQzZVwTk/t6C0JLVIR8EzL1lPR8HIwNAApA4UZxCjPweBTWcUO48Qy1/IwGCpzMDA3IMQS5rGwLB9DwODxCmEmMo8BgZ+awaGbecKEosS4Q5n/MZCiF+cZmwEYfM4MTCw3vv//7MaAwP7JAaGvxP///+96P//v4uB9gPj7EAOACR3aeDXPqSpAAAAGFBMVEX4+fn29/f////z8/Ps7/Hj5OT5+vvo9vxZ3CTMAAAAOklEQVQI12MIdUEBDAIMyICZgTUUCJKUoECBIdnYxNjYWFCAUVBQkCm9gIEFyDNIQ8gbgoAgFAgLAwDDhQ2jFS7kAQAAAABJRU5ErkJggg==)![Upgrade Plan](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545142662/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/Screen_Shot_2018-12-17_at_2.56.02_PM.png)

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAHBAMAAADtx+DCAAABdGlDQ1BpY20AAHicY2BgKkksKMhhYWBgyM0rKQpyd1KIiIxSYL/DwM3AwyDEYMUgnphcXOAYEODDgBN8u8bACKIv64LMSvP8edOmtXz+FjavmXJWJTq49YEBd0pqcTIDAyMHkJ2cUpycC2TnANk6yQVFJUD2DCBbt7ykAMQ+AWSLFAEdCGTfAbHTIewPIHYSmM3EAlYTEuQMZEsA2QJJELYGiJ0OYVuA2MkZiSlAtgfILogbwIDTw0XB3MBS15GAu0kGuTmlMDtAocWTmhcaDHIHEMsweDC4MCgwmDMYMFgy6DI4lqRWlIAUOucXVBZlpmeUKDgCQzZVwTk/t6C0JLVIR8EzL1lPR8HIwNAApA4UZxCjPweBTWcUO48Qy1/IwGCpzMDA3IMQS5rGwLB9DwODxCmEmMo8BgZ+awaGbecKEosS4Q5n/MZCiF+cZmwEYfM4MTCw3vv//7MaAwP7JAaGvxP///+96P//v4uB9gPj7EAOACR3aeDXPqSpAAAAJFBMVEX19vj////2/P/y+P30+v729fX8/f74+fnc3+Hr8fTi5+v/8+BoxCKhAAAAWElEQVQI12MQBIIUFxcXY2NjBgYGdobsQEHBJCUlFaCQAYifCuIrL1JxmeViwNEJ5AcA+RadKp4dUyD80DDBJBUjFRdjEwOGCSB+OJDPpOJi6gLmi6GaDwDP6RXy8i0IRwAAAABJRU5ErkJggg==)![Included Pricing](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545142662/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/Screen_Shot_2018-12-17_at_3.00.55_PM.png)

We recommend the Blaze plan as you will end up paying a lot less (if anything) for all of your small projects. If you go with the Flame plan you are guaranteed to pay $25.

![](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gKESUNDX1BST0ZJTEUAAQEAAAJ0YXBwbAQAAABtbnRyUkdCIFhZWiAH3AALAAwAEgA6ABdhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGxmSfnZPIV3n7QGSpkeOnQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAGNkc2NtAAABbAAAACxjcHJ0AAABmAAAAC13dHB0AAAByAAAABRyWFlaAAAB3AAAABRnWFlaAAAB8AAAABRiWFlaAAACBAAAABRyVFJDAAACGAAAABBiVFJDAAACKAAAABBnVFJDAAACOAAAABBjaGFkAAACSAAAACxkZXNjAAAAAAAAAAlIRCA3MDktQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAABAAAADGVuVVMAAAAQAAAAHABIAEQAIAA3ADAAOQAtAEF0ZXh0AAAAAENvcHlyaWdodCBBcHBsZSBDb21wdXRlciwgSW5jLiwgMjAxMAAAAABYWVogAAAAAAAA81IAAQAAAAEWz1hZWiAAAAAAAABvoQAAOSMAAAOMWFlaIAAAAAAAAGKWAAC3vAAAGMpYWVogAAAAAAAAJJ4AAA87AAC2znBhcmEAAAAAAAAAAAAB9gRwYXJhAAAAAAAAAAAAAfYEcGFyYQAAAAAAAAAAAAH2BHNmMzIAAAAAAAEMQgAABd7///MmAAAHkgAA/ZH///ui///9owAAA9wAAMBs/9sAhAAICAgICQgJCgoJDQ4MDg0TEhAQEhMdFRYVFhUdLBwgHBwgHCwnLyYkJi8nRjcxMTdGUURARFFiWFhifHZ8oqLZAQsLCwsMCwwODgwREhASERkXFRUXGSYbHRsdGyY6JCokJCokOjM+Mi8yPjNcSEBASFxqWVRZaoFzc4GimqLT0///wAARCAAVAB4DAREAAhEBAxEB/8QAcwABAQEBAQAAAAAAAAAAAAAAAgAEBQcQAAEDAgUEAwAAAAAAAAAAAAECAxEAEgQFBhOBIUFRchZhYgEBAQEBAQAAAAAAAAAAAAAAAQAEAgURAAEDBAEDBQAAAAAAAAAAAAIAAREEElGRFQMxQRMUISIy/9oADAMBAAIRAxEAPwD1VOkcn77w5rd7+oyOl5vF0mD2h8NySSLXo9qeRqcjpHE0eD2pWjckBgB4j2q5GpyOlcTR4PaS9G5GkAjeM/qjkanI6VxNHg9rtrW3eQWifuKxQt97M8Q6nXEG2W1Hp2FUJc2bwpS0bQhBPFUKvaJh02VgggIjiKkiU+FoMGOgolMMs+KQ+6gBl7aVdJVaFyPEGuwIRd7gubEwuOoBkzMJ2vPeJSUHDhw2HIcsCb4B6+Youa+bfie0pcS9O277R+oRw6HW2rHXdxV03WhPECkyEnkRtbEyjpiQjBHc+Yhf/9k=)![Firebase Plans](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545142662/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/Screen_Shot_2018-12-17_at_2.57.48_PM.png)

Hosting Free limit on the Blaze plan

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAEBAMAAABrU5JsAAABdGlDQ1BpY20AAHicY2BgKkksKMhhYWBgyM0rKQpyd1KIiIxSYL/DwM3AwyDEYMUgnphcXOAYEODDgBN8u8bACKIv64LMSvP8edOmtXz+FjavmXJWJTq49YEBd0pqcTIDAyMHkJ2cUpycC2TnANk6yQVFJUD2DCBbt7ykAMQ+AWSLFAEdCGTfAbHTIewPIHYSmM3EAlYTEuQMZEsA2QJJELYGiJ0OYVuA2MkZiSlAtgfILogbwIDTw0XB3MBS15GAu0kGuTmlMDtAocWTmhcaDHIHEMsweDC4MCgwmDMYMFgy6DI4lqRWlIAUOucXVBZlpmeUKDgCQzZVwTk/t6C0JLVIR8EzL1lPR8HIwNAApA4UZxCjPweBTWcUO48Qy1/IwGCpzMDA3IMQS5rGwLB9DwODxCmEmMo8BgZ+awaGbecKEosS4Q5n/MZCiF+cZmwEYfM4MTCw3vv//7MaAwP7JAaGvxP///+96P//v4uB9gPj7EAOACR3aeDXPqSpAAAAKlBMVEX5+vv///729/g/Wn7x8vP09fZvhJ9FYIJnfZn//Pb++e3g7vr/4Yj524VH4IjZAAAAOUlEQVQI12MQFBQUcmBgYGAB4mRjC4Y5KwUFtoaGBrG4hjIkl1swzF0lKOQKkwfyQerB8i4uCkD1AGuYDFTrcREnAAAAAElFTkSuQmCC)![Free Included Items](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545142662/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/Screen_Shot_2018-12-17_at_3.01.55_PM.png)

# Create 4 Firebase Hosting Sites

You can name these whatever fits your project, if you using ajonp\* you will probably have issues as we am already using those.

- [ajonp-lesson-7 (Hugo)](https://ajonp-lesson-7.firebaseapp.com/)
- [ajonp-lesson-7-admin (Angular)](https://ajonp-lesson-7-admin.firebaseapp.com/)
- [ajonp-lesson-7-amp (Hugo)](https://ajonp-lesson-7-amp.firebaseapp.com/)
- [ajonp-lesson-7-app (Angular)](https://ajonp-lesson-7-app.firebaseapp.com/)

Example for your site:

- mysite
- mysite-admin
- mysite-amp
- mysite-app

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAQCAMAAAA25D/gAAAARVBMVEX6+vro6enj4+Tv7+/39/fg8frm5+jy8vLd3t7f8fn///86sOr5+fm+v7/b3N2l2vPz8/Pb7vfT1NXl8/nD5fZ4yO8cpegbcCJTAAAAeklEQVQYGX3BCw6CMBBF0TtDfRSBUj66/6VaosYEsOewtBULosKQj0XDWesIhdzmduBsGBBOhVA2/hK+3o7m8CXURffou/vH3LzlILR2R3MIOeRQCKPCMCoMo8IQlx59sQlx4tHpi+ckxKVtKlYxxp+U4pJiikWKu/EF39gGjbJevyYAAAAASUVORK5CYII=)![Example Site Creation](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545158121/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/axpst0mag0khcvqqlijc.png)

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAMAAACXfxyGAAAAM1BMVEX29/f7+/vt7e3n5+fy8/Pv8PLx8vL////9/f309fXi4uLp9fyysrLNzc2FhYVaWlqcnJwjgtsEAAABCUlEQVQoz62S0ZbDIAhEARHFpN3+/9cugya1fdinneTEzLnmCEyo+i77tJUql1iJW4pcDNY9LXA1cuoXNg3LTjfGbtW5n/Bh3BoXJ+7cofkk70vp8bWJiFsoTiHlcNXTGU9cJ7bADrysJn49R6gIQco/Z4GNrZT4cVapqAhyfj2kaL5PzLFeCrwJpbVLdBzR2G2PsDtuve+49ezbbqlp3Syao0q3ojg12gUcPUXndc28SFgTfs98znPh6CLeV4DAihDUDaHekWhmlpFsiki++mYZZVgcHrPG1EoZRVGNzEh0oOoUZo7hr38p8XOPxL8jaY8zEkdNM7FzSPF3JPgv/iWS9hHJ7PtP/QIb8Q9BixBODQAAAABJRU5ErkJggg==)![All Sites](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545160404/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/aaqgcyvubuggrk8fsqqm.png)

# Example Multiple Hugo Themes deploying to Firebase Multisite

> You don't need to install anything if you just deploy to Google Cloud. In this lesson reference [Cloud Build](https://ajonp.com/lessons/7-firebase-multisite-hosting/#cloud-build) Also see [https://ajonp.com/lessons/google-cloud-repositories-ci-cd](https://ajonp.com/lessons/google-cloud-repositories-ci-cd) for more details on CI/CD.

Once you clone [https://github.com/AJONPLLC/lesson-7-firebase-multisite-hosting](https://github.com/AJONPLLC/lesson-7-firebase-multisite-hosting.git) you can run it locally, but you must build out all of the sites before doing this.

## Remove git reference

Please remove the reference to AJONPLLC, then you can add any git repo you would like.

```
git remote rm origin 
```

## Add new reference

Create a new github site (or Gitlab or Google Cloud or...)

Then add the new repo back to your site using this command, replace **ajonp/a-sample-repo.git** with yours.

```
git remote add origin https://github.com/ajonp/a-sample-repo.git git push -u origin master 
```

## Steps for building hugo sites

1. Git Submodule commands, make sure you have [Git CLI](https://git-scm.com/downloads).

```
git submodule init git submodule update --recursive --remote 
```

This will update to the latest remote builds for ajonp.com, including both the content and themes that we host publicly

1. Hugo commands, make sure you have the [Hugo CLI](https://gohugo.io/getting-started/installing/) installed.

```
hugo -d dist/ajonp -v -t ajonp-hugo-ionic --config config.toml,production-config.toml hugo -d dist/ajonp-amp -v -t ajonp-hugo-amp --config config.toml,production-config.toml 
```

# Example Angular Project with Multiple projects deploying to Firebase Multisite

## Steps for building Angular sites

NPM commands, make sure you have [Node Js](https://nodejs.org/en/download/) installed.

```
npm install 
```

Angular commands, make sure you have the [Angular CLI](https://cli.angular.io/) installed.

```
ng build --prod --project ajonp-admin ng build --prod --project ajonp-app 
```

Serve locally using firebase, make sure you have [Firebase CLI](https://firebase.google.com/docs/cli/)

```
firebase serve 
```

# Google Cloud Builder - Trigger

Please add a trigger to your repository reference [Firebase CI/CD lesson](https://ajonp.com/lessons/google-cloud-repositories-ci-cd) for more details.

## Cloud Build

Now after having tried all of the manual build steps out, you really don't need any of them. You can run all of this in the cloud by setting up the commit trigger from above.

cloudbuild.yaml

```
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

If you would like to debug locally please make sure you read [Building and debugging locally](https://cloud.google.com/cloud-build/docs/build-debug-locally). This will require that you have [Docker](https://docs.docker.com/install/#server) installed locally.

### Install necessary components

Install docker-credential-gcr

```
gcloud components install docker-credential-gcr 
```

Configure Docker

```
docker-credential-gcr configure-docker 
```

Check to see if version is working

```
cloud-build-local --version 
```

### Build Locally

In the root directory of your project, you can then run this command (**don't forget** the "." as this tells Cloudbuild to use the current directory)

```
cloud-build-local --config=cloudbuild.yaml --dryrun=false --substitutions _FIREBASE_TOKEN=EXAMPLE . 
```

You will notice that this output matches what happens in the cloud when Google Cloud Build executes

Local Output

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

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPBAMAAAABlGKvAAAAGFBMVEX////7+/vi4uLm5ubu7u7x8fHr6+v4+PjZU1b4AAAAfklEQVQI112MMQ7CMAxFc4UOXMCueoAYuhM5BwhyxEzTmjlU5fxEQIDwtqdvP7OZll08tu7Z87WrmPul+8WsYAn2LEv0MTy9kAYOdZf2/manhBYWkVgdBiw/hAQYzEp//aR6EM4fdzOOc/7uTnucVPWcXz03ApyoBPt3v+k9AMF1IvdLQD3MAAAAAElFTkSuQmCC)![Google Cloud Builder Output ](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1545169224/ajonp-ajonp-com/7-lesson-firebase-multisite-hosting/ln3docmhljhbkphqio8a.png)
