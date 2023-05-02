import { getContentBySlug, parseModules } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.post;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/post/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug });
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const authorModules = import.meta.glob(['../../../../../content/author/*.md']);
	const guestItems = await parseModules(authorModules);

	const authors: Author[] = [];
	if (content?.authors?.length) {
		for (const authorSlug of content.authors) {
			const author = await getContentBySlug({ contentItems: guestItems, slug: authorSlug }) as unknown as Author;
			if (author) {
				authors.push(author);
			}
		}
	}
	return {
		contentType,
		content,
		authors
	};
});
