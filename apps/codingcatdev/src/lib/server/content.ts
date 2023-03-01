import { ContentPublished } from './../types/index';
import { dev } from '$app/environment';

import { PUBLIC_FB_PROJECT_ID } from '$env/static/public';
import { PRIVATE_FB_PRIVATE_KEY, PRIVATE_FB_CLIENT_EMAIL } from '$env/static/private';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { compile } from 'mdsvex';

import 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-dart.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx';
import 'prism-svelte';
import type { Content, Course, Lesson, Podcast } from '$lib/types';
import { ContentType } from '$lib/types';

const LIMIT = 20;

const myFirstore = () => {
	if (!PUBLIC_FB_PROJECT_ID || !PRIVATE_FB_CLIENT_EMAIL || !PRIVATE_FB_PRIVATE_KEY) {
		throw new Error('Missing Firebase Admin Environment Varialbles');
	}
	let app = getApps().at(0);
	if (!app) {
		app = initializeApp({
			credential: cert({
				projectId: PUBLIC_FB_PROJECT_ID,
				clientEmail: PRIVATE_FB_CLIENT_EMAIL,
				privateKey: PRIVATE_FB_PRIVATE_KEY
			})
		});
	}

	return getFirestore(app);
};

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

if (dev) {
	const modules = import.meta.glob('../../content/**/**/*.md');
	for (const path in modules) {
		modules[path]().then((mod) => {
			const splitPath = path.replace('../../content/', '').split('/');
			const type = splitPath.at(0);
			const name = splitPath.at(1);
			const lesson = splitPath.at(2);
			const lessonName = splitPath.at(3);

			console.log(splitPath);

			if (!type || !name) {
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
				type: lesson === ContentType.lesson ? ContentType.lesson : (type as ContentType),
				html,
				weight: mdsvx?.metadata?.weight ? mdsvx?.metadata?.weight : 0,
				published: mdsvx?.metadata?.published ? mdsvx?.metadata?.published : 'draft',
				start: mdsvx?.metadata?.start ? new Date(mdsvx?.metadata?.start) : new Date('Jan 01, 1900')
			};
			if (lesson === ContentType.lesson) {
				console.log(
					`Rendering type:${type} name:${name} lesson:${lesson} lessonName: ${lessonName}`
				);
				const course = markdownFiles.course.find((c) => c.slug === name);
				if (course) {
					course.lesson?.push(content);
				} else {
					// If course doesn't exist create fake course with slug and lesson
					markdownFiles.course.push({
						id: name,
						lesson: [content],
						slug: name,
						start: new Date(),
						type: ContentType.course
					});
				}
			} else {
				// If we are adding course after lesson we need to update tmp
				// course to include all of the added lessons
				const courseIndex = markdownFiles.course.findIndex((c) => c.slug === name);
				if (courseIndex > 0) {
					console.log(`Updating course with type:${type} name:${name}`);
					const lesson = markdownFiles.course[courseIndex].lesson;
					markdownFiles.course[courseIndex] = {
						...content,
						lesson
					};
				} else {
					console.log(`Rendering type:${type} name:${name}`);
					markdownFiles[type as keyof typeof markdownFiles].push(content);
				}
			}
		});
	}
}

/**
 * List all content from specified content type
 * allows for optionally sending after object
 * */
export const listContent = async ({
	contentType,
	after,
	limit
}: {
	contentType: ContentType;
	after?: {
		start: Date;
		season?: number;
		episode?: number;
		title?: string;
	};
	limit?: number;
}) => {
	const theLimit = limit || LIMIT;
	console.log(`List for type: ${contentType}, limit of ${theLimit}`);

	if (dev) {
		return {
			next: {},
			content: markdownFiles[contentType as keyof typeof markdownFiles]
				.filter((c) => c.published === ContentPublished.published)
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				//@ts-ignore
				.sort((a, b) => new Date(b.start) - new Date(a.start))
				.slice(0, theLimit)
		};
	}

	// All query need a start date
	let query = myFirstore()
		.collection(contentType)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc');

	if (contentType === ContentType.podcast) {
		query = query
			.where('status', '==', 'released')
			.orderBy('season', 'desc')
			.orderBy('episode', 'desc')
			.limit(theLimit);
		if (after) {
			console.log(`after: ${JSON.stringify(after)}`);
			query = query.startAfter(new Date(after.start), after.season, after.episode);
		}
	} else {
		query = query.orderBy('title', 'asc').where('published', '==', 'published').limit(theLimit);
		if (after) {
			console.log(`after: ${JSON.stringify(after)}`);
			query = query.startAfter(new Date(after.start), after.title);
		}
	}
	const querySnapshot = await query.get();

	let next = {};
	if (!querySnapshot.empty) {
		const last = await querySnapshot.docs[querySnapshot.docs.length - 1].data();

		if (querySnapshot.docs.length < theLimit) {
			next = {};
		} else {
			contentType === ContentType.podcast
				? (next = {
						start: last.start.toDate(),
						season: last.season,
						episode: last.episode
				  })
				: (next = {
						start: last.start.toDate(),
						title: last.title
				  });
		}
	}
	return {
		next,
		content: await formatContentList(contentType, querySnapshot.docs)
	};
};

export const getContentBySlug = async (contentType: ContentType, slug: string) => {
	console.debug(`Searching for content type: ${contentType} slug: ${slug}`);

	if (dev) {
		const doc = markdownFiles[contentType as keyof typeof markdownFiles]
			.filter(
				(c) =>
					c.slug == slug &&
					new Date(c.start) <= new Date() &&
					c.published === ContentPublished.published
			)
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			.sort((a, b) => new Date(b.start) - new Date(a.start))
			.slice(0, 1)
			.map((c: Course) => {
				if (c?.lesson) {
					c.lesson
						.filter(
							(c) => new Date(c.start) <= new Date() && c.published === ContentPublished.published
						)
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						//@ts-ignore
						.sort((a, b) => new Date(b.start) - new Date(a.start))
						.sort((a, b) => b.weight || 99 - (a.weight || 1));
				}
				return c;
			})
			.at(0);
		if (!doc) {
			return null;
		}
		return doc;
	}

	let query = myFirstore()
		.collection(contentType)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	if (contentType === ContentType.podcast) {
		query = myFirstore()
			.collection(contentType)
			.where('slug', '==', slug)
			.where('start', '<=', Timestamp.fromDate(new Date()))
			.orderBy('start', 'desc')
			.where('status', '==', 'released')
			.limit(1);
	}
	const querySnapshot = await query.get();

	const doc = querySnapshot?.docs?.at(0);
	if (!doc) {
		return null;
	}

	let lesson: Content[] = [];
	if (contentType === ContentType.course) {
		const lessonQuery = doc.ref
			.collection('lesson')
			.where('start', '<=', Timestamp.fromDate(new Date()))
			.orderBy('start', 'desc')
			.orderBy('weight')
			.where('published', '==', 'published');
		const lessonSnapshot = await lessonQuery.get();
		lesson = await formatContentList<Lesson>(contentType, lessonSnapshot.docs);
	}
	const markdown = doc.data().content || '';
	const compiled = await compile(markdown);

	let content = '';
	if (compiled) {
		// https://github.com/pngwn/MDsveX/issues/392
		content = compiled.code
			.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	}

	return { ...(await formatContent(contentType, doc)), content, lesson };
};

/**
 * Get lesson by course and slug
 * */
export const getLessonFromCourseSlug = async (courseSlug: string, slug: string) => {
	console.debug(`Searching for course: ${courseSlug} lesson slug: ${slug}`);

	const courseQuery = myFirstore()
		.collection(ContentType.course)
		.where('slug', '==', courseSlug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	const courseSnapshot = await courseQuery.get();

	const course = courseSnapshot?.docs?.at(0);
	if (!course) {
		console.debug(`course not found`);
		return null;
	}

	const query = myFirstore()
		.collection(ContentType.course)
		.doc(course.id)
		.collection(ContentType.lesson)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	const querySnapshot = await query.get();

	const doc = querySnapshot?.docs?.at(0);
	if (!doc) {
		return null;
	}

	const lessonQuery = myFirstore()
		.collection(ContentType.course)
		.doc(course.id)
		.collection(ContentType.lesson)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.orderBy('weight')
		.where('published', '==', 'published');

	const lessonSnapshot = await lessonQuery.get();
	const lesson = formatLessonLinksList(ContentType.lesson, lessonSnapshot.docs);

	return {
		...(await formatContent<Lesson>(ContentType.lesson, doc)),
		lesson,
		courseSlug: course.data().slug
	};
};

const formatContentList = async <T extends Content>(
	contentType: ContentType,
	docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
): Promise<T[]> => {
	return (await Promise.all(docs.map((doc) => formatContent(contentType, doc)))) as T[];
};

const formatContent = async <T extends Content>(
	contentType: ContentType,
	doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
): Promise<T> => {
	const markdown = doc.data().content || '';
	const compiled = await compile(markdown);
	let html = '';
	if (compiled) {
		// https://github.com/pngwn/MDsveX/issues/392
		html = compiled.code
			.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	}
	return {
		id: doc.id,
		...doc.data(),
		html,
		start: doc.data().start ? doc.data().start.toDate() : doc.data().start,
		type: contentType
	} as T;
};

/**
 * This is only the data necessary for the list links, no content.
 */
const formatLessonLinksList = (
	contentType: ContentType,
	docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
): Lesson[] => {
	return docs.map((doc) => {
		const lesson = doc.data() as Lesson;
		return {
			id: lesson.id,
			slug: lesson.slug,
			section: lesson.section,
			title: lesson.title,
			type: lesson.type,
			weight: lesson.weight
		} as Lesson;
	});
};
