// import { error } from '@sveltejs/kit';

import { listContent } from '$lib/server/content';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { contentType, after } = await request.json();
	const content = await listContent({ contentType, after });
	return new Response(String(JSON.stringify(content)));
}
