import { ContentType, ContentPublished } from '$lib/types';
import type { Content, Course, Podcast } from '$lib/types';

const LIMIT = 20;

// In Dev Mode read directly from content directory
const markdownFiles: {
	course: Course[];
	framework: Content[];
	language: Content[];
	page: Content[];
	podcast: Podcast[];
	post: Content[];
	tutorial: Content[];
} = {
	course: [],
	framework: [],
	language: [],
	page: [],
	podcast: [],
	post: [],
	tutorial: []
};

console.log('Building top metadata level');
const modules = import.meta.glob(['../../content/course/*/*.md', '../../content/*/*.md']);
for (const path in modules) {
	modules[path]().then((mod) => {
		const splitPath = path.replace('../../content/', '').split('/');
		const type = splitPath.at(0);
		const slug = splitPath.at(1);

		console.log(splitPath);

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
			published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : 'draft',
			start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900')
		};
		markdownFiles[type as keyof typeof markdownFiles].push(content);
	});
}

console.log('Add Lessons to courses');
const lessonModules = import.meta.glob('../../content/course/*/lesson/*.md');
for (const path in lessonModules) {
	lessonModules[path]().then((mod) => {
		const splitPath = path.replace('../../content/', '').split('/');
		const type = splitPath.at(0);
		const slug = splitPath.at(1);
		const lessonSlug = splitPath?.at(3)?.replace(/\.[^/.]+$/, '');

		console.log(splitPath);

		if (!type || !slug || !lessonSlug) {
			console.error('Lesson Param missing');
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
			type: ContentType.lesson,
			slug: lessonSlug,
			courseSlug: slug,
			html,
			weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
			published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : 'draft',
			start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900')
		};

		markdownFiles.course
			.filter((c) => c.slug === slug)
			.map((c) => {
				c?.lesson ? c.lesson.push(content) : (c['lesson'] = [content]);
			});
	});
}

/**
 * List all content from specified content type
 * allows for optionally sending after object
 * */
export const listContent = async ({
	contentType,
	after,
	limit,
	contentFilter = (c) => c.published === ContentPublished.published
}: {
	contentType: ContentType;
	after?: number;
	limit?: number;
	contentFilter?: (c: Content) => boolean;
}) => {
	const theLimit = limit || LIMIT;
	const theAfter = after || 0;

	console.log(`List for type: ${contentType}, limit of ${theLimit}`);

	const fullContent = markdownFiles[contentType as keyof typeof markdownFiles]
		.filter(contentFilter)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf());

	const content = fullContent.slice(0 + theAfter, theLimit + theAfter);
	const total = fullContent.length;
	return {
		total,
		next: theAfter + theLimit <= total ? theAfter + theLimit : null,
		content
	};
};

export const getContentBySlug = async (contentType: ContentType, slug: string) => {
	console.debug(`Searching for content type: ${contentType} slug: ${slug}`);

	const doc = markdownFiles[contentType as keyof typeof markdownFiles]
		.filter(
			(c) =>
				c.slug == slug &&
				new Date(c.start) <= new Date() &&
				c.published === ContentPublished.published
		)
		.sort((a, b) => new Date(b.start).valueOf() - new Date(a.start).valueOf())
		.slice(0, 1)
		.map((c: Course) => {
			if (c?.lesson) {
				c.lesson
					.filter(
						(d) => new Date(d.start) <= new Date() && d.published === ContentPublished.published
					)
					.sort((a, b) => b.weight || 99 - (a.weight || 1));
			}
			return c;
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
export const getLessonFromCourseSlug = async (courseSlug: string, slug: string) => {
	console.debug(`Searching for course: ${courseSlug}`);

	const course = markdownFiles.course
		.filter(
			(c) =>
				c.slug == courseSlug &&
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
						(l) => new Date(l.start) <= new Date() && l.published === ContentPublished.published
					)
					.sort((a, b) => b.weight || 99 - (a.weight || 1))
			};
		})
		.at(0);
	if (!course) {
		console.debug(`course not found`);
		return null;
	}
	console.debug(`Searching within ${course.slug} for lesson slug: ${slug}`);

	const doc = markdownFiles.course
		.filter((c) => c.slug === course.slug)
		?.at(0)
		?.lesson?.filter(
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
		// Reduce html shipped for links
		lesson: course?.lesson?.map((l) => {
			delete l.html;
			return l;
		}),
		courseSlug: course.slug
	};
};
