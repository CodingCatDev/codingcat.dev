const admin = require("firebase-admin");
const serviceAccountKey = require("../../../serviceAccountKey.json");
const seed = require("firestore-seed");
import { posts } from "./postsCreator";

// Initialize firebase-admin.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://dev-codingcat-dev.firebaseio.com",
  storageBucket: "dev-codingcat-dev.appspot.com",
});

const postDocs = [];
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
    createdBy: "i6YGgcTIzpQd2aHhbZqNJPZxy6Z2",
    updatedBy: "i6YGgcTIzpQd2aHhbZqNJPZxy6Z2",
  };
  postDocs.push(seed.doc(postDoc.id, postDoc));
});

const postCollection = seed.collection(`posts`, postDocs);

postCollection
  .importDocuments(admin)
  .then(() => {
    console.log("Successfully imported documents.");
  })
  .catch((e) => {
    console.log("Failed to import documents: " + e);
  });
