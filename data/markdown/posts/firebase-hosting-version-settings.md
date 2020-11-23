---
title: "Firebase Hosting Version Settings"
date: "2019-08-22"
---

If you start to get that feeling like "Why am I getting billed for this tiny app" from Firebase, then this blog is for you!

## Dashboard[](https://codingcat.dev/blog/firebase-hosting-version-settings#dashboard)

If you project is currently using hosting, you should see your dashboard as soon as you enter your project. You can either click on your last deployment history or go to Hosting in the menu.

![firebase dashboard](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_12.58.22_PM.png)

## Hosting Usage[](https://codingcat.dev/blog/firebase-hosting-version-settings#hosting-usage)

You may see multiple sites that you are currently hosting in this screen. For now lets switch over to the Usage tab. You should see a chart listed year of you trending stored bytes. In my graphy this shows a recent trendline upward (as I have been deploying a lot).

![hosting usage](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.02.32_PM.png)

If this type of storage trend where to continue I would eventually break into the 1GB limit for storage on this site, now granted for my 5MB it would take a great deal of time.

![Firebase Pricing](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.05.23_PM.png)

## Updating Version[](https://codingcat.dev/blog/firebase-hosting-version-settings#updating-version)

If you have multiple domains select View on the one that you want to change. Once you are in the Manage site area, you will see all of your domains at the top then the release history at the bottom.

![Firebase hosting manage site](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.08.07_PM.png)

It is in the Release History section that you will be able to select Version history settings, from the hamburger menu.

![Firebase Version history settings](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.10.24_PM.png)

When you get the modal screen to change the versions, you will see based on your selection the estimated storage. If you have several (in my case 100's) of versions stored you will notice that a background job is kicked off that will mark your old versions for deletion.

![Version Settings change](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.12.30_PM.png)

Once the delete action has finished you will notice that your older deployments will have an `Auto deleted` indicator.

![Auto Delete Indicator](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screen_Shot_2019-08-22_at_1.52.07_PM.png)

## REST Service[](https://codingcat.dev/blog/firebase-hosting-version-settings#rest-service)

You can also automate this process if you are not into the Admin GUI through the [Firebase Hosting API](https://firebase.google.com/docs/hosting/reference/rest/v1beta1/sites.versions/delete).

### Shell script[](https://codingcat.dev/blog/firebase-hosting-version-settings#shell-script)

[andipaetzold/firebase-delete-releases.sh](https://gist.github.com/andipaetzold/94e470b4f74c85d426000d95791603fd)

```
#!/bin/bash set -eo pipefail echo "Deleting existing hosting releases" SITE=$1 echo "Site: $SITE" HEADER_AUTH="Authorization: Bearer "$(gcloud auth application-default print-access-token)""; PAGE_TOKEN= FIRST=true while : do echo "Fetching releases for $PAGE_TOKEN" RELEASES=$( \ curl \ -sS \ -H "$HEADER_AUTH" \ "https://firebasehosting.googleapis.com/v1beta1/sites/$SITE/releases?pageToken=$PAGE_TOKEN&pageSize=25" \ ) for RELEASE_ID in $(echo $RELEASES | jq '.releases | keys[]') do VERSION_NAME=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].version.name") MESSAGE=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].message") VERSION_STATUS=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].version.status") if [ "$VERSION_STATUS" == "FINALIZED" ] && [ "$FIRST" == false ] then echo "Deleting release $MESSAGE ($VERSION_NAME)"; curl \ -sS \ -X DELETE \ -H "$HEADER_AUTH" \ "https://firebasehosting.googleapis.com/v1beta1/$VERSION_NAME" fi FIRST=false done if [ $(echo $RELEASES | jq --raw-output '.nextPageToken') == "null" ] then exit 0 fi PAGE_TOKEN=$(echo $RELEASES | jq --raw-output '.nextPageToken') sleep 1s done 
```
