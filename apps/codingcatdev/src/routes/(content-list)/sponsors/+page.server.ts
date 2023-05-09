import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Sponsor } from '$lib/types';

const contentType = ContentType.sponsor;

export const load = async () => {
	return {
		contentType,
		...await listContent<Sponsor>({
			contentItems: await getContentTypeDirectory<Sponsor>(contentType)
		})
	};
};
