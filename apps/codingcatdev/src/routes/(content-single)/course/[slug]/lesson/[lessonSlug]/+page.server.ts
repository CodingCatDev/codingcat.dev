import { allowLocal, getContentBySlug, getLessonFromCourseSlug, parseModules } from '$lib/server/content';
import { getStripeProducts, isAdmin } from '$lib/server/firebase';
import { ContentType, type Author } from '$lib/types';
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

	const authorModules = import.meta.glob(['../../../../../../content/author/*.md']);
	const authorItems = await parseModules(authorModules);

	const authors: Author[] = [];
	if (content?.authors?.length) {
		for (const authorSlug of content.authors) {
			const author = await getContentBySlug({ contentItems: authorItems, slug: authorSlug }) as unknown as Author;
			if (author) {
				authors.push(author);
			}
		}
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
				content,
				authors,
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
		content,
		authors,
	};
});
