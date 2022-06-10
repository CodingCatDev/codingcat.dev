export const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

export { scheduledFirestoreExport } from './backups/firestore';
export { newUserSetup } from './user/user';
export { cloudinarysignature } from './cloudinary/cloudinarysignature';
export { cloudinaryCookieToken } from './cloudinary/cloudinaryCookieToken';
export {
  onSubscriptionCreate,
  onSubscriptionCancel,
} from './stripe/subscriptions';

// Should only run in main
export { calendarPush } from './calendly/webhook';
export { getCode, getToken } from './google/auth';
export {
  scheduledNotionToCloudinary,
  cloudinaryToNotionPubSub,
} from './cloudinary/scheduledNotionCheck';

// Algolia scheduled
export { scheduledNotionToAlgolia } from './algolia/algolia';
