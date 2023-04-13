import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.framework;

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
});
