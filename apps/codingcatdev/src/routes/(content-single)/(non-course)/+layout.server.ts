import { fileURLToPath } from 'url';
import { error } from '@sveltejs/kit';
import { filterContent, parseContentType } from '$lib/server/content';
import type { Content } from '$lib/types';

export const load = (async (params) => {
    try {
        const path = fileURLToPath(new URL(`./${params.url.pathname}/+page.md`, import.meta.url));
        const md = await parseContentType<Content>(path);
        if (!md) throw error(404);

        const contentItems = await filterContent({ contentItems: [md] })
        const content = contentItems?.at(0);
        if (!content) throw error(404);
        return {
            content,
            course: [],
            tutorial: [],
            podcast: [],
            post: []
        }

    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})