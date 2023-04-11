import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup, type AuthProvider } from 'firebase/auth';

import {
	PUBLIC_FB_API_KEY,
	PUBLIC_FB_AUTH_DOMAIN,
	PUBLIC_FB_PROJECT_ID,
	PUBLIC_FB_STORAGE_BUCKET,
	PUBLIC_FB_MESSAGE_SENDER_ID,
	PUBLIC_FB_APP_ID,
	PUBLIC_FB_MEASUREMENT_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FB_API_KEY,
	authDomain: PUBLIC_FB_AUTH_DOMAIN,
	projectId: PUBLIC_FB_PROJECT_ID,
	storageBucket: PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FB_MESSAGE_SENDER_ID,
	appId: PUBLIC_FB_APP_ID,
	measurementId: PUBLIC_FB_MEASUREMENT_ID
};

export let app = getApps().at(0);
if (!app) {
	app = initializeApp(firebaseConfig);
}
export const auth = getAuth(app);
// As httpOnly cookies are to be used, do not persist any state client side.
setPersistence(auth, browserSessionPersistence);

/* AUTH */

export const ccdSignInWithEmailAndPassword = async ({ email, password }: { email: string, password: string }) => {
	const userResponse = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await userResponse.user.getIdToken();
	document.cookie = '__ccdlogin=' + idToken + ';max-age=3600';
}

export const ccdSignInWithPopUp = async (provider: AuthProvider) => {
	signInWithPopup(auth, provider)
}