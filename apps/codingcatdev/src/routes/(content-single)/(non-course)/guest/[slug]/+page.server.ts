import { getContentBySlug, getPodcastByGuest, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.guest;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/guest/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug });
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const podcastModules = import.meta.glob(['../../../../../content/podcast/*.md']);
	const podcastItems = await parseModules(podcastModules);
	const guestPodcasts = await getPodcastByGuest({ podcastItems: podcastItems, slug: params.slug });

	return {
		contentType,
		content,
		guestPodcasts
	};
});