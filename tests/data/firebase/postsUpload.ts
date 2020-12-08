import admin from "firebase-admin";
const serviceAccountKey = require("../../serviceAccountKey.json");
const seed = require("firestore-seed");
import { posts } from "./postsCreator";
var uuid = require("uuid");

// Initialize firebase-admin.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  databaseURL: "https://dev-codingcat-dev.firebaseio.com",
  storageBucket: "dev-codingcat-dev.appspot.com",
});

const postDocs = [];
posts().forEach((postDoc) => {
  postDocs.push(seed.doc(uuid.v4(), postDoc));
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
