import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import initFirebase from '@/utils/initFirebase';

initFirebase();
const db = firebase.firestore();

export const getPost = async (postId) => {
  return await db.collection('posts').doc(postId).get();
};

export const getPosts = async (post_type: string, limit: number) => {
  return await db
    .collection(post_type)
    .limit(limit)
    .orderBy('updatedAt', 'desc')
    .get();
};
