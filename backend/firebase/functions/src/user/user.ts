import { firestore } from './../config/config';
import * as functions from 'firebase-functions';

export const newUserSetup = functions.auth
  .user()
  .onCreate(async (user, context) => {
    if (!user.email) {
      return null;
    }

    const ref = firestore.collection('users').doc(user.uid);
    const { uid, displayName, photoURL, email } = user;
    return ref
      .set(
        {
          uid,
          displayName,
          photoURL,
          email,
          joined: Date.now(),
        },
        { merge: true }
      )
      .then(() => {
        const profileRef = firestore.collection('profiles').doc(user.uid);
        return profileRef.set(
          {
            uid,
            displayName,
            photoURL,
            email,
            joined: Date.now(),
          },
          { merge: true }
        );
      });
  });
