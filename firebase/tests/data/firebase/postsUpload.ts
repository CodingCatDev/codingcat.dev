import admin from 'firebase-admin';
const serviceAccountKey = require('../../../serviceAccountKey.json');
import { posts } from './postsCreator';

// Initialize firebase-admin.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: 'https://dev-codingcat-dev.firebaseio.com',
  storageBucket: 'dev-codingcat-dev.appspot.com',
});

posts().forEach((post) => {
  const postDoc = {
    ...post,
    createdAt: admin.firestore.Timestamp.fromDate(
      new Date(post.createdAt as any)
    ),
    updatedAt: admin.firestore.Timestamp.fromDate(
      new Date(post.updatedAt as any)
    ),
    publishedAt: admin.firestore.Timestamp.fromDate(
      new Date(post.publishedAt as any)
    ),
    createdBy: 'i6YGgcTIzpQd2aHhbZqNJPZxy6Z2',
    updatedBy: 'i6YGgcTIzpQd2aHhbZqNJPZxy6Z2',
  };
  admin.firestore().doc(`/posts/${postDoc.id}`).set(postDoc);
});
