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

export const postsDataObservable = (postType: string, limit: number) => {
  if (limit && limit > 0) {
    return collectionData(
      firestore.collection(postType).limit(limit).orderBy('publishedAt', 'desc')
    );
  } else {
    return collectionData(
      firestore.collection(postType).orderBy('publishedAt', 'desc')
    );
  }
};

export const postUpdate = (id: string, content: string) => {
  return firestore.doc(id).set({ content }, { merge: true });
};

/* POSTS */

export const postsObservable = (postType: string, limit: number = null) => {
  if (limit && limit > 0) {
    return collection(
      firestore
        .collection('posts')
        .limit(limit)
        .where('type', '==', postType)
        .where('publishedAt', '!=', null)
        .orderBy('publishedAt', 'desc')
    ).pipe(
      map((docs) =>
        docs.map((d) => {
          return { ...d.data(), id: d.id };
        })
      )
    );
  } else {
    return collection(
      firestore
        .collection('posts')
        .where('type', '==', postType)
        .where('publishedAt', '!=', null)
        .orderBy('publishedAt', 'desc')
    ).pipe(
      map((docs) =>
        docs.map((d) => {
          const docData = cleanTimestamp(d.data());
          return { ...docData, id: d.id };
        })
      )
    );
  }
};

/* Utilities may be used on front end */
export function cleanTimestamp(data: FirebaseFirestore.DocumentData) {
  const docData = { ...data };
  Object.keys(docData).map((key) => {
    if (
      typeof docData[key] === 'object' &&
      Object.keys(docData[key]).includes('nanoseconds')
    ) {
      const timestamp: firebase.firestore.Timestamp = docData[key];
      docData[key] = timestamp.toDate().toString();
    } else {
      docData[key] = docData[key];
    }
  });
  return docData;
}
