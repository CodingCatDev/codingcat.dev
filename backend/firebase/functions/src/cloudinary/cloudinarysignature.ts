import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { v2 as cloudinary } from 'cloudinary';

import {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} from './../config/config';

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const validRoles = ['admin', 'editor', 'author'];

export const cloudinarysignature = functions.https.onCall(
  async (data, context) => {
    //Verify User is allowed to upload
    if (context.auth && context.auth.uid) {
      const userRef = admin
        .firestore()
        .collection('users')
        .doc(context.auth.uid)
        .get();
      const user: any = (await userRef).data();
      const roles: string[] = user.roles;
      console.log('Checking User for roles', JSON.stringify(user));
      if (!roles.some((a) => validRoles.includes(a))) {
        throw new functions.https.HttpsError(
          'permission-denied',
          `User missing ${validRoles}`
        );
      }
    }
    if (!cloudinaryApiSecret || !cloudinaryApiKey || !cloudinaryName) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with data.upload_preset'
      );
    }

    const signature = await cloudinary.utils.api_sign_request(
      data,
      cloudinaryApiSecret
    );
    return signature;
  }
);
