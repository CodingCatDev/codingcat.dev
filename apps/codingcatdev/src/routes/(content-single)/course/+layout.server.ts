import { fileURLToPath } from 'url';
import { error } from '@sveltejs/kit';
import { filterContent, getContentTypeDirectory, listContent, parseContentType } from '$lib/server/content';
import { ContentType, type Course, type Author } from '$lib/types';

export const load = (async (params) => {
    try {
        const splitPath = params.url.pathname.split('/');
        const courseSlug = splitPath.at(2);
        const lessonSlug = splitPath.at(4);

        const path = fileURLToPath(new URL(`./${courseSlug}/+page.md`, import.meta.url));
        const md = await parseContentType<Course>(path);
        if (!md) throw error(404);
        const contentItems = await filterContent({ contentItems: [md] })
        const course = contentItems?.at(0);
        if (!course) throw error(404);

        const authors = (await listContent<Author>({
            contentItems: await getContentTypeDirectory<Author>(ContentType.author)
        }))?.content

        return {
            content: course.lesson?.find(l => l.slug === lessonSlug),
            course,
            authors
        }

    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})