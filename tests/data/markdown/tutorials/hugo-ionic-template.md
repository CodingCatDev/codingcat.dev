---
title: "Hugo Ionic Template"
date: "2018-12-12"
---

https://youtu.be/tgXFNqInA0w

> Please note that while working through this lesson I chose to make branches instead of tags to see if people would enjoy that more. However there was an update to the Victor/Hugo template to start using webpack and I don't want to confuse anyone, so please don't pull the master branch to start.

- master (initial)
- netlify-victor-hugo (moves everything to npm setup)
- complete-lesson-4 (has everything you need to go-live)
- prod (shows the example trigger, as well as moving over to git submodule)

## Official Documentation

[Google Cloud Build - Deploying Artifacts](https://cloud.google.com/cloud-build/docs/configuring-builds/build-test-deploy-artifacts#deploying_artifacts)

## Lesson Steps

1. Clone Lesson 4
2. Add Netlify Victor/Hugo template to project.
3. Update branding.
4. Configure Firebase Hosting
5. Configure Algolia Indexing
6. Configure Google Cloud Build

# Add Netlify Victor/Hugo template to project

## Get the initial setup

You can follow along step-by-step at the [Initial Setup Lesson](https://ajonp.com/lessons/ajonp-hugo-ionic-template), and [YouTube Video](https://www.youtube.com/watch?v=CZmEZ62yMFA).

Or you can start by cloning [Hugo Ionic](https://github.com/AJONPLLC/lesson-4-hugo-ionic.git) from GitHub, we are using a specific branch to start this lesson as the master was for the original lesson.

```
git clone --single-branch -b netlify-victor-hugo https://github.com/AJONPLLC/lesson-4-hugo-ionic.git
```

## Structure

|--site                  // Everything in here will be built with hugo |  |--content          // Pages and collections - ask if you need extra pages |  |--data              // YAML data files with any data for use in examples |  |--layouts          // This is where all templates go |  |  |--partials       // This is where includes live |  |  |--index.html  // The index page |  |--static            // Files in here ends up in the public folder |--src                  // Files that will pass through the asset pipeline |  |--css               // Webpack will bundle imported css seperately |  |--index.js         // index.js is the webpack entry for your css & js assets

## Running Hugo

You can still run this project as a normal hugo site at this point, by running the command while in the site folder.

```
cd site/ && hugo serve
```

> Make sure to return to your root folder `cd ..`

## Running Victor/Hugo

There are a few additional requirements at this point that we need to install.

Install the files via npm npm comes with [NodeJs](https://nodejs.org/en/download/)

```
npm install
```

Start a browsersync server

```
npm start
```

You should see something like:

```
[13:29:18] Starting 'server'...
[Browsersync] Access URLs: --------------------------------------
Local: http://localhost:3000 External: http://192.168.86.23:3000 --------------------------------------
UI: http://localhost:3001 UI External: http://localhost:3001 --------------------------------------
[Browsersync] Serving files from: ./dist
[13:29:34] Starting 'hugo'... [ '-d', '../dist', '-s', 'site', '-v' ]
```

## Update to use Victor/Hugo asset pipeline

Why this becomes powerful is that you can start installing all of your favorite npm modules and importing them like you would with most non-static projects.

Copy the baseof.html file from our theme to our base directory so that we can override the themes file.

```
mkdir site/layouts && mkdir site/layouts/_default && cp site/themes/ajonp-hugo-ionic/layouts/_default/baseof.html site/layouts/_default/baseof.html
```

> Remember to edit baseof.html in your files not the themes (or they won't be saved.)

Now we are going to edit the baseof.html and remove these two lines (just before `</head>`)

```
<link href="{{ "/css/custom.css" | absURL }}" rel="stylesheet" as="style" type="text/css">
<link href="{{ "/css/syntax.css" | absURL }}" rel="stylesheet" as="style" type="text/css">
```

These were originally coming from our site folder, both in theme and direct, we are going to update this file to allow for victor/hugo to handle this requirement. So we will replace that line in the html with

```
<link rel="stylesheet" href="css/main.css">
```

Also while we are in /site/layouts_default/baseof.html add a reference right above `</body>`.

```
<script src="app.js"></script>
```

You should now see the theme change back to the stock Ionic Blue color, as we have not moved our styles to the source location. However there will be a new addition to the console in debugger.

Subscribe to ???? [AJonP's Youtube Channel](https://www.youtube.com/channel/UCnKZ8gEb78zXKMi1ns-IQ2g)

Move our `custom.css` file to the source folder.

```
mv site/static/css/custom.css src/css/imports/custom.css
```

Now we need to import this file into our src/css/main.css

```
/* You can use import statements to include partials: */
@import "imports/reset.css";
@import "imports/custom.css";

/* Or add your statements here: */
body{
  font-family: sans-serif;
  font-size: 1em;
  text-align: center;
}
```

## Example of loading software to use

Lets try adding something simple that we might use like lodash

```
npm install lodash
```

Now this will be avalabel for us to use in our app.js or any other file we would like to reference the module.

src/js/app.js

```
console.log(</span><span class="token template-string token">Subscribe to ???? <a href="https://www.youtube.com/channel/UCnKZ8gEb78zXKMi1ns-IQ2g">AJonP's Youtube Channel</a></span><span class="token template-string token template-punctuation">); var _ = require('lodash'); console.log(_.VERSION);
```

In the console you will now see the current version of lodash.

# Update branding

I am sure that you love looking at AJ on your favicon and manifest (he likes being there ????). But you probably want to update a few things.

## icons

In the `themes/ajonp-hugo-ionic/static/icons` folder you will find several images that can be used for your manifest file. I typically use [www.favicon-generator.org](https://www.favicon-generator.org/) to update these files based on an image that I create. You can now add all of these images to `site/static/icons` so they can be referenced later in manifest.json or anywhere in your site.

## manifest.json

You should update this file to reflect any changes in your icons folder.

```
{
    "name": "AJonP",
    "manifest_version": 1,
    "short_name": "AJonP",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#FFFFFF",
    "theme_color": "#3D2D4D",
    "gcm_sender_id": "103953800507",
    "icons": [{
                "src": "/icons/android-icon-36x36.webp",
                "sizes": "36x36",
                "type": "image/png",
                "density": "0.75"
            }, ...
```

## Favicons

If you are using an older browser the main icon that goes in your browser will be used by `/site/static/favicon.ico`. Otherwise you should hvae larger images spelled out in the `themes/ajonp-hugo-ionic/layouts/partials/head.html`, they look similar to this...

```
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.webp" />
<link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.webp" />
<link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.webp" />
```

Please feel free to update the entire head.html partial, or any of the layouts for that matter AJ doesn't mind too much ????.

## Configure Firebase Hosting

Please make sure to checkout [Google Cloud Firebase CI/CD](https://ajonp/lessons/2-firebase-ci) for a great example.

### Quick steps

```
firebase init
```

Select Hosting

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAIBAMAAAAckVIXAAAAIVBMVEUgISAsLCwlJSU0MyQ/Pz8eHh4sLCJEREQyMjI7PDs9PSYYg1z0AAAAaUlEQVQI12MIM0tOTk5QMjMIBQOGqOTFq7JWLbZKhfLDgg2MjdPSjGHygoISGhKCgqqhUH6ni8tEJiUlJSYmJSYFJSaGyintUzxnCjZKaAgKNgkKMrSUlLu4ezSFwtRPdy8pKSkUYIACABl6IbnKjiLQAAAAAElFTkSuQmCC)![Firebase Hosting](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544643924/ajonp-ajonp-com/4-lesson-hugo-ionic/xujgloub1npwpgvlccbx.png)

Pick your project

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAKBAMAAABRWfMcAAAAJ1BMVEUeHh5ISEg9PT1AQEBFRUU3NzcxMTFCQkJNTU0qKio6SEk1QUNTU1Nw6iYZAAAAiElEQVQI12NQnhSq7uZWYuZsahokmCzGUCrmqChsbipSEmLa0drZzqCpaTzTsixVKUmJAQx42nTEHY8KiioWOkqC+IyiFUViLhriQp4QeRbRCiNRF1UTJUHjIvcAEL9QzV3dhAEGZi1dtXt11urVu1dBzTvUU9Rh056Zlgbhc7QKpjQLmsGUAwC+CyEGpUdhLwAAAABJRU5ErkJggg==)![null](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544644014/ajonp-ajonp-com/4-lesson-hugo-ionic/tlxmijckkvljjqoxc1wc.png)

Set the output folder to dist, and select no for rewrite all urls.

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAJBAMAAADXzYGyAAAAIVBMVEUeHh5CQkI8PDw2NjZPT09HR0cwMTBLS0skKiZVVVUoNDXFlW5uAAAAYklEQVQI12PoFFdyElIVlRQPL17BAAQtLqGJri5BLkFBwaaT3FcwNIVNmerMgABtYoUh6g0IfrOQoaJikplLURiMLyisGGSUOlMCroQDSTtDcmWouOS0IgE43yjZzMgALg0AbisVuut5y1IAAAAASUVORK5CYII=)![null](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544644082/ajonp-ajonp-com/4-lesson-hugo-ionic/q6k1sok8avnqqesglkmq.png)

## Configure Algolia Indexing

First signup on [www.algolia.com/](https://www.algolia.com/).

### Algolia Signup

About You! [Algolia Signup about](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652567/ajonp-ajonp-com/4-lesson-hugo-ionic/oal4d7yzzwkxdovyoxov.webp)

Your Datacenter! [Algolia Your Data Center](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652629/ajonp-ajonp-com/4-lesson-hugo-ionic/ohsotz84xgeeodrunlkr.webp)

Your Project Type - Depends on what you are making but I would choose Media for most sites.

![](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAcHBwcHBwgJCQgLDAsMCxAPDg4PEBkSExITEhklFxsXFxsXJSEoIR4hKCE7LykpLztFOjc6RVNKSlNpY2mJibgBBwcHBwcHCAkJCAsMCwwLEA8ODg8QGRITEhMSGSUXGxcXGxclISghHiEoITsvKSkvO0U6NzpFU0pKU2ljaYmJuP/AABEIABMAHgMBIgACEQEDEQH/xABxAAADAQEAAAAAAAAAAAAAAAAABwgGBRAAAgAFAwMBCQAAAAAAAAAAAQIAAwQREgUGIQcTMbMVIiNBUWWBocEBAQEBAAAAAAAAAAAAAAAAAAMEAhEAAgEDBQEAAAAAAAAAAAAAAAECESExAxMyM3GB/9oADAMBAAIRAxEAPwCh5NTNScUuzAswGbrYc3+QvCF6yjLc+nD7avqPFArw3gj8GE31D3CNt71o6o0Muqz0Xs4ObAZTiYbSb3KpXozLwT/NlZZE393jzb+RzqiUZWJvwY0249WfWtUq640Uum74T4S3IXBAnBxEY6cpQgEiLKsNlzSKypQWEz9CEB1jmvO1/T2c3Ps9fUeCCCikp2Rt4Flo6o9YQ6I4wPDqGHkfWM60EEUS4x+k67J+RP/Z)![Algolia Your Project](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544652688/ajonp-ajonp-com/4-lesson-hugo-ionic/ozjk0vuaneigikbl8oo0.png)

> Pick Dashboard once you get here

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAASCAMAAAB7LJ7rAAAASFBMVEX////n6fDw8fPW5Pvu8Pb8/v/5+fr8/P309fbs7fXr7PLd4Obh5OtXpfLy9v5Rjenj6f3X6v3Q3/nO2frs7/7D0/aWzfqm1fu+azDAAAAAqklEQVQoz52O2Q7DIAwEzWUTIIRc7f//aW1TJX1o8pAREqNdbAHwQ2vbRnCJW12r1zVQpbt2WZdw09d9gaeUXHLO5tEs/TH2nItVQTbdTNHko48KhyR30Ic9Q6mtjXwiEVlVq7VEWqcUEXXGWmRI9qBGkjbn5qofcmyzGLmeET+dpnF8cYhNbOQ07mJvrj1QYGSNh0BdewhaDx2T+p2Y4cCD75iTUkr6pv4Djy0HSwbIJJ0AAAAASUVORK5CYII=)![Algolia Dashboard](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544652806/ajonp-ajonp-com/4-lesson-hugo-ionic/fkzflzgad0cgqovz11r4.png)

You can run the tutorial or just skip for now.

Now select Indicies, and Create Index! [Indicies](https://res.cloudinary.com/ajonp/image/upload/q_auto/v1544652891/ajonp-ajonp-com/4-lesson-hugo-ionic/hswlxadds5sens0rb0s5.webp)

### Create Index

Example of an Index Creation

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAPCAMAAADEZI+uAAAAOVBMVEX////s7e7i4uTGx8ru8f3l5ujp6ev6+vr3+P/w8v7d7NyNwYDn6/7e4/2v1qHX19rx8fK626/n6v0AcNrzAAAAbklEQVQY04WQWw6AIAwE6WK74gMf9z+sbfwyARwIJAxbSBPTACY7cvbZtkw/ae5zlxJaFAYx880Xgampig/OofU9gojf+NQOvfWLhwagg69NA0L7251w6LuUqbTZ/tvS7iZZa706+gS4OoP04vABTxQGBWWgOFYAAAAASUVORK5CYII=)![Example Index](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544652920/ajonp-ajonp-com/4-lesson-hugo-ionic/jrklg9odo7to6mwdxhks.png)

API Keys are where we can now get the remainder of our information that we will need.

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUBAMAAABohZD3AAAAG1BMVEX4+Pn////7/P3y8/Xv8PPV1tbs7O/Oz9Pm5unxmAFQAAAAlElEQVQY032PTQrDIBBGv0wuED1B4glila4DFW9Qus0i9Ao5QEA8dmdsaZRCH4LzmD/Fvu/3Dw+OETfv3Qmsqhlg82GYiUWD2B19Pa7DT/2Mmh52xNTMS3kFOgUYPuzedZK5huBuMs/N7f50tB4EO5ZrYe97gJQuaS3zlv/vmWrkf/liuDI9t7jJfkNE7Kbw7qez/wVD4iaFzbC9LgAAAABJRU5ErkJggg==)![null](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544653048/ajonp-ajonp-com/4-lesson-hugo-ionic/oqpgcjirolsqwkdkw3ov.png)

## Add Algolia for Search

> In your site/config.toml file you will see params.algolia. These are used just for the search bar to make the search happen...do not use your Admin API KEY!!

```
 # Search Only [params.algolia] appId = "C1OJ9HOH3E" apiKey = "f61b2bf395516ca150fc7b75281190ab" indexName = "example"
```

You will notice a section later when we use Cloud Depoy that will require you to add

- ALGOLIA_APP_ID
- ALGOLIA_ADMIN_KEY
- ALGOLIA_INDEX_NAME
- ALGOLIA_INDEX_FILE

## Configure Google Cloud Build

An important part to any project is setting up a solid CI/CD pipeline (Continuous Integration/Continuous Delivery). I still believe that Google Cloud offers the best pricing for any size development team! If you are a very small shop you will run builds for free, for a very long time.

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAATBAMAAAB1gKBPAAAAIVBMVEX5+vv8/f3////z8/Tr6+zv8PDl5eb39/fe39/s8/3Pz9D7/VX8AAAAjklEQVQY02PI6FixrKNVCQYYwlLc0sJSEHzj0nLjUmNj43BjBgYQn728vLyYgaG8vIBhIoivhAoYBFEBg4CLAQMEsDiDSIGOACifrRXMZ4CBggJUPgQItGWkpSWA1QdglWdgYEfhh5oGQ2xkDTUGMgRcXEIcIHyXkABM/ejuR+ebJIeEuABBSEjozJkzkwG3jCWvv/oo5QAAAABJRU5ErkJggg==)![Google Cloud Pricing](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544644850/ajonp-ajonp-com/4-lesson-hugo-ionic/xwfyo6ysbxykebpf4wzo.png)

## Docker Images / Cloud Build

> I found out recently from [Mike McDonald](https://twitter.com/asciimike), that there are a great set of [Google Cloud Platform Community Images](https://github.com/GoogleCloudPlatform/cloud-builders-community). They should work really well most of the time, but you might have to be careful on versioning. For instance Hugo is currently at .49 and I need something above .50 for my site. This is why I remain using my own Docker files.

### cloudbuild.yaml

This file controls all of the steps necessary throughout our build process. You can manually execute each step locally to see that everything works as expected on your docker images.

```
steps:
# Build the hugo image
- name: 'gcr.io/cloud-builders/docker' args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/hugo', './dockerfiles/hugo' ]
# Git the submodules, run npm install, hugo build
- name: 'gcr.io/$PROJECT_ID/hugo' args: ['bash', './deploy.sh']
# Algolia index update
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','algolia'] env:
  - 'ALGOLIA_APP_ID=${_ALGOLIA_APP_ID}'
  - 'ALGOLIA_ADMIN_KEY=${_ALGOLIA_ADMIN_KEY}'
  - 'ALGOLIA_INDEX_NAME=${_ALGOLIA_INDEX_NAME}'
  - 'ALGOLIA_INDEX_FILE=${_ALGOLIA_INDEX_FILE}'
# sw-precache
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','generate-service-worker']
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker' args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase' ]
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase' args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
# Optionally you can keep the build images
# images: ['gcr.io/$PROJECT_ID/hugo', 'gcr.io/$PROJECT_ID/firebase']

```

Please checkout all of the [cloud builder images](https://cloud.google.com/cloud-build/docs/cloud-builders).

### Step 0 and 1

Docker is an available image we will use this to create our own image instance from our Dockerfile in dockerfiles/hugo/Dockerfile. The Google Cloud build image Node seems to offer a lot of the tools we will need already so we just add Hugo into this Dockerfile.

```
FROM node
LABEL author="developer@ajonp.com"

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        asciidoc \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        python \
        python-pygments \
        rsync \
        software-properties-common \
        devscripts \
        autoconf \
        ssl-cert \
    && apt-get clean

# Download and install hugo
ENV HUGO_VERSION 0.51
ENV HUGO_BINARY hugo_${HUGO_VERSION}_Linux-64bit.deb

#ADD https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} /tmp/hugo.deb
RUN curl -sL -o /tmp/hugo.deb \
    https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/${HUGO_BINARY} && \
    dpkg -i /tmp/hugo.deb && \
    rm /tmp/hugo.deb

# confirm hugo
RUN hugo env
```

The next step in this will execute our local file `deploy.sh` so that we can execute a few key commands. The purests out there will say that we can execute both the git command and the npm commands using the two external images. I find that it is faster to not spin up a new image since we are sitting in a node image already for npm. The git submodule also is a bit of a pain because you have to go through a complicated process (from what I have gathered) to either link github to google source repos or create tokens for one off logins.

```
#!/bin/bash echo -e "\033[0;32mAdding Submodules...\033[0m" git submodule init git submodule update --recursive --remote echo -e "\033[0;32mInstalling via npm...\033[0m" npm install echo -e "\033[0;32mBuilding via npm...\033[0m" npm run build
```

1. Update any submodules (like our theme).
2. Install all of the victor/hugo dependencies (or all other).
3. Run the build command which will push all of our files to the `/dist` folder.

### Step 2

Now I know everything I said up above about npm image...sorry for any confusion. However, I thought it was better to leave these npm commands seperate from the deploy as they are not required and can be easily commented out of your builds.

In the case of this evn variables, we can again leave these out of the public git repos of the world and only have them stored wihtin Google Cloud builder [variable values](https://cloud.google.com/cloud-build/docs/configuring-builds/substitute-variable-values), using the notation `${_variable}`.

```
# Algolia index update
- name: 'gcr.io/cloud-builders/npm'
  args: [ 'run','algolia']
  env:
  - 'ALGOLIA_APP_ID=${_ALGOLIA_APP_ID}'
  - 'ALGOLIA_ADMIN_KEY=${_ALGOLIA_ADMIN_KEY}'
  - 'ALGOLIA_INDEX_NAME=${_ALGOLIA_INDEX_NAME}'
  - 'ALGOLIA_INDEX_FILE=${_ALGOLIA_INDEX_FILE}'
```

This is again using `atomic-algolia` to look at our newly created `dist/algolia.json` file and compares that to what is in the Algolia index.

### Step 3

Want a PWA still? Then we need to have a service worker. No AJ not an Animal service worker. ????

```
# sw-precache
- name: 'gcr.io/cloud-builders/npm' args: [ 'run','generate-service-worker']
```

### Step 4 and 5

> Please make sure to checkout [Google Cloud Firebase CI/CD](https://ajonp/lessons/2-firebase-ci) for a great example.

The biggest item that you need to remember here is adding your token to the cloud builder.'

Make sure to checkout [Firebase Administrative Commands](https://firebase.google.com/docs/cli/#administrative_commands)

```
firebase login:ci
```

```
# Build the firebase image
- name: 'gcr.io/cloud-builders/docker'
  args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/firebase', './dockerfiles/firebase' ]
# Deploy to firebase
- name: 'gcr.io/$PROJECT_ID/firebase'
  args: ['deploy', '--token', '${_FIREBASE_TOKEN}']
```

Now you should have your full [Hugo](https://gohugo.io/) site up and running on [Firebase Hosting](https://firebase.google.com/products/hosting/)!
