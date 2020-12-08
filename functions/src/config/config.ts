import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

export const firestore = admin.firestore();

export const firestoreBackupBucket = functions.config().firestore_backup.bucket;
