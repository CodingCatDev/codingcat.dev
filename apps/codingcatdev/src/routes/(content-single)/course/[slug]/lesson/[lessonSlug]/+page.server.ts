import { getLessonFromCourseSlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.lesson;

export const load = (async ({ params, parent }) => {
	// Get parsed courses with lessons from layout
	const { courseItems } = await parent();
	const content = await getLessonFromCourseSlug({ courseSlug: params.slug, slug: params.lessonSlug, courseItems });
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return {
		contentType,
		content
	};
});
