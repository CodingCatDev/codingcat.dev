import { getLessonFromCourseSlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const contentType = ContentType.lesson;

export const load = (async ({ params }) => {
	const content = await getLessonFromCourseSlug(params.slug, params.lessonSlug);
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return {
		contentType,
		content
	};
}) satisfies PageServerLoad;
