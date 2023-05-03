import { getContentBySlug, listContentByAuthor, parseModules } from '$lib/server/content';
import { ContentType, type Author } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.author;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/author/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug }) as unknown as Author;
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	// Get all Authors Courses
	const courseModules = import.meta.glob(['../../../../../content/course/*/*.md']);
	const courseItems = await parseModules(courseModules);
	const authorCourses = await listContentByAuthor({ contentItems: courseItems, authorSlug: content.slug });

	// Get all Authors Tutorials
	const tutorialModules = import.meta.glob(['../../../../../content/tutorial/*.md']);
	const tutorialItems = await parseModules(tutorialModules);
	const authorTutorials = await listContentByAuthor({ contentItems: tutorialItems, authorSlug: content.slug });

	// Get all Authors Posts
	const postModules = import.meta.glob(['../../../../../content/post/*.md']);
	const postItems = await parseModules(postModules);
	const authorPosts = await listContentByAuthor({ contentItems: postItems, authorSlug: content.slug });

	return {
		contentType,
		content,
		authorCourses,
		authorTutorials,
		authorPosts
	};
});