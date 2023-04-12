import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const contentType = ContentType.course;

export const load = (async ({ params }) => {
    const course = await getContentBySlug(contentType, params.slug);
    if (!course) {
        throw error(404, {
            message: 'Not found'
        });
    }
    return {
        contentType,
        course
    };
}) satisfies LayoutServerLoad;
