import { listContent, parseModules } from '$lib/server/content';
import { ContentPublished, ContentType } from '$lib/types';


const contentType = ContentType.podcast;

export const load = (async () => {
	const modules = await import.meta.glob(['../../../content/podcast/*.md']);
	const contentItems = await parseModules(modules);
	return {
		contentType,
		...(await listContent({ contentItems, contentFilter: (c) => c.published === ContentPublished.draft }))
	};
});