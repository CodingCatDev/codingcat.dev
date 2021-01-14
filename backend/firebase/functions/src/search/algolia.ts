import {
  algoliaApiKey,
  algoliaAppId,
  //   algoliaSearchKey,
  algoliaIndex,
} from './../config/config';
import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { cleanTimestamp } from '../utilities/timestamps';

const ALGOLIA_INDEX_NAME = algoliaIndex;
const client = algoliasearch(algoliaAppId, algoliaApiKey);

export const onPostWriteSearch = functions.firestore
  .document('posts/{postId}')
  .onWrite((snap, context) => {
    console.log('Adding Data for', context.params.postId);
    const post = snap.after.data();

    if (!post) {
      console.log('post missing data');
      return;
    }

    post.objectID = context.params.postId;

    // Write to the algolia index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(cleanTimestamp(post));
  });

export const onPostDeleteSearch = functions.firestore
  .document('posts/{postId}')
  .onDelete((snap, context) => {
    // Write to the algolia index
    console.log('Deleting Data for', context.params.postId);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.deleteObject(context.params.postId);
  });

/* Leaving this for now as we might need user search for personal items */
// const admin = require("firebase-admin");
// admin.initializeApp();

// async function getFirebaseUser(req, res, next) {
//   console.log("Check if request is authorized with Firebase ID token");

//   if (
//     !req.headers.authorization ||
//     !req.headers.authorization.startsWith("Bearer ")
//   ) {
//     console.error(
//       "No Firebase ID token was passed as a Bearer token in the Authorization header.",
//       "Make sure you authorize your request by providing the following HTTP header:",
//       "Authorization: Bearer <Firebase ID Token>"
//     );
//     return res.sendStatus(403);
//   }

//   let idToken;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer ")
//   ) {
//     console.log("Found 'Authorization' header");
//     idToken = req.headers.authorization.split("Bearer ")[1];
//   }

//   try {
//     const decodedIdToken = await admin.auth().verifyIdToken(idToken);
//     console.log("ID Token correctly decoded", decodedIdToken);
//     req.user = decodedIdToken;
//     return next();
//   } catch (error) {
//     console.error("Error while verifying Firebase ID token:", error);
//     return res.status(403).send("Unauthorized");
//   }
// }
// // [END get_firebase_user]

// // [START get_algolia_user_token]
// // This complex HTTP function will be created as an ExpressJS app:
// // https://expressjs.com/en/4x/api.html
// const app = require("express")();

// // We'll enable CORS support to allow the function to be invoked
// // from our app client-side.
// app.use(require("cors")({ origin: true }));

// // Then we'll also use a special 'getFirebaseUser' middleware which
// // verifies the Authorization header and adds a `user` field to the
// // incoming request:
// // https://gist.github.com/abeisgoat/832d6f8665454d0cd99ef08c229afb42
// app.use(getFirebaseUser);

// // Add a route handler to the app to generate the secured key
// app.get("/", (req, res) => {
//   // Create the params object as described in the Algolia documentation:
//   // https://www.algolia.com/doc/guides/security/api-keys/#generating-api-keys
//   const params = {
//     // This filter ensures that only documents where author == user_id will be readable
//     filters: `author:${req.user.user_id}`,
//     // We also proxy the user_id as a unique token for this key.
//     userToken: req.user.user_id,
//   };

//   // Call the Algolia API to generate a unique key based on our search key
//   const key = client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, params);

//   // Then return this key as {key: '...key'}
//   res.json({ key });
// });

// // Finally, pass our ExpressJS app to Cloud Functions as a function
// // called 'getSearchKey';
// exports.getSearchKey = functions.https.onRequest(app);
// // [END get_algolia_user_token]
