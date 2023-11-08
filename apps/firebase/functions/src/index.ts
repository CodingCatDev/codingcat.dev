export const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

export { scheduledFirestoreExport } from './backups/firestore';
export { newUserSetup } from './user/user';
