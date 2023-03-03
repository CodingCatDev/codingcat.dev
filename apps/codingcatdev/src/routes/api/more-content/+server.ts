import { listContent } from '$lib/server/content';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { contentType, after } = await request.json();
	const content = await listContent({ contentType, after });
	return new Response(String(JSON.stringify(content)));
};
