import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const contentType = ContentType.post;

export const load = (async ({ params }) => {
	const content = await getContentBySlug(contentType, params.slug);
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
