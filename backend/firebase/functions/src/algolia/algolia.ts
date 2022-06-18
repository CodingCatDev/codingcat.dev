import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { algoliaAppId, algoliaApiKey, algoliaIndex } from '../config/config';
import {
  getNotionPageMarkdown,
  getPurrfectStreamPageMarkdown,
  queryAll,
} from '../utilities/notion.server';

const algolia = algoliasearch(algoliaAppId, algoliaApiKey);
const ai = algolia.initIndex(algoliaIndex);

function sleep(ms: number) {
  return new Promise((resolve) => {
    console.log('Pausing 3sec');
    setTimeout(resolve, ms);
  });
}

const paginate = async (
  _type: string,
  raw: any,
  preview?: boolean
): Promise<any> => {
  // Call to get full content and add to algolia
  for (const p of raw.results) {
    await sleep(1000);
    if (
      p?.properties?.published?.select?.name === 'published' ||
      p?.properties?.Status?.select?.name === 'Released'
    ) {
      console.log(`finding: ${p?.id}`);
      if (p?.properties?.slug?.url) {
        let post;
        if (_type === 'podcast') {
          post = await getPurrfectStreamPageMarkdown(p?.properties?.slug?.url);
        } else {
          post = await getNotionPageMarkdown({
            _type,
            slug: p?.properties?.slug?.url,
            preview,
          });
        }
        const result = await ai.saveObject({
          ...post,
          objectID: post._id,
          type: post._type,
        });
        console.log(`Algolia add ${_type}:${p?._id}`, JSON.stringify(result));
      }
    } else {
      const result = await ai.deleteObject(p?._id);
      console.log(`Algolia delete ${_type}:${p?._id}`, JSON.stringify(result));
    }
  }

  if (raw.next_cursor) {
    const newRaw = await queryAll(_type, 3, raw.next_cursor);
    await paginate(_type, newRaw);
  } else {
    console.log('finished pagination');
  }
};

export const scheduledNotionToAlgolia = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule('every 1 hours')
  .onRun(async () => {
    // .https.onRequest(async (req, res) => {
    // Check to see if ther are scheduled pods
    console.log('Update Algolia from Notion');

    //Get initial cursors
    const [posts, tutorials, courses, pages, podcasts] = await Promise.all([
      queryAll('post', 3),
      queryAll('tutorial', 3),
      queryAll('course', 3),
      queryAll('page', 3),
      queryAll('podcast', 3),
    ]);
    await paginate('post', posts);
    await sleep(3000);
    await paginate('tutorial', tutorials);
    await sleep(3000);
    await paginate('course', courses);
    await sleep(3000);
    await paginate('page', pages);
    await sleep(3000);
    await paginate('podcast', podcasts);
    return null;
    // res.send(200);
  });
