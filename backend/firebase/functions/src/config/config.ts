import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const firestore = admin.firestore();

export const firestoreBackupBucket = functions.config().firestore_backup.bucket;

//Project
export const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

const config = functions.config();
const checkMain = (objectName: string, paramName: string) => {
  return config?.[objectName]?.[paramName]
    ? config?.[objectName]?.[paramName]
    : '';
};

// Algolia
export const algoliaAppId = checkMain('algolia', 'app_id');
export const algoliaApiKey = checkMain('algolia', 'api_key');
export const algoliaSearchKey = checkMain('algolia', 'search_key');
export const algoliaIndex = checkMain('algolia', 'index');

// Cloudinary
export const cloudinaryName = checkMain('cloudinary', 'name');
export const cloudinaryApiKey = checkMain('cloudinary', 'api_key');
export const cloudinaryApiSecret = checkMain('cloudinary', 'api_secret');
export const cloudinaryTokenKey = checkMain('cloudinary', 'token_key');
export const cloudinaryVideo = checkMain('cloudinary', 'video');

// Google
export const calendarChannelId = checkMain('calendar', 'channel_id');
export const calendarRefreshToken = checkMain('calendar', 'refresh_token');
export const clientId = checkMain('google', 'client_id');
export const clientSecret = checkMain('google', 'client_secret');
export const redirectUri = checkMain('google', 'redirect_uri');

// Twitter
export const twitterBearerToken = checkMain('twitter', 'bearer_token');

// Notion
export const notionToken = checkMain('notion', 'token');
export const notionPurrfectDatabaseId = checkMain(
  'notion',
  'purrfect_database_id'
);
export const notionPurrfectGuestDatabaseId = checkMain(
  'notion',
  'purrfect_guest_database_id'
);
export const notionPurrfectCompanyDatabaseId = checkMain(
  'notion',
  'purrfect_company_database_id'
);
