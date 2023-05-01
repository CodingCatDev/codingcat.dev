import { ContentType, ContentPublished, type Lesson, type Podcast } from '$lib/types';
import type { Content, Course } from '$lib/types';
import { env } from '$env/dynamic/private';

const LIMIT = 20;

// Force PREVIEW off by setting false in .env
// Will show for vercel previews unless forced to false
export const preview = env.PREVIEW === "false" ? false : env.VERCEL_ENV === "preview" || import.meta.env.DEV;

// While developing locally this allows you to see pages without setting up firebase.
export const allowLocal = env.PREVIEW === "false" ? false : import.meta.env.DEV;

export const parseModules = async (modules: Record<string, () => Promise<unknown>>) => {
	const contentList: Content[] = [];
	for (const path in modules) {
		await modules[path]().then((mod) => {
			const splitPath = path.split('/');
			const courseType = splitPath.at(-3);
			const normalType = splitPath.at(-2);
			const slug = splitPath.at(-1);
			const type = courseType === 'content' ? normalType : courseType;

			if (courseType === 'content') {
				console.log(`Precompiling: ${type}/${slug}`);
			} else {
				console.log(`Precompiling: ${type}/${normalType}`);
			}

			if (!type || !slug) {
				console.error('Missing name or type');
				return;
			}

			const mdsvx = mod as {
				default: {
					render: () => { html: string };
				};
				metadata: Content;
			};
			const { html } = mdsvx.default.render();
			/**
			 * This needs to match the function that adds the
			 * same data to Firestore
			 */
			const content = {
				...mdsvx?.metadata,
				cover: mdsvx?.metadata?.cover ? decodeURI(mdsvx?.metadata?.cover) : '',
				type: type as ContentType,
				html,
				weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
				published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : ContentPublished.draft,
				start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900'),
			};
			contentList.push(content);
		});
	}
	return contentList;
}

export const parseLessonModules = async ({ lessonModules, courses }: { lessonModules: Record<string, () => Promise<unknown>>, courses: Course[] }) => {
	for (const path in lessonModules) {
		await lessonModules[path]().then((mod) => {
			const splitPath = path.split('/');
			const type = splitPath.at(-4);
			const slug = splitPath.at(-3);
			const lessonSlug = splitPath?.at(-1)?.replace(/\.[^/.]+$/, '');

			console.log(`Precompiling Lesson: ${type}/${slug}/lesson/${lessonSlug}`);

			if (!type || !slug || !lessonSlug) {
				console.error('Lesson Param missing');
				return;
			}

			const mdsvx = mod as {
				default: {
					render: () => { html: string };
				};
				metadata: Lesson;
			};
			const { html } = mdsvx.default.render();
			/**
			 * This needs to match the function that adds the
			 * same data to Firestore
			 */
			const content = {
				...mdsvx?.metadata,
				cover: mdsvx?.metadata?.cover ? decodeURI(mdsvx?.metadata?.cover) : '',
				type: ContentType.lesson,
				courseSlug: slug,
				html,
				weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
				published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : ContentPublished.draft,
				start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900'),
				locked: mdsvx?.metadata?.locked || false,
			};

			courses
				.filter((c) => c.slug === slug)
				.map((c) => {
					c?.lesson ? c.lesson.push(content) : (c['lesson'] = [content]);
				});
		});
	}
	return courses;
}


/**
 * List all content from specified content type
 * allows for optionally sending after object
 * */
export const listContent = async ({
	contentItems,
	after,
	limit,
	contentFilter = (c) => c.published === ContentPublished.published
}: {
	contentItems: Content[];
	after?: number;
	limit?: number;
	contentFilter?: (c: Content) => boolean;
}) => {
	const theLimit = limit || LIMIT;
	const theAfter = after || 0;

	console.log(`List limit of ${theLimit}`);

	const fullContent = contentItems
		.filter(preview ? () => true : contentFilter)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf());

	const content = fullContent.slice(0 + theAfter, theLimit + theAfter);
	const total = fullContent.length;
	return {
		total,
		next: theAfter + theLimit <= total ? theAfter + theLimit : null,
		content
	};
};

export const getContentBySlug = async ({
	contentItems,
	slug
}: {
	contentItems: Content[];
	slug: string
}) => {
	console.debug(`Searching for slug: ${slug} in ${contentItems.length} items`);

	const doc = contentItems
		.filter(
			preview ?
				(c) =>
					c.slug == slug
				:
				(c) =>
					c.slug == slug &&
					new Date(c.start) <= new Date() &&
					c.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.map((c: Course) => {
			return {
				...c,
				lesson: c?.lesson
					?.filter(
						preview ?
							() => true
							:
							(l) => new Date(l.start) <= new Date() && l.published === ContentPublished.published
					)
					.sort((a, b) => a.weight && b.weight ? a.weight - b.weight : -1)
			};
		})
		.at(0);
	if (!doc) {
		return null;
	}
	return {
		...doc
	};
};

/**
 * Get lesson by course and slug
 * */
export const getLessonFromCourseSlug = async ({ courseSlug, slug, courseItems }:
	{
		courseSlug: string, slug: string,
		courseItems: Content[];
	}) => {
	console.debug(`Searching for course: ${courseSlug}`);

	const course = await getContentBySlug({ contentItems: courseItems, slug: courseSlug });
	if (!course) {
		console.debug(`course not found`);
		return null;
	}
	console.debug(`Searching within ${course.slug} for lesson slug: ${slug}`);

	// TODO: ADD Pro check?
	const doc = course
		?.lesson?.filter(
			preview ?
				(l) =>
					l.slug == slug
				:
				(l) =>
					l.slug == slug &&
					new Date(l.start) <= new Date() &&
					l.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.at(0);
	if (!doc) {
		console.debug(`lesson not found`);
		return null;
	}

	return {
		...doc,
		courseSlug: course.slug
	};
};


/**
 * Get podcast by guest slug
 * */
export const getPodcastByGuest = async ({ slug, podcastItems }:
	{
		slug: string,
		podcastItems: Podcast[];
	}) => {
	console.debug(`Searching for podcasts from guest: ${slug}`);
	const podcasts = podcastItems
		.filter(
			preview ?
				(c) =>
					c.guests?.filter((g) => g == slug)?.length
				:
				(c) =>
					c.guests?.filter((g) => g == slug)?.length &&
					new Date(c.start) <= new Date() &&
					c.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())

	return [
		...podcasts,
	];
};
