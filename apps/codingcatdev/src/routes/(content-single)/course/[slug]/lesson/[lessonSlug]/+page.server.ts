import { allowLocal, getLessonFromCourseSlug } from '$lib/server/content';
import { getStripeProducts, isAdmin } from '$lib/server/firebase';
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

	if (!allowLocal && content.locked) {
		// Locked but needs to be logged in
		if (!user?.uid) {
			throw redirect(307, `/login?redirectTo=${url.pathname}`);
		}

		// User should have stripeRole or be admin
		if (user?.stripeRole || await isAdmin(user.uid)) {
			return {
				contentType,
				content
			};
		} else {
			return {
				products: await getStripeProducts(),
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
