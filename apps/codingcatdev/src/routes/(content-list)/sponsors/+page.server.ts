import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Sponsor } from '$lib/types';

export const load = async () => {
	return {
		...await listContent<Sponsor>({
			contentItems: await getContentTypeDirectory<Sponsor>(ContentType.sponsor)
		})
	};
};
