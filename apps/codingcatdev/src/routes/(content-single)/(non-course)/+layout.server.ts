import { fileURLToPath } from 'url';
import { error } from '@sveltejs/kit';
import { filterContent, getContentTypeDirectory, listContent, parseContentType } from '$lib/server/content';
import { ContentType, type Content, type Course } from '$lib/types';

export const load = (async (params) => {
    try {
        const path = fileURLToPath(new URL(`./${params.url.pathname}/+page.md`, import.meta.url));
        const md = await parseContentType<Content>(path);
        if (!md) throw error(404);

        const contentItems = await filterContent({ contentItems: [md] })
        const content = contentItems?.at(0);
        if (!content) throw error(404);


        const post = (await listContent<Content>({
            contentItems: await getContentTypeDirectory<Content>(ContentType.post),
            limit: 3
        })).content

        const course = (await listContent<Course>({
            contentItems: await getContentTypeDirectory<Course>(ContentType.course),
            limit: 3
        })).content


        const podcast = (await listContent<Content>({
            contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
            limit: 3
        })).content

        const tutorial = (await listContent<Content>({
            contentItems: await getContentTypeDirectory<Content>(ContentType.tutorial),
            limit: 3
        })).content

        return {
            content,
            course,
            tutorial,
            podcast,
            post,
        }

    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})