const sanityClient = require('@sanity/client');
import { SanityClient } from '@sanity/client';
import { nanoid } from 'nanoid';

import postJson from './firestore-backup_20211030.json';

const client = sanityClient({
  projectId: 'hfh83o0w',
  dataset: 'dev',
  apiVersion: '2021-03-25',
  useCdn: false,
  token:
    'skLtXi0z9EPPBit6WfHlu5mNJWNm4SmiURsErr2YEJlkA9HfUtbwiOxgFP5lER3HyzUYdaXmNry1nkNP1p5BAASyX9TYttZAUhtpaC2nWWBJaw98Qon0koyFobwd7WmA1JEj7d3uHosvgN6ysXlleHotTcITuESJVIELufPu4xOdVp84TECk',
}) as SanityClient;

const deletePosts = async () => {
  const query =
    '*[_type == "course" || _type=="lesson" || _type=="page" || _type=="podcast" || _type=="post" || _type=="tutorial"] {_id}';
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

const updatePosts = async () => {
  const query =
    '*[_type == "course" || _type=="lesson" || _type=="page" || _type=="podcast" || _type=="post" || _type=="tutorial"] {_id}';
  const params = {};
  try {
    const posts = await client.fetch(query, params);
    for (const post of posts) {
      const res = await client
        .patch(post._id)
        .setIfMissing({
          authors: [],
        })
        .insert('after', 'authors[-1]', [
          {
            _type: 'reference',
            _key: nanoid(),
            _ref: '96637b34-1ea1-4342-9867-6bd4e94ed23d',
          },
        ])
        .commit();
      console.log('updated: ', post._id);
    }
  } catch (error) {
    console.log(error);
  }
};

const firestoreToSanity = async () => {
  for (const [id, post] of Object.entries(postJson['posts']) as any) {
    const doc = {
      _type: post.type,
      authors: [
        {
          _type: 'reference',
          _key: '427f53921277',
          _ref: '96637b34-1ea1-4342-9867-6bd4e94ed23d',
        },
      ],
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
  const query = `count(*[_type == "${type}"])`;
  const params = {};
  try {
    const c = await client.fetch(query, params);
    console.log(`Type: ${type}: `, c);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  // await deletePosts();
  // await firestoreToSanity();
  // await count('course');
  // await count('lesson');
  // await count('page');
  // await count('podcast');
  // await count('post');
  // await count('tutorial');
  await updatePosts();
})();
