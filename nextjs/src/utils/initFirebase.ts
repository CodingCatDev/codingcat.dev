import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/analytics';
import 'firebase/remote-config';
import 'firebase/messaging';

import { config } from '@/config/firebase';

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
    if (process.env.NEXT_PUBLIC_CCD_EMULATED) {
      firebase.auth().useEmulator('http://localhost:9099/');
      firebase.firestore().useEmulator('localhost', 8080);
      firebase.database().useEmulator('localhost', 9000);
    } else {
      firebase.auth();
      firebase.firestore();
      firebase.database();
    }
    firebase.analytics();
    firebase.remoteConfig();
    firebase.messaging();
  }
  return firebase;
}
