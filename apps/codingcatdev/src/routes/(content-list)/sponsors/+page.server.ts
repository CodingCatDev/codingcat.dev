import { listContent, parseModules } from '$lib/server/content';
import { ContentType, type Sponsor } from '$lib/types';

const contentType = ContentType.sponsor;

export const load = async () => {
	const modules = import.meta.glob(['../../../content/sponsor/*.md']);
	const contentItems = await parseModules(modules);
	const content = (await listContent({ contentItems, limit: 500 })) as unknown as {
		total: number;
		next: number | null;
		content: Sponsor[];
	};
	return {
		contentType,
		...content
	};
};
