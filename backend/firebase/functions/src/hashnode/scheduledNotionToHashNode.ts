import * as functions from 'firebase-functions';
import { sendTopic } from '../utilities/googleapis';
import {
  queryPurrfectStreamHashnode,
  patchPurrfectPage,
  queryByHashnode,
  getNotionPageMarkdown,
} from '../utilities/notion.server';
import { createPublicationStory } from '../utilities/hashnode';

const topicId = 'hashnodeCreateFromNotion';

const scheduleCheck = async () => {
  // Check to see if ther are scheduled pods
  console.log('Checking for scheduled pods');
  const scheduledRes = await queryPurrfectStreamHashnode(1);
  console.log('Scheduled Result:', JSON.stringify(scheduledRes));

  if (scheduledRes?.results) {
    const needCloudinaryPods = scheduledRes?.results;
    console.log('Pods to add to pub/sub', JSON.stringify(needCloudinaryPods));

    for (const pod of needCloudinaryPods) {
      await sendTopic(topicId, pod);
    }
  }

  for (const _type of ['post', 'tutorial']) {
    console.log('Checking for hashnode missing');
    const posts = await queryByHashnode(_type, 1);
    console.log('Posts:', JSON.stringify(posts));

    if (posts?.results) {
      const needposts = posts?.results;
      console.log('Posts to add to pub/sub', JSON.stringify(needposts));

      for (const p of needposts) {
        await sendTopic(topicId, p);
      }
    }
  }
};

export const scheduledNotionToHashnode = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    await scheduleCheck();
    return true;
  });

export const hashnodeToNotionPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));
    console.log('page', page);

    let input;
    if (page._type === 'podcast') {
      input = {
        title: page.title,
        subtitle: page.excerpt,
        slug: `${page._type}-${page.slug}`,
        contentMarkdown: `Original: https://codingcat.dev/${page._type}/${page.slug}

%[${page.properties.youtube.url}]
          
%[${page.properties.spotify.url}]
          `,
        coverImageURL: `https://media.codingcat.dev/image/upload/f_auto,c_limit,w_1920,q_auto/${page?.coverPhoto?.public_id}`,
        isRepublished: {
          originalArticleURL: `https://codingcat.dev/${page._type}/${page.slug}`,
        },
        tags: [
          {
            _id: '56744722958ef13879b950d3',
            name: 'podcast',
            slug: 'podcast',
          },
          {
            _id: '56744721958ef13879b94cad',
            name: 'JavaScript',
            slug: 'javascript',
          },
          {
            _id: '56744722958ef13879b94f1b',
            name: 'Web Development',
            slug: 'web-development',
          },
          {
            _id: '56744723958ef13879b955a9',
            name: 'Beginner Developers',
            slug: 'beginners',
          },
        ],
      };
    } else {
      console.log(
        `Getting ${page._type}: ${page.id} markdown, with slug ${page?.properties?.slug?.url}`
      );
      const post = await getNotionPageMarkdown({
        _type: page._type,
        slug: page?.properties?.slug?.url,
        preview: false,
      });

      console.log('Block Result', post);

      if (post && post?.content) {
        input = {
          title: page.title,
          subtitle: page.excerpt,
          slug: `${page._type}-${page.slug}`,
          contentMarkdown: post.content,
          coverImageURL: `https://media.codingcat.dev/image/upload/f_auto,c_limit,w_1920,q_auto/${page?.coverPhoto?.public_id}`,
          isRepublished: {
            originalArticleURL: `https://codingcat.dev/${page._type}/${page.slug}`,
          },
          tags: [
            {
              _id: '56744722958ef13879b950d3',
              name: 'podcast',
              slug: 'podcast',
            },
            {
              _id: '56744721958ef13879b94cad',
              name: 'JavaScript',
              slug: 'javascript',
            },
            {
              _id: '56744722958ef13879b94f1b',
              name: 'Web Development',
              slug: 'web-development',
            },
            {
              _id: '56744723958ef13879b955a9',
              name: 'Beginner Developers',
              slug: 'beginners',
            },
          ],
        };
      }
    }

    if (input) {
      const response = await createPublicationStory(input);
      console.log(
        'createPublicationStory result:',
        JSON.stringify(response?.data)
      );

      const hashnodeSlug =
        response?.data?.data?.createPublicationStory?.post?.slug;

      if (!hashnodeSlug) {
        console.log('hasnode url missing');
        return;
      }

      const update = {
        page_id: page.id,
        properties: {
          hashnode: {
            id: 'remote',
            type: 'url',
            url: `https://hashnode.codingcat.dev/${hashnodeSlug}`,
          },
        },
      };
      console.log('Updating page with: ', JSON.stringify(update));
      const purrfectPagePatchRes = await patchPurrfectPage(update);
      console.log('Page update result:', JSON.stringify(purrfectPagePatchRes));

      return purrfectPagePatchRes;
    } else {
      console.log('No Data matched for article');
    }
    return;
  });

// Used for testing don't forget to remove for production
export const httpNotionToHashnode = functions.https.onRequest(
  async (req, res) => {
    await scheduleCheck();

    res.send({ msg: 'started' });
  }
);
