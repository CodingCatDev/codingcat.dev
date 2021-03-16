import * as functions from 'firebase-functions';
import { firestore } from './../config/config';
import { v4 as uuid } from 'uuid';

export const onPostCreate = functions.firestore
  .document('posts/{postId}')
  .onCreate(async (snap, context) => {
    console.log('Adding slug to collection');
    const post = snap.data();

    if (!post) {
      console.log('post missing data');
      return;
    }

    const author = await getPostCreatorProfile(post);

    const authors = [];

    if (author) {
      authors.push(author);
    }

    // Rules should require that all posts have a status of
    // history on initial create
    const id = uuid();
    await firestore
      .doc(`posts/${context.params.postId}/history/${id}`)
      .set({ ...post, id, postId: context.params.postId, authors });

    // Set current post to history
    return firestore
      .doc(`posts/${context.params.postId}`)
      .set({ historyId: id }, { merge: true });
  });

export const onPostWrite = functions.firestore
  .document('posts/{postId}')
  .onWrite(async (snap, context) => {
    //Keep function
    return true;
  });

export const onPostDelete = functions.firestore
  .document('posts/{postId}')
  .onDelete(async (snap, context) => {
    const slugs = await firestore
      .collection('postSlugs')
      .where('postId', '==', context.params.postId)
      .get();
    return Promise.all(
      slugs.docs.map((slug) => {
        console.log('Deleting', slug.id);
        return firestore.collection('postSlugs').doc(slug.id).delete();
      })
    );
  });

export const onHistoryWrite = functions.firestore
  .document('posts/{postId}/history/{id}')
  .onWrite(async (snap, context) => {
    const post = snap.before.data();

    if (!post) {
      console.log('post missing data');
      return;
    }

    //Update Missing Authors
    if (!post.authors || post.authors.length === 0) {
      const author = await getPostCreatorProfile(post);

      const authors = [];

      if (author) {
        authors.push(author);
      }

      return firestore
        .doc(`posts/${context.params.postId}/history/${context.params.id}`)
        .set({ authors }, { merge: true });
    } else {
      return;
    }
  });

async function getPostCreatorProfile(post: any) {
  if (post.createdBy) {
    // Get createdBy
    console.log('Getting Profile: ', post.createdBy);
    const profileDoc = await firestore.doc(`profiles/${post.createdBy}`).get();
    const profile = profileDoc.data();
    if (profile && Object.keys(profile)) {
      console.log('Profile Found: ', JSON.stringify(profile));
      return profile;
    } else {
      console.log('Profile Not Found');
      return null;
    }
  } else {
    return null;
  }
}
