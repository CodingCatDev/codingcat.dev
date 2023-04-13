import { db } from '$lib/server/firebase';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    try {
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
    } catch (error) {
        console.error(error)
    }
}) satisfies PageServerLoad;
