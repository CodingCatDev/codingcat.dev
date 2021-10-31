const sanityClient = require('@sanity/client');
import { SanityClient } from '@sanity/client';

import postJson from './firestore-backup_20211030.json';

const client = sanityClient({
  projectId: 'hfh83o0w',
  dataset: 'dev',
  apiVersion: '2021-03-25',
  useCdn: false,
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
    console.log(`Type: ${type}: `, c);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await deletePosts();
  await firestoreToSanity();
  await count('course');
  await count('lesson');
  await count('page');
  await count('podcast');
  await count('post');
  await count('tutorial');
})();
