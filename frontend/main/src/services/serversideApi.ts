import { Post } from '@/models/post.model';
import admin from '@/utils/firebaseAdmin';

// Firebase Admin, or any other services you need for Server Side
export async function postsRecentService(recentPostsTypes: string[]) {
  const recentPosts: { [key: string]: Post[] } = {};

  recentPostsTypes.map((key) => (recentPosts[key] = []));
  await Promise.all(
    Object.keys(recentPosts).map(async (postType) => {
      const posts = await admin
        .firestore()
        .collection('posts')
        .where('type', '==', postType)
        .where('publishedAt', '<', admin.firestore.Timestamp.now())
        .orderBy('publishedAt', 'desc')
        .limit(3)
        .get();
      for (const doc of posts.docs) {
        recentPosts[postType].push(
          cleanTimestamp(smallPostPayload(doc)) as Post
        );
      }
    })
  );
  return recentPosts;
}

export async function postsService(postType: string) {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .where('type', '==', postType)
    .where('publishedAt', '<', admin.firestore.Timestamp.now())
    .orderBy('publishedAt', 'desc')
    .get();

  const posts: FirebaseFirestore.DocumentData[] = [];
  for (const doc of postDocs.docs) {
    posts.push(cleanTimestamp(smallPostPayload(doc)));
  }
  return posts;
}

export async function postByPermalinkService(permalink: []) {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .where('permalink', '==', `/${permalink.join('/')}`)
    .get();

  const posts: FirebaseFirestore.DocumentData[] = [];
  for (const doc of postDocs.docs) {
    posts.push(cleanTimestamp(doc.data()));
  }
  return posts;
}

/* Utilities */
export function cleanTimestamp(data: FirebaseFirestore.DocumentData) {
  const docData = { ...data };
  Object.keys(docData).map((key) => {
    if (
      typeof docData[key] === 'object' &&
      Object.keys(docData[key]).includes('_nanoseconds')
    ) {
      const timestamp: admin.firestore.Timestamp = docData[key];
      docData[key] = timestamp.toMillis();
    } else {
      docData[key] = docData[key];
    }
  });
  return docData;
}

function smallPostPayload(doc: FirebaseFirestore.DocumentData) {
  const post = doc.data() as Post;
  delete post.content;
  return post;
}
