import { toastStore } from '@codingcatdev/blackcatui';
import { initializeApp, getApps, FirebaseError } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signInWithPopup, type AuthProvider, type Auth } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { httpsCallable, getFunctions, type Functions } from 'firebase/functions';

import { env } from '$env/dynamic/public';

const firebaseConfig = {
	apiKey: env.PUBLIC_FB_API_KEY,
	authDomain: env.PUBLIC_FB_AUTH_DOMAIN,
	projectId: env.PUBLIC_FB_PROJECT_ID,
	storageBucket: env.PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: env.PUBLIC_FB_MESSAGE_SENDER_ID,
	appId: env.PUBLIC_FB_APP_ID,
	measurementId: env.PUBLIC_FB_MEASUREMENT_ID
};

let app = getApps().at(0);
let auth: Auth;
let db: Firestore;
let functions: Functions;

if (!app &&
	firebaseConfig.apiKey &&
	firebaseConfig.authDomain &&
	firebaseConfig.projectId &&
	firebaseConfig.storageBucket &&
	firebaseConfig.messagingSenderId &&
	firebaseConfig.appId &&
	firebaseConfig.measurementId) {

	app = initializeApp(firebaseConfig);

	auth = getAuth(app);
	// As httpOnly cookies are to be used, do not persist any state client side.
	setPersistence(auth, browserSessionPersistence);
	db = getFirestore(app);
	functions = getFunctions(app);
}

/* AUTH */

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

/* STRIPE */
export const addSubscription = async (price: string, uid: string) => {
	const userDoc = doc(collection(db, 'stripe-customers'), uid)
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

/* FUNCTIONS */
export const openStripePortal = async () => {
	const functionRef = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');
	const { data } = await functionRef({
		returnUrl: window.location.href,
	}) as { data: { url: string } };
	window.location.assign(data.url);
}