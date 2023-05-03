import { getContentBySlug, listContentBySponsor, parseModules } from '$lib/server/content';
import { ContentType, type Sponsor } from '$lib/types';
import { error } from '@sveltejs/kit';


const contentType = ContentType.sponsor;

export const load = (async ({ params }) => {
	const modules = import.meta.glob(['../../../../../content/sponsor/*.md']);
	const contentItems = await parseModules(modules);
	const content = await getContentBySlug({ contentItems, slug: params.slug }) as unknown as Sponsor;
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}

	const courseModules = import.meta.glob(['../../../../../content/course/*/*.md']);
	const courseItems = await parseModules(courseModules);
	const sponsorCourses = await listContentBySponsor({ contentItems: courseItems, sponsorSlug: content.slug });

	const tutorialModules = import.meta.glob(['../../../../../content/tutorial/*.md']);
	const tutorialItems = await parseModules(tutorialModules);
	const sponsorTutorials = await listContentBySponsor({ contentItems: tutorialItems, sponsorSlug: content.slug });

	const postModules = import.meta.glob(['../../../../../content/post/*.md']);
	const postItems = await parseModules(postModules);
	const sponsorPosts = await listContentBySponsor({ contentItems: postItems, sponsorSlug: content.slug });

	const podcastModules = import.meta.glob(['../../../../../content/podcast/*.md']);
	const podcastItems = await parseModules(podcastModules);
	const sponsorPodcasts = await listContentBySponsor({ contentItems: podcastItems, sponsorSlug: content.slug });

	return {
		contentType,
		content,
		sponsorCourses,
		sponsorTutorials,
		sponsorPosts,
		sponsorPodcasts
	};
});