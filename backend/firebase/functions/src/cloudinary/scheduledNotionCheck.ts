import * as functions from 'firebase-functions';
import {
  generateCodingCatCoverURL,
  uploadCloudinaryFromUrl,
} from '../utilities/cloudinaryUtils';
import { projectId } from '../config/config';

import { sendTopic } from '../utilities/googleapis';
import {
  getNotionPageBlocks,
  getPage,
  patchPurrfectPage,
  queryNotionDbForCloudinaryConvert,
  queryPurrfectPageScheduled,
  updateBlock,
} from '../utilities/notion.server';
import { getUserByUsername } from '../utilities/twitter';
const cloudinaryFolder =
  projectId === 'codingcat-dev'
    ? 'main-codingcatdev-photo'
    : `dev-codingcatdev-photo`;

import slugify from 'slugify';

const topicId = 'cloudinaryCreateFromNotion';
const topicNotionPicsToCloudinary = 'notionPicsToCloudinary';
const topicNotionImageBlockConvert = 'topicNotionImageBlockConvert';

export const scheduledNotionToCloudinary = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    // Check to see if ther are scheduled pods
    console.log('Checking for scheduled pods');
    const scheduledRes = await queryPurrfectPageScheduled('Scheduled');
    console.log('Scheduled Result:', JSON.stringify(scheduledRes));

    if (scheduledRes?.results) {
      const needCloudinaryPods = scheduledRes?.results.filter(
        (p: any) => p.cover === null
      );
      console.log('Pods to add to pub/sub', JSON.stringify(needCloudinaryPods));

      for (const pod of needCloudinaryPods) {
        await sendTopic(topicId, pod);
      }
    }
    return true;
  });

export const cloudinaryToNotionPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));

    if (page?.properties?.Name?.title?.[0]?.plain_text === 'NEW PODCAST') {
      console.log('Page Title has not been updated, skipping.');
      return false;
    }

    // For each guest update the twitter profile.
    for (const guest of page?.properties?.Guest?.relation as { id: string }[]) {
      console.log('Getting Guest Details', guest.id);
      const guestRes: any = await getPage(guest.id);
      console.log('Guest Result: ', JSON.stringify(guestRes));
      const twitter = guestRes.properties.Twitter as { url: string };
      console.log('Guest twitter: ', twitter);
      if (twitter) {
        let twitterUsername = twitter.url.replace('https://twitter.com/', '');
        twitterUsername = twitterUsername.replace('@', '');
        console.log('fetching twitter user', twitterUsername);
        const twitterGuest = await getUserByUsername(twitterUsername);
        console.log('twitter user: ', JSON.stringify(twitterGuest));
        if (!twitterGuest?.data?.profile_image_url) {
          console.log('Twitter user profile image not found, skipping.');
          continue;
        }
        const res = await uploadCloudinaryFromUrl(
          `${cloudinaryFolder}/podcast-guest/${twitterUsername}`,
          twitterGuest.data.profile_image_url.replace('_normal', '')
        );

        const slug = slugify(page.properties.Name.title[0].plain_text, '-');
        const param = {
          title: page.properties.Name.title[0].plain_text,
          slug: `${cloudinaryFolder}/${slug}`,
          guestName: guestRes.properties.Name.title[0].plain_text,
          guestImagePublicId: res.public_id,
          backgroundPath: `${cloudinaryFolder}/Season2Background`,
        };
        console.log('generating cloudinary url with: ', JSON.stringify(param));
        const coverUrl = (await generateCodingCatCoverURL(param)).replace(
          'http://',
          'https://'
        );
        console.log('coverURL', coverUrl);
        const update = {
          page_id: page.id,
          cover: {
            external: {
              url: coverUrl,
            },
          },
          properties: {
            slug: {
              id: 'wDeB',
              type: 'url',
              url: slug,
            },
            cover: {
              id: coverUrl,
              type: 'url',
              url: coverUrl,
            },
          },
        };
        console.log('Updating page with: ', JSON.stringify(update));
        const purrfectPagePatchRes = await patchPurrfectPage(update);
        console.log(
          'Page update result:',
          JSON.stringify(purrfectPagePatchRes)
        );
      }
    }
    return true;
  });

export const scheduledNotionCloudinaryConvert = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule('every 5 minutes')
  .onRun(async () => {
    // Check to see if ther are database items needing added to cloudinary
    console.log('Checking for cloudinary convert');
    // const [post, tutorial, course, podcast, lesson, framework, language, author] = await Promise.all([
    const posts = await Promise.all([
      queryNotionDbForCloudinaryConvert('post'),
      queryNotionDbForCloudinaryConvert('tutorial'),
      queryNotionDbForCloudinaryConvert('course'),
      queryNotionDbForCloudinaryConvert('podcast'),
      queryNotionDbForCloudinaryConvert('lesson'),
      queryNotionDbForCloudinaryConvert('framework'),
      queryNotionDbForCloudinaryConvert('language'),
      queryNotionDbForCloudinaryConvert('author'),
    ]);

    //Loop through all types
    posts.map(async (p) => {
      //Loop through all items found in type
      p?.results?.map(async (r) => {
        console.log(`Sending topic ${topicNotionPicsToCloudinary}:`, r?.id);
        // Need to slowly do this as to not overwhelm the API.
        await sendTopic(topicNotionPicsToCloudinary, r);
      });
    });
    return true;
  });

export const notionPageFindFileBlocksPublish = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.topic(topicNotionPicsToCloudinary)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));

    // Get blocks
    const blocks = await getNotionPageBlocks(page.id);
    const convertBlocks = blocks.filter((b) => b?.image?.file?.url);

    // If no blocks are found mark completed
    if (!convertBlocks || convertBlocks.length === 0) {
      await patchPurrfectPage({
        page_id: page.id,
        properties: {
          cloudinary_convert: {
            type: 'checkbox',
            checkbox: false,
          },
        },
      });
      return;
    }

    convertBlocks.map(async (b) => {
      await sendTopic(topicNotionImageBlockConvert, b);
    });
    return true;
  });

export const cloudinaryConvertBlockPubSub = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.topic(topicNotionImageBlockConvert)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    interface CreatedBy {
      object: string;
      id: string;
    }
    interface LastEditedBy {
      object: string;
      id: string;
    }
    interface File {
      url: string;
      expiry_time: Date;
    }
    interface External {
      url: string;
    }
    interface Image {
      caption: any[];
      type: string;
      file?: File;
      external?: External;
    }
    interface Block {
      object: string;
      id: string;
      created_time: Date;
      last_edited_time: Date;
      created_by: CreatedBy;
      last_edited_by: LastEditedBy;
      has_children: boolean;
      archived: boolean;
      type: string;
      image: Image;
    }

    const block = JSON.parse(JSON.stringify(message.json)) as Block;
    const fileUrl = block?.image?.file?.url;

    if (!fileUrl) {
      console.error('missing fileUrl');
      return;
    }

    const res = await uploadCloudinaryFromUrl(
      `${cloudinaryFolder}/${block.id}`,
      fileUrl
    );

    if (!res?.secure_url) {
      console.error('Cloudinary missing secure_url');
      return;
    }

    const update = await updateBlock(block.id, {
      image: {
        external: {
          url: res.secure_url,
        },
      },
    });
    console.log('Successfully updated', JSON.stringify(update));
    return true;
  });
