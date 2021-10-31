import { Post } from './../../../frontend/main/src/models/post.model';
const sanityClient = require('@sanity/client');
import { SanityClient } from '@sanity/client';

import postJson from './firestore-backup_20211030.json';

const client = sanityClient({
  projectId: 'hfh83o0w',
  dataset: 'dev',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token:
    'sk0kapvYu39SSqUeuBdyqYJNi8u6usSg3hOzh4jrOUW7HAV5MXPRndzS1UTOwW5crvqQGFW4Wue6YVMad8YQik9ziPaEiuiuzzAx5dBhTdzL1r7JUddRBcjF6wlA01ixiqWivja9q1jLidQWhgTyrL8Gu6Fb4deKEweUi00Cwmoa9aae6E0s', // or leave blank for unauthenticated usage
  useCdn: false,
}) as SanityClient;

const deletePosts = async () => {
  const query =
    '*[_type == "post" && _id != "3a4fa2b1-4ab6-4946-bb6c-065d4e8b93d9"] {_id}';
  const params = {};
  try {
    const posts = await client.fetch(query, params);
    for (const post of posts) {
      const res = await client.delete(post._id);
      console.log('deleted: ', post._id);
    }
  } catch (error) {
    console.log(error);
  }
};

const firestoreToSanity = async () => {
  for (const [id, post] of Object.entries(postJson['posts']) as any) {
    const authors = [];
    for (const author of authors) {
      authors.push({
        ...author,
        _ref: '96637b34-1ea1-4342-9867-6bd4e94ed23d',
        _type: 'reference',
      });
    }
    const doc = {
      _type: post.type,
      authors,
      content: post?.content,
      slug: post?.slug
        ? {
            _type: 'slug',
            current: post.slug,
          }
        : null,
      excerpt: post?.excerpt,
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt._seconds * 1000).toISOString()
        : null,
      title: post?.title,
      accessSettings: post?.accessSettings,
      coverPhoto: post?.coverPhoto,
      coverVideo: post?.coverVideo,
    };
    try {
      const res = (await client.create(doc)) as any;
      console.log('created', res._id);
    } catch (error) {
      console.log(error);
    }
  }
};

const count = async (type: string) => {
  const query = `count(*[_type == "${type}" && _id != "3a4fa2b1-4ab6-4946-bb6c-065d4e8b93d9"])`;
  const params = {};
  try {
    const c = await client.fetch(query, params);
    console.log(c);
  } catch (error) {
    console.log(error);
  }
};
count('post');
count('course');
count('podcast');
