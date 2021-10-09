import { config } from '@/config/firebase';
import firebase from 'firebase/app';
export default async function initFirebase(): Promise<
  firebase.app.App | undefined
> {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const firebase = await import('firebase/app');
    await import('firebase/auth');
    await import('firebase/firestore');
    // await import('firebase/database');
    await import('firebase/analytics');
    // await import('firebase/remote-config');
    // await import('firebase/messaging');
    await import('firebase/functions');
    if (!firebase.default.apps.length) {
      firebase.default.initializeApp(config);
      if (process.env.NEXT_PUBLIC_CCD_EMULATED) {
        firebase.default.auth().useEmulator('http://localhost:9099/');
        firebase.default.firestore().useEmulator('localhost', 8080);
        firebase.default.database().useEmulator('localhost', 9000);
        firebase.default.functions().useEmulator('localhost', 5001);
      } else {
        firebase.default.auth();
        firebase.default.firestore();
        // firebase.default.database();
        firebase.default.functions();
      }
      firebase.default.analytics();
      // firebase.default.remoteConfig();
      // firebase.default.messaging();
    }
    return firebase.default.app();
  } catch (err: any) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    console.log(err);
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }
}
