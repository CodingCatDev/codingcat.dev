import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';

const contentType = ContentType.guest;

export const load = async () => {
	return {
		contentType,
		...await listContent<Author>({
			contentItems: await getContentTypeDirectory<Author>(contentType),
			limit: 100
		})
	};
};
