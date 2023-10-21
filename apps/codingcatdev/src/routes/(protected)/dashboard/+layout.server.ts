import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { getShowDrafts } from '$lib/server/firebase';
import { ContentType, type Content, type Course, ContentPublished } from '$lib/types';

const contentType = ContentType.course;

export const load = async ({ parent }) => {
	const user = (await parent()).user;
	const course = (
		await listContent<Content>({
			contentItems: await getContentTypeDirectory<Content>(contentType),
			limit: 3
		})
	).content;

	const showDrafts = await getShowDrafts(user?.uid);

	const comingSoon = showDrafts
		? (
				await listContent<Content>({
					contentItems: await getContentTypeDirectory<Content>(contentType),
					limit: 100,
					userPreview: true
				})
		  ).content.filter((c) => c.published === ContentPublished.draft)
		: [];

	return {
		contentType,
		content: course, // Top 3 courses
		comingSoon,
		showDrafts
	};
};
