import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

import {
    PUBLIC_FB_PROJECT_ID,
} from '$env/static/public';

import {
    PRIVATE_FB_CLIENT_EMAIL,
    PRIVATE_FB_PRIVATE_KEY
} from '$env/static/private';

export let app = getApps().at(0);
if (!app) {
    app = initializeApp({
        credential: cert({
            projectId: PUBLIC_FB_PROJECT_ID,
            clientEmail: PRIVATE_FB_CLIENT_EMAIL,
            privateKey: PRIVATE_FB_PRIVATE_KEY
        })
    });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export const ccdCreateSessionCookie = async (idToken: string) => {
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    // Set cookie policy for session cookie.
    const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    return {
        name: 'session',
        sessionCookie,
        options
    }
};

export const ccdValidateSessionCookie = async (session: string) => {
    return await auth.verifySessionCookie(session, true);
}

export const validateStripeRole = async (uid: string) => {
    const user = await auth.getUser(uid);
    return user.customClaims?.['stripeRole']
}