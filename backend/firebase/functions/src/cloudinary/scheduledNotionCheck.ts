import * as functions from 'firebase-functions';
import {
  generateCodingCatCoverURL,
  uploadGuestProfilePicIfNotExists,
} from '../utilities/cloudinaryUtils';
import { projectId } from '../config/config';

import { sendTopic } from '../utilities/googleapis';
import {
  blockAppendPurrfectPageWithTemplateData,
  getPage,
  patchPurrfectPage,
  queryPurrfectPageScheduled,
} from '../utilities/notion';
import { getUserByUsername } from '../utilities/twitter';
const cloudinaryFolder =
  projectId === 'codingcat-dev'
    ? 'main-codingcatdev-photo'
    : `dev-codingcatdev-photo`;

const topicId = 'cloudinaryCreateFromNotion';

export const scheduledNotionToCloudinary = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    // Check to see if ther are scheduled pods
    console.log('Checking for scheduled pods');
    const scheduledRes = await queryPurrfectPageScheduled('Scheduled');
    console.log('Scheduled Result:', JSON.stringify(scheduledRes));

    if (scheduledRes?.results) {
      const needCloudinaryPods = scheduledRes?.results.filter(
        (p) => p.cover === null
      );
      console.log('Pods to add to pub/sub', JSON.stringify(needCloudinaryPods));

      for (const pod of needCloudinaryPods) {
        await sendTopic(topicId, pod);
      }
    }
  });

export const cloudinaryToNotionPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));

    // For each guest update the twitter profile.
    for (const guest of page?.properties?.Guest?.relation as { id: string }[]) {
      console.log('Getting Guest Details', guest.id);
      const guestRes = await getPage(guest.id);
      console.log('Guest Result: ', JSON.stringify(guestRes));
      const twitter = guestRes.properties.Twitter as { url: string };
      console.log('Guest twitter: ', twitter);
      if (twitter) {
        const twitterUsername = twitter.url.replace('https://twitter.com/', '');
        console.log('fetching twitter user', twitterUsername);
        const twitterGuest = await getUserByUsername(twitterUsername);
        console.log('twitter user: ', JSON.stringify(twitterGuest));
        if (!twitterGuest?.data?.profile_image_url) {
          console.log('Twitter user profile image not found, skipping.');
          continue;
        }
        const guestImagePublicId = await uploadGuestProfilePicIfNotExists(
          `${cloudinaryFolder}/podcast-guest/${twitterUsername}`,
          twitterGuest.data.profile_image_url.replace('_normal', '')
        );

        const param = {
          title: page.properties.Name.title[0].plain_text,
          guestName: twitterGuest.data.name,
          guestImagePublicId,
          backgroundPath: `${cloudinaryFolder}/Season2Background`,
        };
        console.log('generating cloudinary url with: ', JSON.stringify(param));
        const coverUrl = generateCodingCatCoverURL(param).replace(
          'http://',
          'https://'
        );
        const update = {
          page_id: page.id,
          cover: {
            external: {
              url: coverUrl,
            },
          },
        };
        console.log('Updating page with: ', update);
        const purrfectPagePatchRes = await patchPurrfectPage(update);
        console.log(
          'Page update result:',
          JSON.stringify(purrfectPagePatchRes)
        );
        console.log('Add template blocks');
        const templateUpdate = await blockAppendPurrfectPageWithTemplateData({
          guestName: twitterGuest.data.name,
          coverUrl,
        });
        console.log('Template Result:', templateUpdate);
      }
    }
  });
