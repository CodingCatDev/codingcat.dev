import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';

export const load = async () => {
	return {
		...await listContent<Author>({
			contentItems: await getContentTypeDirectory<Author>(ContentType.author)
		})
	};
};
