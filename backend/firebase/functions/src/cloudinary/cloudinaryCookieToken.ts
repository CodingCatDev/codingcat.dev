import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

import { v2 as cloudinary } from 'cloudinary';

import {
  cloudinaryName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryTokenKey,
} from './../config/config';

const config = {
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
};
cloudinary.config(config);

// const validRoles = ['admin', 'editor', 'author'];

export const cloudinaryCookieToken = functions.https.onCall(
  async (data, context) => {
    // Verify User is allowed to get a cookie.
    // This should verify the token from stripe on the ACL
    // if (context.auth && context.auth.uid) {
    //   const userRef = admin
    //     .firestore()
    //     .collection('users')
    //     .doc(context.auth.uid)
    //     .get();
    //   const user: any = (await userRef).data();
    //   const roles: string[] = user.roles;
    //   console.log('Checking User for roles', JSON.stringify(user));
    //   if (!roles.some((a) => validRoles.includes(a))) {
    //     throw new functions.https.HttpsError(
    //       'permission-denied',
    //       `User missing ${validRoles}`
    //     );
    //   }
    // }
    // if (!cloudinaryApiSecret || !cloudinaryApiKey || !cloudinaryName) {
    //   throw new functions.https.HttpsError(
    //     'invalid-argument',
    //     'The function must be called with data.upload_preset'
    //   );
    // }

    const cookieToken = await cloudinary.utils.generate_auth_token({
      key: cloudinaryTokenKey,
      provisioning_api_key: cloudinaryApiKey,
      provisioning_api_secret: cloudinaryApiSecret,
      // account_id: cloudinaryName,
      duration: 600,
      acl: '*/ccd-cloudinary/videos/*',
      // private_cdn: true,
      // secure_distribution: true,
      // cname: 'media.codingcat.dev',
    });
    return cookieToken;
  }
);
