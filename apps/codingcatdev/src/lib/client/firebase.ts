import { browser } from '$app/environment';

import { initializeApp, getApps, FirebaseError } from 'firebase/app';
import {
	getAuth,
	setPersistence,
	browserSessionPersistence,
	signInWithEmailAndPassword,
	signInWithPopup,
	type AuthProvider,
	type Auth,
	createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, Firestore } from 'firebase/firestore';
import { httpsCallable, getFunctions, type Functions } from 'firebase/functions';
import {
	getAnalytics,
	type Analytics,
	logEvent,
	type AnalyticsCallOptions
} from 'firebase/analytics';

import { env } from '$env/dynamic/public';

export const firebaseConfig = {
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
let analytics: Analytics;

if (
	!app &&
	browser &&
	firebaseConfig.apiKey &&
	firebaseConfig.authDomain &&
	firebaseConfig.projectId &&
	firebaseConfig.storageBucket &&
	firebaseConfig.messagingSenderId &&
	firebaseConfig.appId &&
	firebaseConfig.measurementId
) {
	app = initializeApp(firebaseConfig);

	auth = getAuth(app);
	// As httpOnly cookies are to be used, do not persist any state client side.
	setPersistence(auth, browserSessionPersistence);
	db = getFirestore(app);
	functions = getFunctions(app);
	analytics = getAnalytics(app);
} else {
	console.debug('Skipping Firebase Initialization, check firebaseconfig.');
}

/* AUTH */

const setCookie = (idToken: string) => {
	document.cookie = '__ccdlogin=' + idToken + ';max-age=3600';
};

export const ccdSignInWithEmailAndPassword = async ({
	email,
	password
}: {
	email: string;
	password: string;
}) => {
	const userResponse = await signInWithEmailAndPassword(auth, email, password);
	const idToken = await userResponse.user.getIdToken();
	setCookie(idToken);
};

export const ccdSignUpWithEmailAndPassword = async ({
	email,
	password
}: {
	email: string;
	password: string;
}) => {
	const userCredential = await createUserWithEmailAndPassword(auth, email, password);
	const idToken = await userCredential.user.getIdToken();
	setCookie(idToken);
};

export const ccdSignInWithPopUp = async (provider: AuthProvider) => {
	const result = await signInWithPopup(auth, provider);
	const idToken = await result.user.getIdToken();

	if (!idToken) throw 'Missing id Token';
	setCookie(idToken);
};

/* DB */

/* STRIPE */
export const addSubscription = async (price: string, uid: string) => {
	const userDoc = doc(collection(db, 'stripe-customers'), uid);
	return await addDoc(collection(userDoc, 'checkout_sessions'), {
		price,
		success_url: window.location.href,
		cancel_url: window.location.href
	});
};

/* FUNCTIONS */
export const openStripePortal = async () => {
	const functionRef = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');
	const { data } = (await functionRef({
		returnUrl: window.location.href
	})) as { data: { url: string } };
	window.location.assign(data.url);
};

/* Analytics */
export const analyticsLogPageView = async (
	eventParams?: {
		page_title?: string;
		page_location?: string;
		page_path?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	},
	options?: AnalyticsCallOptions
) => {
	if (firebaseConfig.apiKey) {
		logEvent(analytics, 'page_view', eventParams, options);
	} else {
		console.debug('Skipping Firebase Analytics, no key specified.');
	}
};
