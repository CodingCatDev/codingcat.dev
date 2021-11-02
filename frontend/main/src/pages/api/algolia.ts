import algoliasearch from 'algoliasearch';
import sanityClient from '@sanity/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { isValidRequest } from '@sanity/webhook';

import { config as sanityConfig, webhook } from '@/config/sanity';
import { config as algoliaConfig } from '@/config/algolia';

const algolia = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
const sanity = sanityClient(sanityConfig);

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!isValidRequest(req, webhook.secret)) {
    res.status(401).json({ success: false, message: 'Invalid signature' });
    return;
  }
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400);
    res.json({ message: 'Bad request' });
    return;
  }
  console.log(req.body);
  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex(algoliaConfig.index);
  try {
    const result = await algoliaIndex.saveObject(req.body);
    console.log(result);
    res.status(200);
    return;
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ message: 'Error check logs' });
    return;
  }
};

export default handler;
