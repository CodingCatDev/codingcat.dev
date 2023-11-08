import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

import { env as publicEnv } from '$env/dynamic/public';

import { env as privateEnv } from '$env/dynamic/private';
import type { UserDoc } from '$lib/types';

export let app = getApps().at(0);

if (
	!app &&
	publicEnv.PUBLIC_FB_PROJECT_ID &&
	privateEnv.PRIVATE_FB_CLIENT_EMAIL &&
	privateEnv.PRIVATE_FB_PRIVATE_KEY
) {
	app = initializeApp({
		credential: cert({
			projectId: publicEnv.PUBLIC_FB_PROJECT_ID,
			clientEmail: privateEnv.PRIVATE_FB_CLIENT_EMAIL,
			privateKey: privateEnv.PRIVATE_FB_PRIVATE_KEY
		})
	});
}

/* AUTH */

export const ccdCreateSessionCookie = async (idToken: string) => {
	// Set session expiration to 5 days.
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	const auth = getAuth(app);
	const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
	// Set cookie policy for session cookie.
	const options = { maxAge: expiresIn, httpOnly: true, secure: true };

	return {
		name: 'session',
		sessionCookie,
		options
	};
};

export const ccdValidateSessionCookie = async (session: string) => {
	const auth = getAuth(app);
	return await auth.verifySessionCookie(session, true);
};

export const validateStripeRole = async (uid: string) => {
	const auth = getAuth(app);
	const user = await auth.getUser(uid);
	return user.customClaims?.['stripeRole'];
};

export const isAdmin = async (uid: string) => {
	// Check if user is admin
	const db = getFirestore();
	const doc = await db.collection('admins').doc(uid).get();
	return doc.exists;
};

export const setStripeRole = async (uid: string, remove = false) => {
	const auth = getAuth(app);
	auth.setCustomUserClaims(uid, { stripeRole: remove ? null : 'admin' });
};

export const getShowDrafts = async (uid?: string) => {
	if (!uid) return false;

	// Check if user is Pro and wants drafts
	const auth = getAuth(app);
	const user = await auth.getUser(uid);

	if (!user?.customClaims?.['stripeRole']) return false;

	const db = getFirestore();
	const doc = await db.collection('users').doc(user.uid).get();
	const userData = doc.data();
	return userData?.pro?.settings?.showDrafts;
};

/* DB */

export const getStripeProducts = async () => {
	const products: any = [];
	const db = getFirestore();

	if (!db) return products;

	const snapshot = await db.collection('stripe-products').where('active', '==', true).get();

	for (const doc of snapshot.docs) {
		const priceSnapshot = await doc.ref.collection('prices').where('active', '==', true).get();

		for (const price of priceSnapshot.docs) {
			products.push({
				id: doc.id,
				...doc.data(),
				price: price.id
			});
		}
	}
	return products;
};
