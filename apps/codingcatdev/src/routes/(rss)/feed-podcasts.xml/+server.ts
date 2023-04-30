import { listContent, parseModules } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { buildFeed } from '../rss';


const contentType = ContentType.post;

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	const modules = import.meta.glob(['../../../content/podcast/*.md']);
	const contentItems = await parseModules(modules);

	//xml rss feed response
	return new Response(
		buildFeed({
			contentType, contents: (await listContent({ contentItems, limit: 10000 })).content
		}).rss2(),
		{
			headers: {
				'content-type': 'application/rss+xml', 'cache-control': 'max-age=0, s-maxage=3600',
			},
		}
	)
}
