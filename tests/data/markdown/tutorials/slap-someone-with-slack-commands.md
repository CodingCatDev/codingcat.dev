---
title: "Slap Someone with Slack Commands"
date: "2019-08-24"
---

https://youtu.be/3A4iucpZiwo

## Slappy Slack

So one of the Purr-fect Peeps on the channel wanted a fun `/slap` command added to our Slack channel. I basically said, challange accepted! A quick Google search led me down the right path and found [Spicefactory Slapbot](https://spicefactory.co/blog/2015/12/09/slapbot-for-slack-good-old-slap-available-again/). I cloned this and then started making some tweaks!

![slap challenge](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_12.08.04_PM.png)

## Installation

> Note you could run this as a stand alone node server, but I chose to utilize Firebase Cloud Functions since the plan is to add some Machine Learning later.

Before continuing I am committing the files `.firebaserc` and `firebase.json`, mainly so I can keep making changes. For your project you will want to delete these files before you begin with the project setup and Firebase initialization.

## Initialize Firebase

> Docs for setting up [Firebase CLI](https://firebase.google.com/docs/cli).

```
firebase init
```

When presented with your choices arrow down and hit space bar on `Functions: Configure and deploy Cloud Functions`.

![Firebase Functions select](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_12.26.04_PM.png)

If you would like to start using a new project select `Create a new project`, for more info checkout [Firebase Init Docs](https://firebase.google.com/docs/cli).

After that you can select Javascript

![JS selection for firebase init](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_12.26.20_PM.png)

For the final settings select N (No) for everything except "Do you want to install dependencies with npm now?", for this Y (Yes).

![Firebase init Selections](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_12.27.07_PM.png)

.

Now that you have this complete you should see two new files `.firebaserc` and `firebase.json`.

## Deploy Functions

As it stands right now, this will allow you to test locally (not the intent of this lesson). What we really want is to deploy this to Firebase so that Slack can access it. Since our project should all be setup at this point we just use the deploy command.

In order for us to access an external network you will need to switch your Firebase Subscription for this project, I recommend the Blaze plan as you will not get charged until you go over 125K Invocations a month, I don't know about your slack fans but that would be very impressive! You can select Modify project at the bottom left of the screen and it should open a modal like below.

![Firebase Modal](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_1.31.47_PM.png)

Now it is time to deploy our function:

```
firebase deploy
```

It should result in a successful creation of a cloud function with this output:

![cloud deploy output](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_1.24.11_PM.png)

You can check in the [Firebase Console](https://console.firebase.com/) under Develop->Functions

![Functions in Console](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_1.28.22_PM.png)

### Example of local testing

```
firebase serve
```

This command will output where the emulator is running.

```
=== Serving from '/Users/ajonp/Documents/Web/slapbot'... ⚠ Your requested "node" version "8" doesn't match your global version "10" ✔ functions: Emulator started at http://localhost:5000 i functions: Watching "/Users/ajonp/Documents/Web/slapbot/functions" for Cloud Functions... ✔ functions[api]: http function initialized (http://localhost:5000/ajonp-slack-slap/us-central1/api).
```

So if you want to throw some curl commands at it you could like:

```
curl -X POST \ 'https://us-central1-ajonp-slack-slap.cloudfunctions.net/api/slap?callback=YOURCALLBACK' \ -H 'Content-Type: application/x-www-form-urlencoded' \ -H 'cache-control: no-cache' \ -d 'user_name=ajonp&text=slappy&channel_id=1234&undefined='
```

## Slack Configuration

Go to Slack services section https://<your_slack_team>.slack.com/apps. For example [https://ajonp-com.slack.com/apps](https://ajonp-com.slack.com/apps).

### Incoming Webhook

First we need a way to have Slack accept our `/slap` messages coming back into Slack's system for our account. We will add an inbound Webhook to allow this interaction to succeed.

![slash incoming webhooks](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_1.37.36_PM.png)

- Choose any channel to post to (don't worry, bot will use the channel you type in when you do your slapping)
- Copy and paste tha token part of the URL that you got (it will be something like :

```
https://hooks.slack.com/services/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
```

- So it would be the `/T2UR5KNQ2/BMNTDRAG0/mPToTmuARk2BqYhn93Izzbbb` portion as we will need this for our slash command.

![Full configuration](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_1.41.05_PM.png)

### Slash Command App

Now we need to add and app for the slash command configuration.

![Slash Command Search](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-24_at_12.49.28_PM.png)

Put in the URL your service url or you can use ours -> `https://us-central1-ajonp-slack-slap.cloudfunctions.net/api/slap?callback=YOURCALLBACK`.

Now you have a working bot with whom you can interact, but it is a private communication between you and him, so you could say that it is not that fun. Let's make it more fun!

- Take the part after `services`, as in the above example it will be -> `/T2UR5KNQ2/BMNTDRAG0/mPToTmuARk2BqYhn93Izzbbb`
- Go back to Slash Command and edit the URL to add the token part from above so it should be at the end something like

```
https://us-central1-ajonp-slack-slap.cloudfunctions.net/api/slap?callback=/T2UR5KNQ2/BMNTDRAG0/mPToTmuARk2BqYhn93Izzbbb.
```

BTW replace `https://us-central1-ajonp-slack-slap.cloudfunctions.net/api` with your url, or feel free to use this one.

## Usage in Slack

In the easiest form you can just type:

```
/slap @chouse
```

This will tell slapbot to give Chris a big ol' slap with a fish emoji. You can also supply your own emoji by typing:

```
/slap @chouse :hot_pepper:
```

In this example, Chris will be slapped by the emoji ????. LOL!

By default, the bot will also include some banter at the end. Read on to learn how to configure this.

## Configuring the bot behaviour

- To edit the random banter strings, change the `banterArray` variable in `helpers.js`.
- To remove the banter, remove the `banter` variable from the `text` property of `botPayload` in `server.js`.
- To change the bot name or icon, change the `user_name` and `icon_emoji` property of `botPayload` in `server.js`.
- To change the default emoji, change the `DEFAULT_EMOJI` variable in `constants.js`.

Congratulations, enjoy slapping!
