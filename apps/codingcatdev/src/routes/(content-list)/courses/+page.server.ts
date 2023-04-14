import { listContent, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';

const contentType = ContentType.course;

export const load = (async () => {
	const modules = await import.meta.glob(['../../../content/course/*/*.md']);
	const contentItems = await parseModules(modules);
	return {
		contentType,
		...(await listContent({ contentItems }))
	};
});