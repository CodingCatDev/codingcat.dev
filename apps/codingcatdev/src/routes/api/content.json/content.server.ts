import { getContentTypeDirectory, listContent, preview } from "$lib/server/content";
import { ContentPublished, type Content, type Author, ContentType, type Course, type Sponsor } from "$lib/types";

export const content = async () => {

	const author = (await listContent<Author>({
		contentItems: await getContentTypeDirectory<Author>(ContentType.author),
		limit: 10000
	})).content

	const post = (await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(ContentType.post),
		limit: 10000
	})).content

	const course = (await listContent<Course>({
		contentItems: await getContentTypeDirectory<Course>(ContentType.course),
		limit: 10000
	})).content

	const guest = (await listContent<Author>({
		contentItems: await getContentTypeDirectory<Author>(ContentType.guest),
		limit: 10000
	})).content

	const podcast = (await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
		limit: 10000
	})).content

	const tutorial = (await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(ContentType.tutorial),
		limit: 10000
	})).content

	const sponsor = (await listContent<Sponsor>({
		contentItems: await getContentTypeDirectory<Sponsor>(ContentType.sponsor),
		limit: 10000
	})).content

	const combinedContent = [...author, ...post, ...course, ...guest, ...podcast, ...tutorial, ...sponsor];

	const fullContent = combinedContent
		.filter(preview ? () => true : (c) => c.published === ContentPublished.published)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf());

	const blocks = [];

	//TODO: use full text instead of excerpt
	for (const c of fullContent as Content[] & Author[]) {
		blocks.push({
			breadcrumbs: [`${c.type}/${c?.title ? c.title : c?.name}`], href: `/${c.type}/${c.slug}`, content: c.excerpt
		})
	}
	return blocks;
}
