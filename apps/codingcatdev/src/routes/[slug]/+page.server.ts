import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const contentType = ContentType.tutorial;

export const load = (async ({ params }) => {
	const content = await getContentBySlug(ContentType.page, params.slug);
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
