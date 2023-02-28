import { getLessonFromCourseSlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import type { PageServerLoad } from './$types';

const contentType = ContentType.lesson;

export const load = (async ({ params }) => {
	return {
		contentType,
		content: await getLessonFromCourseSlug(params.slug, params.lessonSlug)
	};
}) satisfies PageServerLoad;
