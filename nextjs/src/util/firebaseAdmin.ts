import * as admin from "firebase-admin";

import { serviceAccountKey, config } from "../config/firebase";

if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: config.databaseURL,
      storageBucket: config.storageBucket,
    });
  }

export default admin;