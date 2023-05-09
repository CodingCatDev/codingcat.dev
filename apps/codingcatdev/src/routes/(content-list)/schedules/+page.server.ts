import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Content } from '$lib/types';

export const load = async () => {
	return {
		...await listContent<Content>({
			contentItems: await getContentTypeDirectory<Content>(ContentType.schedule)
		})
	};
};
