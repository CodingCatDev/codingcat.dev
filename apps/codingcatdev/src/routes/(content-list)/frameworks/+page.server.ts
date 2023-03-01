import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';
import type { PageServerLoad } from './$types';

const contentType = ContentType.course;

export const load = (async () => {
	return {
		contentType,
		...(await listContent({ contentType }))
	};
}) satisfies PageServerLoad;
