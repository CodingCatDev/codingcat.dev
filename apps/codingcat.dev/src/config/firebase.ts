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

export const emulation = {
  authEmulatorHost: process.env.NEXT_PUBLIC_FB_AUTH_HOST,
  databaseEmulatorHost: process.env.NEXT_PUBLIC_FB_DB_HOST,
  firestoreEmulatorHost: process.env.NEXT_PUBLIC_FB_FS_HOST,
  cloudStorageEmulatorHost: process.env.NEXT_PUBLIC_CS_HOST,
  cloudFunctionsEmulatorHost: process.env.NEXT_PUBLIC_FB_FN_HOST,
};
