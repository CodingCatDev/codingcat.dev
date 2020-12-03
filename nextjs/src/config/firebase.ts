export const serviceAccountKey = {
  type: process.env.FIREBASE_SERVICE_TYPE,
  projectId: process.env.FIREBASE_SERVICE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_SERVICE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_SERVICE_CLIENT_EMAIL,
  clientOd: process.env.FIREBASE_SERVICE_CLIENT_ID,
  authUri: process.env.FIREBASE_SERVICE_AUTH_URI,
  tokenUri: process.env.FIREBASE_SERVICE_TOKEN_URI,
  authProviderX509CertUrl:
    process.env.FIREBASE_SERVICE_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.FIREBASE_SERVICE_CLIENT_509_CERT_URL,
};

export const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_CONFIG_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_CONFIG_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_CONFIG_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FB_CONFIG_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_CONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_CONFIG_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FB_CONFIG_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_CONFIG_MEASUREMENTID,
};
