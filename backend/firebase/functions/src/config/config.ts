import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const firestore = admin.firestore();

export const firestoreBackupBucket = functions.config().firestore_backup.bucket;

// Algolia
export const algoliaAppId = functions.config().algolia.app_id;
export const algoliaApiKey = functions.config().algolia.api_key;
export const algoliaSearchKey = functions.config().algolia.search_key;
export const algoliaIndex = functions.config().algolia.index;

// Cloudinary
export const cloudinaryName = functions.config().cloudinary.name;
export const cloudinaryApiKey = functions.config().cloudinary.api_key;
export const cloudinaryApiSecret = functions.config().cloudinary.api_secret;
export const cloudinaryTokenKey = functions.config().cloudinary.token_key;

