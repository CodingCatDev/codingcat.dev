export const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

export { scheduledFirestoreExport } from './backups/firestore';
export { newUserSetup } from './user/user';
export { cloudinarysignature } from './cloudinary/cloudinarysignature';
export { cloudinaryCookieToken } from './cloudinary/cloudinaryCookieToken';
export {
  onSubscriptionCreate,
  onSubscriptionCancel,
} from './stripe/subscriptions';

export { getCode, getToken } from './google/auth';
export {
  scheduledNotionToCloudinary,
  cloudinaryToNotionPubSub,
  scheduledNotionCloudinaryConvert,
  notionPageFindFileBlocksPublish,
  cloudinaryConvertBlockPubSub,
} from './cloudinary/scheduledNotionCheck';

// Algolia scheduled
export { scheduledNotionToAlgolia } from './algolia/algolia';

// Calendly webhook pushes to pubsub
export { calendlyWebook } from './calendly/webhook';
export { calendlyCreateNotionCardPubSub } from './calendly/pubsub';

// Notion to Firestore
export { scheduledNotionToFirestore } from './firebase/notion';

// Notion to Devto
export {
  scheduledNotionToDevto,
  devtoToNotionPubSub,
} from './devto/scheduledNotionToDevto';
