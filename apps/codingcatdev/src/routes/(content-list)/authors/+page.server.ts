import { listContent, parseModules } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';

const contentType = ContentType.author;

export const load = async () => {
	const modules = import.meta.glob(['../../../content/author/*.md']);
	const contentItems = await parseModules(modules);
	const content = (await listContent({ contentItems, limit: 500 })) as unknown as {
		total: number;
		next: number | null;
		content: Author[];
	};
	return {
		contentType,
		...content
	};
};
