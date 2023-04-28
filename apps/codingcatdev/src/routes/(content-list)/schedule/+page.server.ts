import { listContent, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';


const contentType = ContentType.schedule;

export const load = (async () => {
	const modules = await import.meta.glob(['../../../content/schedule/*.md']);
	const contentItems = await parseModules(modules);
	return {
		contentType,
		...(await listContent({ contentItems }))
	};
});