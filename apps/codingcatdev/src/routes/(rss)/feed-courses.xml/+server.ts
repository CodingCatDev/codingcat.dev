import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Content, type Author } from '$lib/types';
import { buildFeed } from '../rss';


const contentType = ContentType.course;

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	const contentItems = (await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(contentType, undefined, true),
		limit: 10000
	})).content

	const authorItems = (await listContent<Author>({
		contentItems: await getContentTypeDirectory<Author>(ContentType.author),
		limit: 10000
	})).content

	//xml rss feed response
	return new Response(
		buildFeed({
			contentType, contents: contentItems, authorItems
		}).rss2(),
		{
			headers: {
				'content-type': 'application/rss+xml', 'cache-control': 'max-age=0, s-maxage=3600',
			},
		}
	)
}
