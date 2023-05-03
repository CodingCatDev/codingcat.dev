import { parseModules, preview } from "$lib/server/content";
import { ContentPublished, type Content, type Author } from "$lib/types";

export const content = async () => {
	const course = import.meta.glob(['../../../content/course/*/*.md']);
	const podcast = import.meta.glob(['../../../content/podcast/*.md']);
	const post = import.meta.glob(['../../../content/post/*.md']);
	const tutorial = import.meta.glob(['../../../content/tutorial/*.md']);
	const author = import.meta.glob(['../../../content/author/*.md']);
	const guest = import.meta.glob(['../../../content/guest/*.md']);

	const p = await Promise.all([
		parseModules(course),
		parseModules(podcast),
		parseModules(post),
		parseModules(tutorial),
		parseModules(author),
		parseModules(guest)
	])

	const combinedContent = [...p[0], ...p[1], ...p[2], ...p[3], ...p[4], ...p[5]];

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
