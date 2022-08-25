import * as functions from 'firebase-functions';
import { sendTopic } from '../utilities/googleapis';
import {
  queryPurrfectStreamDevTo,
  patchPurrfectPage,
} from '../utilities/notion.server';
import { addArticle } from '../utilities/devto';

const topicId = 'devtoCreateFromNotion';

export const scheduledNotionToDevto = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    // Check to see if ther are scheduled pods
    console.log('Checking for scheduled pods');
    const scheduledRes = await queryPurrfectStreamDevTo(1);
    console.log('Scheduled Result:', JSON.stringify(scheduledRes));

    if (scheduledRes?.results) {
      const needCloudinaryPods = scheduledRes?.results;
      console.log('Pods to add to pub/sub', JSON.stringify(needCloudinaryPods));

      for (const pod of needCloudinaryPods) {
        await sendTopic(topicId, pod);
      }
    }
    return true;
  });

export const devtoToNotionPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));
    console.log('page', page);

    let data;
    switch (page._type) {
      case 'podcast':
        data = {
          article: {
            title: page.title,
            published: true,
            tags: ['podcast', 'webdev', 'javascript', 'beginners'],
            series: `codingcatdev_podcast_${page.properties.Season.number}`,
            main_image: `https://media.codingcat.dev/image/upload/b_rgb:5e1186,c_pad,w_1000,h_420/${page?.coverPhoto?.public_id}`,
            canonical_url: `https://codingcat.dev/${page._type}/${page.slug}`,
            description: page.excerpt,
            organization_id: '1009',
            body_markdown: `Original: https://codingcat.dev/${page._type}/${
              page.slug
            }
            {% youtube ${page.properties.youtube.url} %}
            {% spotify spotify:episode:${page.properties.spotify.url
              .split('/')
              .at(-1)
              .split('?')
              .at(0)} %}
      
            `,
          },
        };
        break;
      default:
        break;
    }

    if (data) {
      const response = await addArticle(data);
      console.log('addArticle result:', response);

      const devto = response?.data?.url;

      if (!devto) {
        console.log('devto url missing');
        return;
      }

      const update = {
        page_id: page.id,
        properties: {
          devto: {
            id: 'remote',
            type: 'url',
            url: devto,
          },
        },
      };
      console.log('Updating page with: ', JSON.stringify(update));
      const purrfectPagePatchRes = await patchPurrfectPage(update);
      console.log('Page update result:', JSON.stringify(purrfectPagePatchRes));

      return purrfectPagePatchRes;
    } else {
      console.log('No Data matched for article');
      return;
    }
  });

// Used for testing don't forget to remove for production
export const httpNotionToDevto = functions.https.onRequest(async (req, res) => {
  // Check to see if ther are scheduled pods
  console.log('Checking for scheduled pods');
  const scheduledRes = await queryPurrfectStreamDevTo(1);
  console.log('Scheduled Result:', JSON.stringify(scheduledRes));

  if (scheduledRes?.results) {
    const needCloudinaryPods = scheduledRes?.results;
    console.log('Pods to add to pub/sub', JSON.stringify(needCloudinaryPods));

    for (const pod of needCloudinaryPods) {
      await sendTopic(topicId, pod);
    }
  }
  res.send({ msg: 'started' });
});
