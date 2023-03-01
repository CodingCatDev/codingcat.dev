---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1618945474/main-codingcatdev-photo/ymyolk5dyd9jppvuqcx0.png
devto: https://dev.to/codingcatdev/firebase-hosting-version-settings-4e4c
excerpt: Set your version history for firebase hosting, to avoid storage costs.
hashnode: https://hashnode.codingcat.dev/post-firebase-hosting-version-settings
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=firebase-hosting-version-settings&_id=fa41a4cc319347fb9d1917c17f3d8c03
published: published
slug: firebase-hosting-version-settings
start: August 22, 2019
title: Firebase Hosting Version Settings
---

If you start to get that feeling like "Why am I getting billed for this tiny app" from Firebase, then this blog is for you!

## Dashboard

If you project is currently using hosting, you should see your dashboard as soon as you enter your project. You can either click on your last deployment history or go to Hosting in the menu.

![https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/77b3e717-0faf-4ca8-80e3-503518caa69c.png](https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/77b3e717-0faf-4ca8-80e3-503518caa69c.png)

## Hosting Usage

You may see multiple sites that you are currently hosting in this screen. For now lets switch over to the Usage tab. You should see a chart listed year of you trending stored bytes. In my graphy this shows a recent trendline upward (as I have been deploying a lot).

![https://media.codingcat.dev/image/upload/v1657636761/main-codingcatdev-photo/d51a5ab8-fd99-4958-9076-e072423951d7.png](https://media.codingcat.dev/image/upload/v1657636761/main-codingcatdev-photo/d51a5ab8-fd99-4958-9076-e072423951d7.png)

If this type of storage trend where to continue I would eventually break into the 1GB limit for storage on this site, now granted for my 5MB it would take a great deal of time.

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/a1ab8025-7577-498e-9f49-433335d93514.png](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/a1ab8025-7577-498e-9f49-433335d93514.png)

## Updating Version

If you have multiple domains select View on the one that you want to change. Once you are in the Manage site area, you will see all of your domains at the top then the release history at the bottom.

![https://media.codingcat.dev/image/upload/v1657636765/main-codingcatdev-photo/2155b9ed-80b4-4609-abd6-f7117ce8ae9f.png](https://media.codingcat.dev/image/upload/v1657636765/main-codingcatdev-photo/2155b9ed-80b4-4609-abd6-f7117ce8ae9f.png)

It is in the Release History section that you will be able to select Version history settings, from the hamburger menu.

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/bc5fd4d6-b7dc-40f8-85d4-45d85ea9380e.jpg](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/bc5fd4d6-b7dc-40f8-85d4-45d85ea9380e.jpg)

When you get the modal screen to change the versions, you will see based on your selection the estimated storage. If you have several (in my case 100's) of versions stored you will notice that a background job is kicked off that will mark your old versions for deletion.

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/a0f468f3-1396-4e6a-8e2a-9b4f0edb453d.jpg](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/a0f468f3-1396-4e6a-8e2a-9b4f0edb453d.jpg)

Once the delete action has finished you will notice that your older deployments will have an `Auto deleted` indicator.

![https://media.codingcat.dev/image/upload/v1657636762/main-codingcatdev-photo/84542c24-beea-42d8-9e73-ec1af0fe414a.png](https://media.codingcat.dev/image/upload/v1657636762/main-codingcatdev-photo/84542c24-beea-42d8-9e73-ec1af0fe414a.png)

## REST Service

You can also automate this process if you are not into the Admin GUI through the [Firebase Hosting API](https://firebase.google.com/docs/hosting/reference/rest/v1beta1/sites.versions/delete).

### Shell script

```bash
#!/bin/bash set -eo pipefail echo "Deleting existing hosting releases" SITE=$1 echo "Site: $SITE" HEADER_AUTH="Authorization: Bearer "$(gcloud auth application-default print-access-token)""; PAGE_TOKEN= FIRST=true while : do echo "Fetching releases for $PAGE_TOKEN" RELEASES=$( \ curl \ -sS \ -H "$HEADER_AUTH" \ "https://firebasehosting.googleapis.com/v1beta1/sites/$SITE/releases?pageToken=$PAGE_TOKEN&pageSize=25" \ ) for RELEASE_ID in $(echo $RELEASES | jq '.releases | keys[]') do VERSION_NAME=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].version.name") MESSAGE=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].message") VERSION_STATUS=$(echo $RELEASES | jq --raw-output ".releases[$RELEASE_ID].version.status") if [ "$VERSION_STATUS" == "FINALIZED" ] && [ "$FIRST" == false ] then echo "Deleting release $MESSAGE ($VERSION_NAME)"; curl \ -sS \ -X DELETE \ -H "$HEADER_AUTH" \ "https://firebasehosting.googleapis.com/v1beta1/$VERSION_NAME" fi FIRST=false done if [ $(echo $RELEASES | jq --raw-output '.nextPageToken') == "null" ] then exit 0 fi PAGE_TOKEN=$(echo $RELEASES | jq --raw-output '.nextPageToken') sleep 1s done
```