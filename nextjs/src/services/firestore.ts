import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import initFirebase from '@/utils/initFirebase';

initFirebase();
const db = firebase.firestore();

export const getPost = async (docId: string) => {
  return await (await db.doc(docId).get()).data();
};

export const getPosts = async (post_type: string, limit: number) => {
  if (limit && limit > 0) {
    return await db
      .collection(post_type)
      .limit(limit)
      .orderBy('updatedAt', 'desc')
      .get();
  } else {
    return await db.collection(post_type).orderBy('updatedAt', 'desc').get();
  }
};
