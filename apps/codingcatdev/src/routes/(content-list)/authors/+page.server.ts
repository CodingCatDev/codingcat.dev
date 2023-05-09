import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';

const contentType = ContentType.podcast;

export const load = async () => {
	return {
		contentType,
		...await listContent<Author>({
			contentItems: await getContentTypeDirectory<Author>(contentType)
		})
	};
};
