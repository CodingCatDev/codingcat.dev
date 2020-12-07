import * as functions from "firebase-functions";

export const firestoreBackupBucket = functions.config().firestore_backup.bucket;
