import { getContentTypeDirectory, listContent } from '$lib/server/content';
import type { Content } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { contentType, after } = await request.json();
	return new Response(String(JSON.stringify(
		await listContent<Content>({
			contentItems: await getContentTypeDirectory<Content>(contentType),
			after
		})
	)));
};
