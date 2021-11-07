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
export const cloudinaryVideo = functions.config().cloudinary.video;

// Google
export const calendarChannelId = functions.config().calendar.channel_id;
export const calendarRefreshToken = functions.config().calendar.refresh_token;
export const clientId = functions.config().google.client_id;
export const clientSecret = functions.config().google.client_secret;
export const redirectUri = functions.config().google.redirect_uri;

// Twitter
export const twitterBearerToken = functions.config().twitter.bearer_token;

// Notion
export const notionToken = functions.config().notion.token;
export const notionPurrfectDatabaseId = functions.config().notion
  .purrfect_database_id;
export const notionPurrfectGuestDatabaseId = functions.config().notion
  .purrfect_guest_database_id;
export const notionPurrfectCompanyDatabaseId = functions.config().notion
  .purrfect_company_database_id;
