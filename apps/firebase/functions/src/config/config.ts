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

// Google
export const calendarChannelId = checkMain('calendar', 'channel_id');
export const calendarRefreshToken = checkMain('calendar', 'refresh_token');
export const clientId = checkMain('google', 'client_id');
export const clientSecret = checkMain('google', 'client_secret');
export const redirectUri = checkMain('google', 'redirect_uri');

// Dev.to
export const devto = checkMain('devto', 'key');

// Hashnode
export const hashnodeKey = checkMain('hashnode', 'key');
export const hashnodePublicationId = checkMain('hashnode', 'publication_id');
