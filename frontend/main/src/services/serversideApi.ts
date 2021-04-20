import { UserInfoExtended } from '@/models/user.model';
import { StripePrice, StripeProduct } from './../models/stripe.model';
import { PostType } from './../models/post.model';
import { Post } from '@/models/post.model';
import admin from '@/utils/firebaseAdmin';
import { PageLink, Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';

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

export async function postsByUser(
  postType: string,
  uid: string
): Promise<Post[]> {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .where('type', '==', postType)
    .where('publishedAt', '<', admin.firestore.Timestamp.now())
    .where('authorIds', 'array-contains', uid)
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
  if (postDoc.exists) {
    return cleanTimestamp(smallPostPayload(postDoc)) as Post;
  } else {
    return null;
  }
}

export async function getTags(): Promise<Tag[]> {
  const tagDocs = await admin
    .firestore()
    .collection(`tags`)
    .orderBy('slug')
    .get();
  if (tagDocs.empty) {
    return [];
  }
  const tags = tagDocs.docs.map((tagRef) => cleanTimestamp(tagRef.data()));
  return tags as Tag[];
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  const tagDocs = await admin
    .firestore()
    .collection(`tags`)
    .where('slug', '==', slug)
    .get();
  if (tagDocs.empty) {
    return null;
  }
  const tags = tagDocs.docs.map((tagRef) => cleanTimestamp(tagRef.data()));
  return tags[0] as Tag;
}

export async function postsByTag(
  postType: string,
  tag: string
): Promise<Post[]> {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .where('type', '==', postType)
    .where('publishedAt', '<', admin.firestore.Timestamp.now())
    .where('tag', 'array-contains', tag)
    .orderBy('publishedAt', 'desc')
    .get();

  const posts: FirebaseFirestore.DocumentData[] = [];
  for (const doc of postDocs.docs) {
    posts.push(cleanTimestamp(smallPostPayload(doc)));
  }
  return posts as Post[];
}

/* Site Configuration */
export async function getSite(): Promise<Site | null> {
  const siteDocs = await admin.firestore().collection('site').get();
  let site: Site | null = null;
  for (const siteDoc of siteDocs.docs) {
    site = siteDoc.data() as Site;
  }
  return site;
}

/* USER Authentication */

export async function validateAdminUser(idToken: string): Promise<boolean> {
  const userRecord = await getCookieUser(idToken);

  if (!userRecord || !userRecord.uid) {
    return false;
  }
  if (!isUserTeam(userRecord.uid)) {
    return false;
  }
  return true;
}

export async function validateCourseUser(
  idToken: string,
  productId: string
): Promise<boolean> {
  const userRecord = await getCookieUser(idToken);

  if (!userRecord || !userRecord.uid) {
    return false;
  }
  if (await isUserTeam(userRecord.uid)) {
    return true;
  }
  if (!(await isUserMember(userRecord.uid))) {
    if (!(await isUserCourseSub(userRecord.uid, productId))) {
      return false;
    }
  }
  return true;
}

export async function getCookieUser(
  idToken: string
): Promise<admin.auth.UserRecord | null> {
  //Verify Token
  const decodedToken = admin.auth().verifyIdToken(idToken);

  if (!decodedToken) {
    return Promise.resolve(null);
  }

  return await admin.auth().getUser((await decodedToken).uid);
}

export async function isUserTeam(uid: string): Promise<boolean> {
  if (!uid) {
    return Promise.resolve(false);
  }
  const userRef = await admin.firestore().doc(`users/${uid}`).get();

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
}

export async function isUserMember(uid: string): Promise<boolean> {
  if (!uid) {
    return Promise.resolve(false);
  }
  const memberSub = await admin
    .firestore()
    .collection(`customers/${uid}/subscriptions/`)
    .where('status', '==', 'active')
    .where('role', 'in', ['monthly', 'yearly'])
    .get();
  return !memberSub.empty;
}

export async function isUserCourseSub(
  uid: string,
  productId: string
): Promise<boolean> {
  if (!uid || !productId) {
    return Promise.resolve(false);
  }

  // Search if user has subscription to the product.
  const productRef = admin.firestore().collection('products').doc(productId);
  const courseSub = await admin
    .firestore()
    .collection(`customers/${uid}/subscriptions/`)
    .where('status', '==', 'active')
    .where('product', '==', productRef)
    .get();
  return !courseSub.empty;
}

export async function getAuthorUsers(): Promise<UserInfoExtended[]> {
  const authorData = await admin
    .firestore()
    .collection(`users`)
    .where('roles', 'array-contains-any', ['admin', 'editor', 'author'])
    .get();
  if (authorData.empty) {
    return [];
  }
  const authors = authorData.docs.map((authorRef) => authorRef.data());
  authors.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
  return authors as UserInfoExtended[];
}

export async function getAuthorProfile(
  uid: string
): Promise<FirebaseFirestore.DocumentData | undefined> {
  const authorData = await admin.firestore().doc(`profiles/${uid}`).get();
  return authorData.data();
}

export async function getAuthorProfiles(): Promise<UserInfoExtended[]> {
  const users = await getAuthorUsers();
  const profilesPromise: FirebaseFirestore.DocumentData[] = [];
  users.map((user: UserInfoExtended) => {
    const p = getAuthorProfile(user.uid);
    if (p) {
      profilesPromise.push(p);
    }
  });
  const profiles = await Promise.all(profilesPromise);
  return profiles.filter((x) => x !== undefined) as UserInfoExtended[];
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

export async function getActiveMemberProducts(): Promise<StripeProduct[]> {
  const productDocs = await admin
    .firestore()
    .collection('products')
    .where('active', '==', true)
    .where('role', 'in', ['monthly', 'yearly', 'supporter'])
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

export async function getStripeProduct(id: string): Promise<StripeProduct> {
  const productDoc = await admin
    .firestore()
    .collection('products')
    .doc(id)
    .get();

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

  return product as StripeProduct;
}
