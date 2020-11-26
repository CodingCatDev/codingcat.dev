import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FB_CONFIG_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FB_CONFIG_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FB_CONFIG_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FB_CONFIG_PROJECTID,
}

export default function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}
