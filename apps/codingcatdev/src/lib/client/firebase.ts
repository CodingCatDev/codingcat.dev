import { toastStore } from '@codingcatdev/blackcatui';
import { initializeApp, getApps, FirebaseError } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup, type AuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot } from 'firebase/firestore';

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

/* AUTH */
export const auth = getAuth(app);
// As httpOnly cookies are to be used, do not persist any state client side.
setPersistence(auth, browserSessionPersistence);

const setCookie = (idToken: string) => {
	document.cookie = '__ccdlogin=' + idToken + ';max-age=3600';
}

export const ccdSignInWithEmailAndPassword = async ({ email, password }: { email: string, password: string }) => {
	const userResponse = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await userResponse.user.getIdToken();
	setCookie(idToken);
}

export const ccdSignInWithPopUp = async (provider: AuthProvider) => {
	try {
		const result = await signInWithPopup(auth, provider)
		const idToken = await result.user.getIdToken()

		if (!idToken)
			throw 'Missing id Token'
		setCookie(idToken);
	} catch (err) {
		if (err instanceof FirebaseError) {
			if (err.code === 'auth/account-exists-with-different-credential') {
				toastStore.trigger({
					message: 'Account Exists with Different Login Method. Please first login and then link within your Account page.',
					background: 'variant-filled-warning',
				})
			} else {
				toastStore.trigger({
					message: err.message,
					background: 'variant-filled-error'
				})
			}
		}
	}
}

/* DB */
export const db = getFirestore(app);

export const addSubscription = async (price: string) => {
	const userDoc = doc(collection(db, 'stripe-customers'), auth.currentUser?.uid)
	const docRef = await addDoc(collection(userDoc, 'checkout_sessions'), {
		price,
		success_url: window.location.href,
		cancel_url: window.location.href,
	})
	onSnapshot(docRef, (snap) => {
		const { error, url } = snap.data() as { error: Error, url: string };
		if (error) {
			toastStore.trigger({
				message: error.message,
				background: 'variant-filled-error'
			})
		}
		if (url) {
			// We have a Stripe Checkout URL, let's redirect.
			window.location.assign(url);
		}
	});
};