import { error, redirect } from '@sveltejs/kit';
import { allowLocal, filterContent, getContentTypePath } from '$lib/server/content';
import { ContentType, type Course, type Author, type Sponsor } from '$lib/types';
import { getShowDrafts } from '$lib/server/firebase';

export const prerender = false;

export const load = async ({ url, parent }) => {
	const data = await parent();

	try {
		const splitPath = url.pathname.split('/');
		const courseSlug = splitPath.at(2);
		const lessonSlug = splitPath.at(4);
		const showDrafts = await getShowDrafts(data?.user?.uid);

		if (!courseSlug) throw error(404);
		const md = await getContentTypePath<Course>(
			ContentType.course,
			courseSlug,
			undefined,
			false,
			showDrafts
		);

		if (!md) throw error(404);
		const contentItems = await filterContent({
			contentItems: [md],
			userPreview: showDrafts
		});
		const course = contentItems?.at(0);
		if (!course) throw error(404);

		// Content is good, fetch surrounding items
		const authors: Author[] = [];
		if (course?.authors) {
			for (const authorSlug of course.authors) {
				const author = await getContentTypePath<Author>(ContentType.author, authorSlug);
				if (author) authors.push(author);
			}
		}

		const sponsors: Sponsor[] = [];
		if (course?.sponsors) {
			for (const sponsorSlug of course.sponsors) {
				const sponsor = await getContentTypePath<Sponsor>(ContentType.sponsor, sponsorSlug);
				if (sponsor) sponsors.push(sponsor);
			}
		}

		const content = course.lesson?.find((l) => l.slug === lessonSlug);
		if (
			lessonSlug &&
			content?.locked &&
			!allowLocal &&
			(!data?.user?.uid || !data?.user?.stripeRole)
		) {
			throw 'app:redirect';
		}

		return {
			content,
			course,
			authors,
			sponsors
		};
	} catch (e) {
		console.error(e);

		if (e === 'app:redirect') {
			throw redirect(307, `/login?redirectTo=${url.pathname}`);
		}

		throw error(404);
	}
};
