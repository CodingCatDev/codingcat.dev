import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import initFirebase from '@/utils/initFirebase';
import { docData, collection, collectionData } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
initFirebase();
const firestore = firebase.firestore();

/* POST */

export const postDataObservable = (id: string) => {
  return docData(firestore.doc(id));
};

export const postsDataObservable = (post_type: string, limit: number) => {
  if (limit && limit > 0) {
    return collectionData(
      firestore.collection(post_type).limit(limit).orderBy('updatedAt', 'desc')
    );
  } else {
    return collectionData(
      firestore.collection(post_type).orderBy('updatedAt', 'desc')
    );
  }
};

export const postUpdate = (id: string, post_content: string) => {
  firestore.doc(id).set({ post_content }, { merge: true });
};

/* POSTS */

export const postsObservable = (post_type: string, limit: number = null) => {
  if (limit && limit > 0) {
    return collection(
      firestore.collection(post_type).limit(limit).orderBy('updatedAt', 'desc')
    ).pipe(
      map((docs) =>
        docs.map((d) => {
          return { ...d.data(), id: d.id };
        })
      )
    );
  } else {
    return collection(
      firestore.collection(post_type).orderBy('updatedAt', 'desc')
    ).pipe(
      map((docs) =>
        docs.map((d) => {
          return { ...d.data(), id: d.id };
        })
      )
    );
  }
};
