import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';


const contentType = ContentType.post;

export const load = (async () => {
	return {
		contentType,
		...(await listContent({ contentType }))
	};
});
