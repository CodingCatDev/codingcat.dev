import { PostType } from './../../models/post.model';
import algoliasearch from 'algoliasearch';
import { NextApiRequest, NextApiResponse } from 'next';
import { isValidRequest } from '@sanity/webhook';

import { webhook } from '@/config/sanity';
import { config as algoliaConfig } from '@/config/algolia';
import {
  queryNotionDbBySlug,
  queryPurrfectStreamBySlug,
} from '@/services/notion.server';

const algolia = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Body: ', JSON.stringify(req.body));

  if (!isValidRequest(req, webhook.secret)) {
    console.warn('Unathorized');
    res.status(401).json({ success: false, message: 'Invalid signature' });
    return;
  }
  if (req.headers['content-type'] !== 'application/json') {
    console.warn('Bad Request');
    res.status(400);
    res.json({ message: 'Bad request' });
    return;
  }
  const publishedAt = req.body?.publishedAt;
  let publish = false;
  if (publishedAt) {
    publish = publishedAt < new Date().toISOString();
  }
  console.log('Published: ', publish);

  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex(algoliaConfig.index);
  try {
    let result;
    if (req.body?.deleted) {
      // remove if doc removed
      console.log('deleting removed', req.body?.deleted);
      result = await algoliaIndex.deleteObject(req.body?.deleted);
    } else if (req.body?.updated && !publish) {
      // remove if not published after update
      console.log('deleting updated not published', req.body?.updated);
      result = await algoliaIndex.deleteObject(req.body?.updated);
    } else if (publish) {
      // create when in publish state
      const type = req.body?.type;
      const slug = req.body?.slug;

      if (!type || !slug) {
        console.log('Skipping, misssing type or slug', type, slug);
        return;
      }

      if (type === 'lesson') {
        console.log(
          `Skipping, we don't know what course lesson is for.`,
          type,
          slug
        );
        return;
      }

      console.log(`Fetching full post with type: ${type} slug: ${slug}`);
      let post;
      if (type == PostType.podcast) {
        post = await (await queryPurrfectStreamBySlug(slug)).results.at(0);
      } else {
        post = await (await queryNotionDbBySlug(type, slug)).results.at(0);
      }

      console.log('post data:', JSON.stringify(post));
      if (post) {
        result = await algoliaIndex.saveObject({
          ...post,
          objectID: post._id,
          type: post._type,
        });
      }
    }
    console.log(result ? `Result: ${JSON.stringify(result)}` : 'Nothing Done.');
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.json({ message: 'Error check logs' });
    res.status(500).end();
  }
};

export default handler;
