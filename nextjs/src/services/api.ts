import { PostType, PostStatus, PostVisibility } from './../models/post.model';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import initFirebase from '@/utils/initFirebase';
import { docData, collectionData, doc } from 'rxfire/firestore';
import { map, take } from 'rxjs/operators';
import { Post } from '@/models/post.model';
import { UserInfo } from '@/models/userInfo.model';
import { v4 as uuid } from 'uuid';

initFirebase();
const firestore = firebase.firestore();
/* POST */

export const postDataObservable = (path: string) => {
  return docData<Post>(firestore.doc(path));
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

export const postCreate = (type: PostType, title: string, slug: string) => {
  const id = uuid();
  const uid = firebase.auth().currentUser?.uid;
  const post: Post = {
    id,
    createdAt: firebase.firestore.Timestamp.now(),
    updatedAt: firebase.firestore.Timestamp.now(),
    // publishedAt: firebase.firestore.Timestamp.now(),
    createdBy: uid,
    updatedBy: uid,
    type,
    title,
    status: PostStatus.draft,
    visibility: PostVisibility.private,
    slug,
    permalink: `/${slug}`,
  };
  const docRef = firestore.collection('posts').doc(id);
  docRef.set(post);
  return docData<Post>(docRef);
};

export const postUpdate = (id: string, content: string) => {
  return firestore.doc(id).set({ content }, { merge: true });
};

/* POSTS */

export const postsByUpdatedAtObservable = (
  postType: string,
  limit: number = 0
) => {
  let ref = firestore
    .collection('posts')
    .where('type', '==', postType)
    .orderBy('updatedAt', 'desc');

  if (limit && limit > 0) {
    ref = ref.limit(limit);
  }

  return collectionData<Post>(ref, 'id').pipe(
    map((docs) =>
      docs.map((d) => {
        return cleanTimestamp(d) as Post;
      })
    )
  );
};

export const postsByPublishedAtObservable = (
  postType: string,
  limit: number = 0
) => {
  let ref = firestore
    .collection('posts')
    .where('type', '==', postType)
    .where('publishedAt', '!=', null)
    .orderBy('publishedAt', 'desc');

  if (limit && limit > 0) {
    ref = ref.limit(limit);
  }

  return collectionData<Post>(ref, 'id').pipe(
    map((docs) =>
      docs.map((d) => {
        return cleanTimestamp(d) as Post;
      })
    )
  );
};

export const postsSlugUnique = async (slug: string) => {
  let ref = await firestore.collection('posts').where('slug', '==', slug).get();
  return ref.size > 0 ? false : true;
};

/* Post History */

export const postHistoryDataObservable = (
  postId: string,
  historyId: string
) => {
  return docData<Post>(firestore.doc(`posts/${postId}/history/${historyId}`));
};

export const postHistoriesDataObservable = (postId: string) => {
  return collectionData<Post>(
    firestore.collection(`posts/${postId}/history`).orderBy('updatedAt', 'desc')
  );
};

export const postHistoryUpdate = (history: Post) => {
  const docRef = firestore.doc(
    `posts/${history.postId}/history/${history.historyId}`
  );
  docRef.set(
    {
      ...history,
      updatedAt: firebase.firestore.Timestamp.now(),
      updatedBy: firebase.auth()?.currentUser?.uid,
    },
    { merge: true }
  );
  return docData(docRef);
};

export const postHistoryCreate = (history: Post) => {
  const id = uuid();

  const docRef = firestore.doc(`posts/${history.postId}/history/${id}`);
  docRef.set({
    ...history,
    publishedAt: firebase.firestore.FieldValue.delete(),
    status: PostStatus.draft,
    updatedAt: firebase.firestore.Timestamp.now(),
    updatedBy: firebase.auth()?.currentUser?.uid,
    id: id,
  });
  return docData(docRef);
};

// User
export const userProfileDataObservable = (uid: string) => {
  return docData<UserInfo>(firestore.doc(`/profiles/${uid}`), uid);
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
