import { listContent, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';


const contentType = ContentType.tutorial;

export const load = (async () => {
	const modules = import.meta.glob(['../../../content/tutorial/*.md']);
	const contentItems = await parseModules(modules);
	return {
		contentType,
		...(await listContent({ contentItems }))
	};
});
