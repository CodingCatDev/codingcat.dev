import { StripePrice, StripeProduct } from './../models/stripe.model';
import { PostType } from './../models/post.model';
import { Post } from '@/models/post.model';
import admin from '@/utils/firebaseAdmin';
import { PageLink, Site } from '@/models/site.model';

// Firebase Admin, or any other services you need for Server Side
export async function postsRecentService(
  recentPostsTypes: string[]
): Promise<{ [key: string]: Post[] }> {
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

export async function postsService(postType: string): Promise<Post[]> {
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
  return posts as Post[];
}

export async function postBySlugService(
  type: PostType,
  slug: string
): Promise<Post[]> {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .where('type', '==', type)
    .where('slug', '==', slug)
    .get();

  const posts: FirebaseFirestore.DocumentData[] = [];
  for (const doc of postDocs.docs) {
    posts.push(cleanTimestamp(doc.data()));
  }
  return posts as Post[];
}

export async function postById(id: string): Promise<Post | null> {
  const postDoc = await admin.firestore().doc(`posts/${id}`).get();
  return cleanTimestamp(smallPostPayload(postDoc)) as Post;
}

/* Site Configuration */
export async function getSite(): Promise<Site | null> {
  const siteDocs = await admin.firestore().collection('site').get();
  let site: Site | null = null;
  for (const siteDoc of siteDocs.docs) {
    site = siteDoc.data();
  }
  return site;
}

/* USER Authentication */

export async function validateCourseUser(idToken: string): Promise<boolean> {
  //Verify Token
  const decodedToken = admin.auth().verifyIdToken(idToken);

  if (!decodedToken) {
    return false;
  }

  const userRecord = await admin.auth().getUser((await decodedToken).uid);
  if (userRecord) {
    // Verify user has the correct roles
    const userRef = await admin
      .firestore()
      .doc(`users/${userRecord.uid}`)
      .get();

    const userData = userRef.data() as { uid: string; roles: string[] };
    // TODO: Include Stripe Custom Claim for memberships
    if (
      userData &&
      userData.roles &&
      userData.roles.some((r) => ['admin', 'editor', 'author'].indexOf(r) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function validateAdminUser(idToken: string): Promise<boolean> {
  //Verify Token
  const decodedToken = admin.auth().verifyIdToken(idToken);

  if (!decodedToken) {
    return false;
  }

  const userRecord = await admin.auth().getUser((await decodedToken).uid);
  if (userRecord) {
    // Verify user has the correct roles
    const userRef = await admin
      .firestore()
      .doc(`users/${userRecord.uid}`)
      .get();

    const userData = userRef.data() as { uid: string; roles: string[] };
    if (
      userData &&
      userData.roles &&
      userData.roles.some((r) => ['admin', 'editor', 'author'].indexOf(r) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/* Utilities */
export function cleanTimestamp(
  data: FirebaseFirestore.DocumentData
): FirebaseFirestore.DocumentData {
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

/* Stripe */

export async function getActiveProducts(): Promise<StripeProduct[]> {
  const productDocs = await admin
    .firestore()
    .collection('products')
    .where('active', '==', true)
    .get();

  const products: FirebaseFirestore.DocumentData[] = [];
  for (const productDoc of productDocs.docs) {
    const priceDocs = await admin
      .firestore()
      .collection(`products/${productDoc.id}/prices`)
      .where('active', '==', true)
      .get();

    const prices: StripePrice[] = [];
    for (const priceDoc of priceDocs.docs) {
      const price = priceDoc.data() as StripePrice;
      price.id = priceDoc.id;
      prices.push(price);
    }
    const product = productDoc.data() as StripeProduct;
    product.id = productDoc.id;
    product.prices = prices;
    products.push(product);
  }
  return products as StripeProduct[];
}
