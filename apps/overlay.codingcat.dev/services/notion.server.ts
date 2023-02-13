import { AccessMode } from './../models/access.model';
import { Author } from '@/models/user.model';
import { Client } from '@notionhq/client';
import { config } from '@/config/notion';
import { Post, PostType } from '@/models/post.model';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { config as notionConfig } from '@/config/notion';
import { Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';
import { getCloudinaryPublicId } from '@/utils/cloudinary/cloudinary';
// Initializing a client
const notionClient = new Client({
	auth: config.token
});

const skipNotion = process?.env?.NOTION_SKIP;

interface NotionPosts extends Omit<QueryDatabaseResponse, 'results'> {
	results: Post[];
}

export const getNotionDbByType = (_type: string) => {
	switch (_type) {
		case PostType.post:
			return notionConfig.postsDb;
		case PostType.tutorial:
			return notionConfig.tutorialsDb;
		case PostType.course:
			return notionConfig.coursesDb;
		case PostType.podcast:
			return notionConfig.purrfectStreamsDb;
		case PostType.lesson:
			return notionConfig.lessonsDb;
		case PostType.page:
			return notionConfig.pagesDb;
		case 'framework':
			return notionConfig.frameworksDb;
		case 'language':
			return notionConfig.languagesDb;
		default:
			return notionConfig.authorsDb;
	}
};

// CodingCat.dev

const formatPost = async (q: any, _type: string, preview?: boolean, list?: boolean) => {
	//Flat authors
	const authors = [];
	let post = q;

	if (q?.properties?.author_title?.rollup?.array) {
		for (const [i, a] of q?.properties?.author_title?.rollup?.array?.entries()) {
			const cover = q?.properties?.author_cover?.rollup?.array?.at(i)?.url;

			let photoURL = null;
			if (cover) {
				photoURL = {
					public_id: cover.split('upload/')?.at(1) ? cover.split('upload/').at(1) : cover
				};
			}
			const slug = q?.properties?.author_slug?.rollup?.array?.at(i)?.url;

			const author = {
				displayName: `${a?.title?.map((t: any) => t.plain_text).join('')}`,
				photoURL,
				slug
			};
			authors.push(author);
		}
	}
	let coverPublicId = getCloudinaryPublicId(q?.cover?.external?.url);
	post = {
		...post,
		_id: q?.id ? q.id : null,
		title:
			_type == PostType.podcast
				? `${q?.properties?.Name?.title?.map((t: any) => t.plain_text).join('')}`
				: `${q?.properties?.title?.title?.map((t: any) => t.plain_text).join('')}`,
		coverPhoto: {
			secure_url: coverPublicId ? `https://media.codingcat.dev/image/upload${coverPublicId}` : null,
			public_id: coverPublicId ? `${coverPublicId}` : null
		},
		coverVideo: q?.properties?.youtube?.url ? { url: q.properties.youtube.url } : null,
		_type,
		slug: q?.properties?.slug?.url ? q?.properties?.slug.url : null,
		excerpt: q?.properties?.excerpt?.rich_text?.map((t: any) => t.plain_text).join(''),
		_createdAt: q?.properties?.start?.date?.start || q?.created_time,
		_updatedAt: q?.last_edited_time,
		recordingDate: q?.properties?.['Recording Date']?.date?.start
			? new Date(q?.properties?.['Recording Date']?.date?.start).toDateString()
			: '',
		authors,
		access_mode: q?.properties?.access_mode?.select?.name
			? q?.properties?.access_mode?.select?.name
			: AccessMode.closed
	};

	if (_type == 'framework' || _type == 'language') {
		post = {
			...post,
			courses_count: q?.properties?.courses_count?.rollup?.number || 0,
			tutorials_count: q?.properties?.tutorials_count?.rollup?.number || 0,
			podcasts_count: q?.properties?.podcasts_count?.rollup?.number || 0,
			posts_count: q?.properties?.posts_count?.rollup?.number || 0
		};
	}

	return post;
};

const formatPosts = async (
	raw: QueryDatabaseResponse,
	_type: string,
	preview?: boolean,
	list?: boolean
) => {
	const results = await Promise.all(
		raw.results.map((q: any) => formatPost(q, _type, preview, list))
	);

	let post = {
		...raw,
		results
	} as unknown as NotionPosts;
	return post;
};

// Purrfect.dev

export const queryPurrfectStreamByScheduled = async (
	page_size?: number,
	start_cursor?: string | null
) => {
	if (skipNotion) {
		return {
			has_more: false,
			results: []
		} as unknown as NotionPosts;
	}
	let raw = await notionClient.databases.query({
		database_id: config.purrfectStreamsDb,
		start_cursor: start_cursor ? start_cursor : undefined,
		page_size,
		filter: {
			and: [
				{
					property: 'Status',
					select: {
						equals: 'Scheduled'
					}
				}
			]
		},
		sorts: [
			{
				property: 'Recording Date',
				direction: 'descending'
			}
		]
	});

	return await formatPosts(raw, 'podcast');
};

export const queryPurrfectStreamBySlug = async (_type: string, slug: string, preview?: boolean) => {
	if (skipNotion) {
		return {
			has_more: false,
			results: []
		} as unknown as NotionPosts;
	}
	let filter: any;
	filter = {
		and: [
			{
				property: 'slug',
				url: {
					contains: slug
				}
			}
		]
	};

	if (!preview) {
		filter = {
			...filter,
			and: [
				...filter.and,
				...[
					{
						property: 'Status',
						select: {
							equals: 'Released'
						}
					},
					{
						property: 'Episode',
						number: {
							is_not_empty: true
						}
					},
					{
						property: 'start',
						date: {
							on_or_before: new Date().toISOString()
						}
					}
				]
			]
		};
	}

	let raw = await notionClient.databases.query({
		database_id: config.purrfectStreamsDb,
		filter,
		sorts: [
			{
				property: 'Season',
				direction: 'descending'
			},
			{
				property: 'Episode',
				direction: 'descending'
			}
		]
	});
	return await formatPosts(raw, 'podcast');
};

export const queryPurrfectPicksByStreamId = async (streamId: string) => {
	if (skipNotion) {
		return {
			has_more: false,
			results: []
		} as unknown as QueryDatabaseResponse;
	}
	let raw = await notionClient.databases.query({
		database_id: config.purrfectPicksDb,
		filter: {
			property: 'streams',
			relation: {
				contains: streamId
			}
		},
		sorts: [
			{
				property: 'Guest',
				direction: 'ascending'
			},
			{
				property: 'Us',
				direction: 'descending'
			}
		]
	});
	return raw;
};
export const queryPurrfectGuestsByStreamId = async (streamId: string) => {
	if (skipNotion) {
		return {
			has_more: false,
			results: []
		} as unknown as QueryDatabaseResponse;
	}
	let raw = await notionClient.databases.query({
		database_id: config.purrfectGuestDb,
		filter: {
			property: 'streams',
			relation: {
				contains: streamId
			}
		}
	});
	return raw;
};
