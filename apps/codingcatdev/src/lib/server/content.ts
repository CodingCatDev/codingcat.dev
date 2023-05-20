import { ContentType, ContentPublished, type Podcast } from '$lib/types';
import type { Content, Course } from '$lib/types';
import { env } from '$env/dynamic/private';
import { fileURLToPath } from 'url';
import { opendirSync } from "fs";
import type { SvelteComponentTyped, ComponentType } from 'svelte';

const LIMIT = 20;

// Force PREVIEW off by setting false in .env
// Will show for vercel previews unless forced to false
export const preview = env.PREVIEW === "false" ? false : env.VERCEL_ENV === "preview" || import.meta.env.DEV;
const prod = import.meta.env.PROD;
const prefix = prod ? '../entries/pages/' : '../../routes/';
const suffix = prod ? '_page.md.js' : '+page.md';

// While developing locally this allows you to see pages without setting up firebase.
export const allowLocal = env.PREVIEW === "false" ? false : import.meta.env.DEV;

export const getRootPath = (contentType: ContentType, courseDir?: string) => {

	// Normal Files
	let root = fileURLToPath(new URL(`${prefix}(content-single)/(non-course)/${contentType}`, import.meta.url));
	if (contentType === ContentType.course) {
		root = fileURLToPath(new URL(`${prefix}(content-single)/${contentType}`, import.meta.url));
	}
	if (contentType === ContentType.lesson && courseDir) {
		root = fileURLToPath(new URL(`${prefix}(content-single)/course/${courseDir}/${contentType}`, import.meta.url));
	}
	return root;
}

export const getContentTypeDirectory = async <T>(contentType: ContentType, courseDir?: string, render = false) => {
	const contentList: T[] = [];
	const dirs = opendirSync(getRootPath(contentType, courseDir));
	for await (const dir of dirs) {
		if (dir.isFile()) continue;
		const parsed = await parseContentType<T>(`${getRootPath(contentType, courseDir)}/${dir.name}/${suffix}`, render) as T;
		contentList.push(parsed);
	}
	return contentList;
}

export const getContentTypePath = async <T>(contentType: ContentType, path: string, courseDir?: string, render = false) => {
	const root = getRootPath(contentType, courseDir);
	return await parseContentType<T>(`${root}/${path}/${suffix}`, render) as T;
}

export const parseContentType = (async <T>(path: string, render = false) => {
	const { metadata, default: page } = await import(path);
	const frontmatter = metadata;

	// TODO: Add more checks?
	if (!frontmatter?.type) {
		console.error('Missing Frontmatter details', path);
		return;
	}

	let content = {
		...frontmatter,
		cover: frontmatter?.cover ? decodeURI(frontmatter?.cover) : '',
		type: frontmatter?.type as ContentType,
		weight: frontmatter?.weight ? frontmatter?.weight : 0,
		published: frontmatter?.published ? frontmatter?.published : ContentPublished.draft,
		start: frontmatter?.start ? new Date(frontmatter?.start) : new Date('Jan 01, 2000'),
		slug: path.split('/').at(-2)
	};

	if (render) {
		content = {
			...content,
			html: page?.render()?.html
		}
	}

	if (frontmatter.type === ContentType.course) {
		const lesson = (await listContent<Content>({
			contentItems: await getContentTypeDirectory<Content>(ContentType.lesson, frontmatter.slug),
			limit: 10000
		})).content
		return { ...content, lesson } as T;
	}
	return { ...content, } as T;
})


/**
 * List all content from specified content type
 * allows for optionally sending after object
 * */
export const listContent = async <T extends Content>({
	contentItems,
	after,
	limit,
}: {
	contentItems: T[]
	after?: number;
	limit?: number;
}) => {
	const theLimit = limit || LIMIT;
	const theAfter = after || 0;

	const fullContent = await filterContent<T>({ contentItems })

	const content = fullContent.slice(0 + theAfter, theLimit + theAfter);
	const total = fullContent.length;
	return {
		total,
		next: theAfter + theLimit <= total ? theAfter + theLimit : null,
		content
	};
};


export const filterContent = async <T extends Content>({
	contentItems,
}: {
	contentItems: T[];
}) => {
	const doc = contentItems
		?.filter(
			preview ?
				() => true
				:
				(c) => c.published === ContentPublished.published &&
					c?.start ? new Date(c.start) <= new Date() : false

		)
		?.sort((a, b) => a?.start && b?.start && new Date(b.start).valueOf() - new Date(a.start).valueOf())
		?.map((c: Course) => {
			return {
				...c,
				lesson: c?.lesson
					?.filter(
						preview ?
							() => true
							:
							(l) => l.published === ContentPublished.published && new Date(l.start) <= new Date()
					)
					.sort((a, b) => a.weight && b.weight ? a.weight - b.weight : -1)
			};
		}) as unknown as T[];

	return [...doc];
};


/**
 * List all content from specified content type by author
 * */
export const listContentByAuthor = async <T extends Content>({ authorSlug, contentItems }:
	{
		authorSlug: string,
		contentItems: T[];
	}) => {
	const content = contentItems.filter(
		preview ?
			(c) =>
				c.authors?.filter((g) => g == authorSlug)?.length
			:
			(c) =>
				c.authors?.filter((g) => g == authorSlug)?.length &&
					c.published === ContentPublished.published &&
					c?.start ? new Date(c.start) <= new Date() : false

	)
	return [
		...content,
	];
};

/**
 * List all content from specified content type by sponsor
 * */
export const listContentBySponsor = async <T extends Content>({ sponsorSlug, contentItems }:
	{
		sponsorSlug: string,
		contentItems: T[];
	}) => {
	const content = contentItems.filter(
		preview ?
			(c) =>
				c.sponsors?.filter((g) => g == sponsorSlug)?.length
			:
			(c) =>
				c.sponsors?.filter((g) => g == sponsorSlug)?.length &&
					c.published === ContentPublished.published &&
					c?.start ? new Date(c.start) <= new Date() : false
	)
	return [
		...content,
	];
};

/**
 * Get podcast by guest slug
 * */
export const listContentByGuest = async ({ slug, podcastItems }:
	{
		slug: string,
		podcastItems: Podcast[];
	}) => {
	const podcasts = podcastItems
		.filter(
			preview ?
				(c) =>
					c.guests?.filter((g) => g == slug)?.length
				:
				(c) =>
					c.guests?.filter((g) => g == slug)?.length &&
						c.published === ContentPublished.published &&
						c?.start ? new Date(c.start) <= new Date() : false
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())

	return [
		...podcasts,
	];
};
