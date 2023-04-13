import { db } from '$lib/server/firebase';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, parent }) => {
    const data = await parent();
    if (!data?.user?.uid) {
        throw redirect(307, `/login?redirectTo=${url.pathname}`);
    }

    const snapshot = await db.collection('stripe-products').where('active', '==', true).get();
    const products = [];

    for (const doc of snapshot.docs) {
        const priceSnapshot = await doc.ref.collection('prices').where('active', '==', true).get();

        for (const price of priceSnapshot.docs) {
            products.push({
                id: doc.id,
                ...doc.data(),
                price: price.id
            })
        }
    }
    return {
        products
    };

}) satisfies LayoutServerLoad;