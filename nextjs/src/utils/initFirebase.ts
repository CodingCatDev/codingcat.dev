import firebase from 'firebase/app'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_CONFIG_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_CONFIG_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_CONFIG_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FB_CONFIG_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FB_CONFIG_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_CONFIG_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FB_CONFIG_APPID,
  measurementId: process.env.NEXT_PUBLIC_FB_CONFIG_MEASUREMENTID
}


export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}
