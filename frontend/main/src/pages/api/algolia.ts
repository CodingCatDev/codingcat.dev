import algoliasearch from 'algoliasearch';
import sanityClient, { SanityDocumentStub } from '@sanity/client';
import indexer from 'sanity-algolia';
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
const handler = (req: NextApiRequest, res: NextApiResponse) => {
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

  const sanityAlgolia = indexer(
    // The first parameter maps a Sanity document type to its respective Algolia
    // search index. In this example both `post` and `article` Sanity types live
    // in the same Algolia index. Optionally you can also customize how the
    // document is fetched from Sanity by specifying a GROQ projection.
    //
    // In this example we fetch the plain text from Portable Text rich text
    // content via the pt::text function.
    //
    // _id and other system fields are handled automatically.
    {
      course: {
        index: algoliaIndex,
        projection: `{
          ...,
          "slug": slug.current,
          "type": _type,
        }`,
      },
      page: {
        index: algoliaIndex,
        projection: `{
          ...,
          "slug": slug.current,
          "type": _type,
        }`,
      },
      podcast: {
        index: algoliaIndex,
        projection: `{
          ...,
          "slug": slug.current,
          "type": _type,
        }`,
      },
      post: {
        index: algoliaIndex,
        projection: `{
          ...,
          "slug": slug.current,
          "type": _type,
        }`,
      },
      tutorial: {
        index: algoliaIndex,
        projection: `{
          ...,
          "slug": slug.current,
          "type": _type,
        }`,
      },
    },

    // The second parameter is a function that maps from a fetched Sanity document
    // to an Algolia Record. Here you can do further mutations to the data before
    // it is sent to Algolia.
    (document: SanityDocumentStub) => {
      switch (document._type) {
        // case 'post':
        //   return Object.assign({}, document, {
        //     custom: 'An additional custom field for posts, perhaps?',
        //   });
        // case 'article':
        //   return {
        //     title: document.heading,
        //     body: document.body,
        //     authorNames: document.authorNames,
        //   };
        default:
          return document;
      }
    },
    // Visibility function (optional).
    //
    // The third parameter is an optional visibility function. Returning `true`
    // for a given document here specifies that it should be indexed for search
    // in Algolia. This is handy if for instance a field value on the document
    // decides if it should be indexed or not. This would also be the place to
    // implement any `publishedAt` datetime visibility rules or other custom
    // visibility scheme you may be using.
    (document: SanityDocumentStub) => {
      if (document.hasOwnProperty('publishedAt')) {
        return document.publishedAt < new Date().toISOString();
      }
      return false;
    }
  );

  // Finally connect the Sanity webhook payload to Algolia indices via the
  // configured serializers and optional visibility function. `webhookSync` will
  // inspect the webhook payload, make queries back to Sanity with the `sanity`
  // client and make sure the algolia indices are synced to match.
  return sanityAlgolia
    .webhookSync(sanity, req.body)
    .then(() => res.status(200).send('ok'));
};

export default handler;
