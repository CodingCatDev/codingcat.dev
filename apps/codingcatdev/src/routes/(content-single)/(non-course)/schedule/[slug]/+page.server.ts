import { getContentBySlug, parseModules } from '$lib/server/content';
import { ContentType, type Author, type Podcast, type Sponsor } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.schedule;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/schedule/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug }) as unknown as Podcast;;
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

	const authorModules = import.meta.glob(['../../../../../content/author/*.md']);
	const authorItems = await parseModules(authorModules);

	const authors: Author[] = [];

	for (const authorSlug of ['alex-patterson', 'brittney-postma']) {
		const author = await getContentBySlug({ contentItems: authorItems, slug: authorSlug }) as unknown as Author;
		if (author)
			authors.push(author);
	}

	const sponsorModules = import.meta.glob(['../../../../../content/sponsor/*.md']);
	const sponsorItems = await parseModules(sponsorModules);

	const sponsors: Sponsor[] = [];
	if (content?.sponsors?.length) {
		for (const sponsorSlug of content.sponsors) {
			const sponsor = await getContentBySlug({ contentItems: sponsorItems, slug: sponsorSlug }) as unknown as Sponsor;
			if (sponsor)
				sponsors.push(sponsor);
		}
	}

	return {
		contentType,
		content,
		guests,
		authors,
		sponsors
	};
});
