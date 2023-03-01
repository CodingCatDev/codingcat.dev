---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1662067996/main-codingcatdev-photo/Notion_to_Dev.to_and_Hashnode.jpg
devto: https://dev.to/codingcatdev/notion-to-hashnode-and-devto-using-pubsub-cloud-functions-3ka
excerpt: Depending on your goals cross posting with a canonical url can increase your user engagements 10x. I will show you an easy way to take your Notion articles out to Hashnode and Dev.to
hashnode: https://hashnode.codingcat.dev/post-notion-to-hashnode-and-devto-using-pubsub-cloud-functions
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=notion-to-hashnode-and-devto-using-pubsub-cloud-functions&_id=7b2e8e7789b14aac813a0693e88ea1d1
published: published
slug: notion-to-hashnode-and-devto-using-pubsub-cloud-functions
start: September 1, 2022
title: Notion to Hashnode and Dev.to using Pub/Sub Cloud Functions
---
A goal at [CodingCat.dev](http://CodingCat.dev) is to reach the most students possible. In order to do that we use [Dev.to](http://Dev.to) and Hashnode to cross post our articles and leverage canonical urls to point those articles back the the original. For us it allows more eyeballs to get to the content and videos.

## Searching for the Notion Data

In order to keep find what data that needs processing in notion the simplest way is to keep a record of the url that the new blog will be held in. For example when finding records that we will need to add to [Dev.to](http://Dev.to) we will add a column called `devto`. We can then search the database for any records fitting a criteria with that field being empty using Notion’s API and filtered fields.

In the below example, the database from `database_id` is searched for CodingCat.dev’s database. We also add the start_cursor because we want these going out in order we pass 1 to this field so that we can guarantee that our posts go out in order and don’t process out of sequence. We also look for podcasts that have a `slug` , are `Released` , have an `Episode` assigned, include a `start` date on or after today’s date. 

```jsx
export const queryPurrfectStreamDevTo = async (
  page_size?: number,
  start_cursor?: string | null
) => {
  const raw = await notionClient.databases.query({
    database_id: notionConfig.purrfectStreamsDb,
    start_cursor: start_cursor ? start_cursor : undefined,
    page_size,
    filter: {
      and: [
        {
          property: 'slug',
          url: {
            is_not_empty: true,
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'Released',
          },
        },
        {
          property: 'Episode',
          number: {
            is_not_empty: true,
          },
        },
        {
          property: 'start',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
        {
          property: 'devto',
          url: {
            is_empty: true,
          },
        },
        {
          property: 'youtube',
          url: {
            is_not_empty: true,
          },
        },
        {
          property: 'spotify',
          url: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Season',
        direction: 'ascending',
      },
      {
        property: 'Episode',
        direction: 'ascending',
      },
    ],
  });
  return await formatPosts(raw, 'podcast');
};
```

## Scheduled Cloud Functions

We can now create a Firebase function that creates a Google Cloud - Cloud Scheduler Job that can run at a given interval. This is a [convenience method](https://firebase.google.com/docs/functions/schedule-functions) that uses pubsub functions. Notice below we will have this function run `every 5 minutes` and check to see if there are any new articles that match our criteria. We could probably back this off to every 1 hour, but it is nice to see this trigger relatively quickly if you have the correct criteria.

```jsx
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

    console.log('Checking for devto missing');
    const posts = await queryByDevto('post', 1);
    console.log('Posts:', JSON.stringify(posts));

    if (posts?.results) {
      const needposts = posts?.results;
      console.log('Posts to add to pub/sub', JSON.stringify(needposts));

      for (const p of needposts) {
        await sendTopic(topicId, p);
      }
    }

    return true;
  });
```

Now if there is something actually found in `queryPurrfectStreamDevTo` function we can then take the data from that entry and pass this on to another pub/sub function. For [CodingCat.dev](http://CodingCat.dev) we just look for 1 entry so that we can publish things in the order that they are created, as we have found with some of these API’s like [dev.to](http://dev.to) there is not an easy way to set original publish date on the actual platform.

## Pub/Sub Function to publish post

This pub/sub function is looking for anything that sends a topic of `devtoCreateFromNotion` to it and then looks up the appropriate post information. This is often the easiest way for massive scaling to happen if you have several items you are trying to publish to the platform. 

For our example we change the `body_markdown` depending on our post type.  An important note here is that we are sending `canonical_url` so that search engine bots don’t think this is original content and know where to add 301 if necessary.

```jsx
export const devtoToNotionPubSub = functions.pubsub
  .topic(topicId)
  .onPublish(async (message, context) => {
    console.log('The function was triggered at ', context.timestamp);
    console.log('The unique ID for the event is', context.eventId);
    const page = JSON.parse(JSON.stringify(message.json));
    console.log('page', page);

    let data;
    if (page._type === 'podcast') {
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
        data = {
          article: {
            title: page.title,
            published: true,
            tags: ['podcast', 'webdev', 'javascript', 'beginners'],
            main_image: `https://media.codingcat.dev/image/upload/b_rgb:5e1186,c_pad,w_1000,h_420/${page?.coverPhoto?.public_id}`,
            canonical_url: `https://codingcat.dev/${page._type}/${page.slug}`,
            description: page.excerpt,
            organization_id: '1009',
            body_markdown: post.content,
          },
        };
      }
    }

    if (data) {
      try {
        console.log('addArticle to devto');
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
        console.log(
          'Page update result:',
          JSON.stringify(purrfectPagePatchRes)
        );

        return purrfectPagePatchRes;
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('No Data matched for article');
    }
    return;
  });
```

## Bonus: To test locally

I would recommend testing these functions locally before having them run on their own. You can use the firebase emulation suite for this. Then update your code for both the schedule and http version to call the same function like below `scheduleCheck()`.

```jsx
const scheduleCheck = async () => {
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

  for (const _type of ['post', 'tutorial']) {
    console.log('Checking for devto missing');
    const posts = await queryByDevto(_type, 1);
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

export const httpNotionToDevto = functions.https.onRequest(async (req, res) => {
  await scheduleCheck();

  res.send({ msg: 'started' });
});

export const scheduledNotionToDevto = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    await scheduleCheck();
    return true;
  });
```

## Full Source

Full [Dev.to](http://Dev.to) example can be found at 

[https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/devto/scheduledNotionToDevto.ts](https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/devto/scheduledNotionToDevto.ts)

Full Hashnode example can be found at

[https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/hashnode/scheduledNotionToHashNode.ts](https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/hashnode/scheduledNotionToHashNode.ts)

Note that this is TypeScript and all functions need to be exposed in the `index.ts` file to be deployed.

[https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/index.ts](https://github.com/CodingCatDev/codingcat.dev/blob/dev/backend/firebase/functions/src/index.ts)