import { env } from '$env/dynamic/private';
import { getLessonFromCourseSlug } from '$lib/server/content';
import { db } from '$lib/server/firebase';
import { ContentType } from '$lib/types';
import { error, redirect } from '@sveltejs/kit';


const contentType = ContentType.lesson;

export const load = (async ({ params, parent, url }) => {
	// Get parsed courses with lessons from layout
	const { courseItems, user } = await parent();
	const content = await getLessonFromCourseSlug({ courseSlug: params.slug, slug: params.lessonSlug, courseItems });
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	if (content.locked) {
		// Locked but needs to be logged in
		if (!user?.uid) {
			throw redirect(307, `/login?redirectTo=${url.pathname}`);
		}

		// Check if user is admin
		const doc = await db.collection('admins').doc(user.uid).get();
		const isAdmin = doc.exists;

		// User should have stripeRole or be admin
		if (user?.stripeRole || isAdmin) {
			return {
				contentType,
				content
			};
		} else {
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
				products,
				locked: content?.locked,
				title: content?.title
			};
		}
	}

	//Not Locked we just send it back
	return {
		contentType,
		content
	};
});
