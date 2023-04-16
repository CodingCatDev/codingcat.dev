import { listContent, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { contentType, after } = await request.json();
	let modules;
	switch (contentType) {
		case ContentType.course:
			modules = import.meta.glob(['../../../content/course/*.md']);
			break;
		case ContentType.framework:
			modules = import.meta.glob(['../../../content/framework/*.md']);
			break;
		case ContentType.language:
			modules = import.meta.glob(['../../../content/language/*.md']);
			break;
		case ContentType.podcast:
			modules = import.meta.glob(['../../../content/podcast/*.md']);
			break;
		case ContentType.post:
			modules = import.meta.glob(['../../../content/post/*.md']);
			break;
		case ContentType.tutorial:
			modules = import.meta.glob(['../../../content/tutorial/*.md']);
			break;
	}

	if (!modules) {
		return new Response(String(JSON.stringify({
			contentType,
			contentItems: []
		})));
	}

	const contentItems = await parseModules(modules);
	return new Response(String(JSON.stringify({
		contentType,
		...(await listContent({ contentItems, after }))
	})));
};
