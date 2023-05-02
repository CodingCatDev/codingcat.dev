import { getContentBySlug, parseModules } from '$lib/server/content';
import { ContentType, type Author, type Podcast } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.podcast;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/podcast/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug }) as unknown as Podcast;
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const guestModules = import.meta.glob(['../../../../../content/guest/*.md']);
	const guestItems = await parseModules(guestModules);

	const guests: Author[] = [];
	if (content?.guests?.length) {
		for (const guestSlug of content.guests) {
			const guest = await getContentBySlug({ contentItems: guestItems, slug: guestSlug }) as unknown as Author;
			if (guest)
				guests.push(guest);
		}
	}

	return {
		contentType,
		content,
		guests
	};
});
