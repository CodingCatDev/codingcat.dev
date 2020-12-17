---
title: 'Send GCP Build Status to Discord'
date: '2020-05-02'
---

https://youtu.be/J4ImOB5etB4

> You will need NPM (which comes with Node), create-react-app, and firebase-tools installed globally for this project. You will also need to add billing (with Credit Card), although you should not be billed at all for the project.  
> [https://nodejs.org/en/download/](https://nodejs.org/en/download/)  
> [https://reactjs.org/docs/create-a-new-react-app.html](https://reactjs.org/docs/create-a-new-react-app.html)  
> [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

## Creating a new project[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#creating-a-new-project)

You can choose to pick any type of project that you would like, for our example I choose a create-react-app (CRA). This way we still have options for running something within npm. However you could just as easily use this guide for Angular, Vue etc. You could even just write a text file and no site at all. I thought it would lend well to my next lesson of deploying the a storage bucket and CDN.You can create a new project by running and open in VS Code

```
npx create-react-app gcp-buil-discord
cd gcp-buil-discord
code gcp-buil-discord
```

### How to run build locally[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#how-to-run-build-locally)

The goal is to see a real life example for using Google Cloud build. In order to do this we will run the production build of CRA.[https://create-react-app.dev/docs/production-build/](https://create-react-app.dev/docs/production-build/)After running `npm build` command in the root of your project you will see a folder created like below.

![Production Build of CRA](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/vyqacxaixlityb1o0pvy.png)

## Setting Up GCP Project[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#setting-up-gcp-project)

Now it is time to start creating a new GCP project [https://console.cloud.google.com/](https://console.cloud.google.com/). If you already have an acccount you can skip to the existing users section.

### New Users[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#new-users)

If you do not have an account you will be presented with the screen below. You must agree to the Terms of the platform and APIs.

![New Users GCP Agreement](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/sglpyu5cac9ype7ymsts.png)

I would recommend trying out the 12 months $300 free trial so you can checkout everything that GCP has to offer.

![GCP Home Screen for new user](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/gcx2dodan98lpzjhvvo4.png)

To start a project you can now follow the existing Users guide.

### Existing Users[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#existing-users)

Click on Select a project from the toolbar at the top of the screen.

![Select New project](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/yqdauwrltxxaj0qbequm.png)

Name your new project something meaningful, for example `gcp-build-discord`.

![New Project Screen](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/rnrpzm2o7rmb3etqqtjd.png)

## Setting Up a GitHub Repo[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#setting-up-a-github-repo)

> Making an assumption that you have created a GitHub account before. [https://github.com/join](https://github.com/join)

You should see a "New" button inside of your home page like below.

![New GitHub Repo](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ckvk74hlztjw2gjfuu26.png)

Enter a Repo name that will work for you like below, remember this as we will use it within our Google Platform Cloud Build.

![Github new Repo](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/gqmw6oivrrhuaxljivgw.png)

Now you can run the below command in your project to add GitHub as your upstream remote.

```
git remote add origin git@github.com:ajonp/gcp-build-discord-webhook.git
git push -u origin master
```

## Connecting GitHub to Cloud Build[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#connecting-github-to-cloud-build)

If this is your first time using Cloud Build, you will need to enable the API. Please note the fees related if you start to use 2 hours of build time in a given day (I know a lot).

### New Users[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#new-users)

![Cloud Build API Enable](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/nzjmoujzmlycncvnab3w.png)

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/tc8vmnlobbpyqxqbrzcv.png)

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/nxadf61udajozqxcjnb6.png)

Follow the next prompts to setup your billing with Credit Card.

### Existing Users[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#existing-users)

You will receive a prompt to Enable Cloud Build API, if you receive a failure make sure to add billing to your account.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/kd2wdwmh0betkxziwvtr.png)

Now you can connect you GitHub repository.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/u3nvhbzbztpzb3pugh87.png)

Select the GitHub Source

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/aoubjv1oc8oeemcc99vg.png)

Once you authenticate you will see all of your repositories listed select the one you want to connect with our trigger, for example `gcp-build-discord-webhook`.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ad97eabjaqgrxxgopoti.png)

After you connect you will see that a push default push trigger can be setup, go ahead and create the default push trigger.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/afydsyw0qg0zvjynltj2.png)

You will see a screen similar to below showing the new trigger, you can get into the details of this trigger further, but for now it is enough to trigger on any `git push` that we run.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/wrmdtvcbjlgbbintwzgc.png)

## Cloud Build YAML[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#cloud-build-yaml)

For our example react project we have two phases that are going to trigger

1. `npm install` - which will install all of our dependencies
2. `npm run build` - which will create our production build folder

This file will be located in the root of your project and called `cloudbuild.yaml`.

```
# Simple React Build
steps:
- name: node:10.15.1
  entrypoint: npm
  args: ['alex']
- name: node:10.15.1
  entrypoint: npm
  args: ['run', 'build']
```

Once you add this you can now run the below command to push our new commit.

```
git commit -m 'first push' && git push
```

If you like to use VSCode to push instead like below.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/tiwn1ylw8mi3nsvdwufr.png)

Back in Google Cloud Console https://console.cloud.google.com you should see a newly triggered build, like below.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/nir1tlr9bj8vkepj8uev.png)

## Pub/Sub Topic Creation[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#pubsub-topic-creation)

You can look for Pub/Sub under Bit Data, otherwise you can simply search for it.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/lqbbycm08uddcvvfiumc.png)

Select Create Topic so we can create a new **`cloud-builds`** topic that Google Cloud Build triggers during each job. Please note the topic must be exactly this name! Here you can find more details [https://cloud.google.com/cloud-build/docs/send-build-notifications](https://cloud.google.com/cloud-build/docs/send-build-notifications)

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/ulqigk5g0qk6u2xluroi.png)

## Initialize Firebase[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#initialize-firebase)

> If you haven't installed firebase-tools, please do that before run this section [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

Within the root of your project you can run the command `firebase init` to setup Firebase Cloud Functions. Select Functions by hitting the space bar, then hit enter to continue.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/jo2fxupjqc54ad2anbtk.png)

We will be using TypeScript in our example, but you could also choose JavaScript if you have done this type of thing and prefer it.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/iiosxepfzhepkjs1os0d.png)

## Creating Firebase Cloud Function for Pub/Sub[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#creating-firebase-cloud-function-for-pubsub)

In your root folder you will find a new directory called functions. Navigate to `functions/src/index.ts` file and uncomment the default `helloWorld` function and we will push this as well just to see the difference on functions.  
In the video I walk through how you can use Pub/Sub to walk through console logging and other options in your build before running the actual function. Here I will just add the final code code so that you can implement and try it directly.Within the `functions/src` directory add a new directory and file with the final path being`functions/src/DiscordBuildHooks/DiscordBuildHooks.ts`

```
import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

export const gcpBuildTriggerDiscord = functions.pubsub.topic('cloud-builds').onPublish(async (pubSubEvent) => {
    const build = JSON.parse(Buffer.from(pubSubEvent.data, 'base64').toString());
    const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
    if (status.indexOf(build.status) === -1) {
        console.log('Status not found');
        return false;
    }

    try {
        const msg = createBuildMessage(build);
        return sendDiscordBuildPost(msg);
    } catch (err) {
        console.log(err);
    }
});

const sendDiscordBuildPost = async (body: object) => {
    console.log(Calling Discord wtih, JSON.stringify(body));
    const result = await fetch(functions.config().discord.build_hook, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    });
    console.log(result.json());
}

const createBuildMessage = (build: GoogleCloudBuild) => {
    const embeds: Embed[] = [];
    const msg = {
        content: Build ${build.id} for project ${build.projectId} was a ${build.status}  +
            took ${(<any>new Date(build.finishTime) - <any>new Date(build.startTime)) * .001},
        tts: build.status === 'FAILURE' ? true : false,
        embeds: embeds
    }
    if (build && build.steps) {
        build.steps.forEach(step => {
            let time = '';
            if(step.timing && step.timing.endTime){
                time = took ${(<any>new Date(step.timing.endTime) - <any>new Date(step.timing.startTime)) * .001}
            }
            embeds.push({
                title: step.name,
                description:
                    ${step.entrypoint} ${step.args.join(' ')} ${time} and ${step.status},
                color: build.status === 'FAILURE' ? 16714507 : 6618931
            });
        });
        msg.embeds = embeds;
    }
    return msg;
}

export interface Embed {
    title?: string;
    description?: string;
    color?: number;
}

export interface GoogleCloudBuild {
    id: string;
    projectId: string;
    status: string;
    steps?: Step[];
    createTime: Date;
    startTime: Date;
    finishTime: Date;
    buildTriggerId: string;
    options: Options;
}

export interface Options {
    substitutionOption?: string;
    logging?: string;
}

export interface Step {
    name: string;
    args: string[];
    entrypoint: string;
    timing: Timing;
    pullTiming: Timing;
    status: string;
}

export interface Timing {
    startTime: Date;
    endTime: Date;
}
```

In order for your function to be exposed we need to add this to your index.ts file as well with the final code looking like below.

```
import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

export { gcpBuildTriggerDiscord } from './DiscordBuildHooks/DiscordBuildHooks';
```

Final folder structure

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/nomvcdtnarxbeqxu3dq0.png)

**Before** deploying this function we will need to setup a Discord Web hook and add it to our firebase configuration.

## Discord Webhook[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#discord-webhook)

> You must register on Discord and have rights to manage Webhooks for this part.

### Creating Hook[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#creating-hook)

Select a given channel that you want to create a hook in and go to settings, by clicking the gear icon.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/m2ziqzqt48e38elyujoe.png)

Next navigate to Webhook and click Create Webhook.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/vfhybjpzqkj7kvxxmtqg.png)

You will then need to copy the webhook url so we can add it to our Firebase Cloud Function configuration.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/kwsujtpicxhbfg4gkgq1.png)

> Make sure you keep all of your webhooks private!

## Firebase Cloud Function Config[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#firebase-cloud-function-config)

In the video we go into greater detail if you would like to know more about adding a configuration to Firebase Cloud Functions. You may have noticed in the above code this line `functions.config().discord.build_hook` . This is how Firebase Functions can read configurations. You are going to set this configuration with your Discord Webhook URL.The reason we don't just hardcode this is that we need to keep it private and out of our git repo. There is an argument that this is not the safest place to keep secrets and if you want to take this a step further look into [https://cloud.google.com/kms](https://cloud.google.com/km)

```
firebase functions:config:set discord.build_hook=<YOUR_WEBHOOK>
```

## Deploy Firebase Cloud Functions[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#deploy-firebase-cloud-functions)

Now that you have your configuration set and all of the code you will need it is time to deploy your functions.

```
firebase deploy
```

If you find later you are working on front end hosting and want to only deploy functions you can run the below command.

```
firebase deploy --only functions
```

### Firebase Console[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#firebase-console)

You can now see your functions listed inside of the Firebase Console.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/h8yapwpufjrqacjpbvfc.png)

If you want to see if your Cloud Functions are working correctly you can trigger your `helloWorld` function by entering the url into a browser, here is an example.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/qi16dgcceqtnvznrmwlp.png)

## Trigger Your Build[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#trigger-your-build)

It is now time to try building your project to see if our full flow is working as expected  
`GitHub->Google Cloud Build->Pub/Sub->Firebase Functions->Discord`So commit and push all of your changes.

```
git commit -m 'first push' && git push
```

You will see the below messages in Discord (notice the bugs, fix them :D)

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/nkvwcbi7eaymv4j86sjn.png)

## Failure tests[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#failure-tests)

1. Try changing the name of your `cloudbuild.yaml` file to `failurecloudbuild.yaml` and see if it fails.
2. Putting back `cloudbuild.yaml` if you changed it above. Now inside of cloudbuild.yaml you can change the arguments to something npm doesn't understand like 'alex'. This will trigger a failure build within a step and send it to Discord.

This should trigger the two messages below in Discord

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/dfi6k79wwf75cuxp4nz4.png)

## Trouble Shooting[](https://codingcat.dev/lessons/send-gcp-build-status-to-discord#trouble-shooting)

If you find something is wrong with your function check the logs, you might find some bugs I missed.

![TODO_UPLOAD](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/uploads/bsc5yxrimrrrmvppxsmu.png)
