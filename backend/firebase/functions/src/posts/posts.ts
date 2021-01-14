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

    // Rules should require that all posts have a status of
    // history on initial create
    const id = uuid();
    await firestore
      .doc(`posts/${context.params.postId}/history/${id}`)
      .set({ ...post, id, postId: context.params.postId });

    // Set current post to history
    return firestore
      .doc(`posts/${context.params.postId}`)
      .set({ historyId: id }, { merge: true });
  });

export const onPostWrite = functions.firestore
  .document('posts/{postId}')
  .onWrite(async (snap, context) => {
    console.log('Adding slug to collection');
    const post = snap.after.data();

    if (!post) {
      console.log('post missing data');
      return;
    }
    const slugCheck = await firestore
      .collection('postBaseNames')
      .doc(post.slug)
      .get();
    if (slugCheck.exists) {
      console.log('Slug already found, fail!');
      return false;
    }
    return firestore
      .collection('postSlugs')
      .doc(post.slug)
      .set({ postId: context.params.postId });
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
