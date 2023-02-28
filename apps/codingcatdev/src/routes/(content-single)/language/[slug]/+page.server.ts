import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import type { PageServerLoad } from './$types';

const contentType = ContentType.language;

export const load = (async ({ params }) => {
	return {
		contentType,
		content: await getContentBySlug(contentType, params.slug)
	};
}) satisfies PageServerLoad;
