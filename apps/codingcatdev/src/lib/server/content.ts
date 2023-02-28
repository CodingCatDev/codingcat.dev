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
import type { Content, Lesson } from '$lib/types';
import { ContentType } from '$lib/types';

const LIMIT = 20;

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

const firestore = getFirestore(app);

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

	// All query need a start date
	let query = firestore
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

	let query = firestore
		.collection(contentType)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	if (contentType === ContentType.podcast) {
		query = firestore
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

	const courseQuery = firestore
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

	const query = firestore
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

	const lessonQuery = firestore
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
	let content = '';
	if (compiled) {
		// https://github.com/pngwn/MDsveX/issues/392
		content = compiled.code
			.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	}
	return {
		id: doc.id,
		...doc.data(),
		content,
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
