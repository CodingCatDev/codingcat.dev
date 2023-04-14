import { getContentBySlug, parseLessonModules, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';

const contentType = ContentType.course;

export const load = (async ({ params }) => {
    const courseModules = import.meta.glob(['../../../../content/course/*/*.md']);
    const lessonModules = import.meta.glob('../../../../content/course/*/lesson/*.md');

    const courses = await parseModules(courseModules);
    const courseItems = await parseLessonModules({ lessonModules, courses });
    const course = await getContentBySlug({ contentItems: courseItems, slug: params.slug });
    if (!course) {
        throw error(404, {
            message: 'Not found'
        });
    }
    return {
        contentType,
        course,
        courseItems
    };
});
