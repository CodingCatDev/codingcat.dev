import { listContent, parseModules } from '$lib/server/content';

export const load = (async () => {

    const courseModules = import.meta.glob(['../../../content/course/*/*.md']);
    const tutorialModules = import.meta.glob(['../../../content/tutorial/*.md']);
    const podcastModules = import.meta.glob(['../../../content/podcast/*.md']);
    const postModules = import.meta.glob(['../../../content/post/*.md']);

    const courseItems = await parseModules(courseModules);
    const tutorialItems = await parseModules(tutorialModules);
    const podcastItems = await parseModules(podcastModules);
    const postItems = await parseModules(postModules);

    return {
        course: await (await listContent({ contentItems: courseItems, limit: 3 })).content,
        tutorial: await (await listContent({ contentItems: tutorialItems, limit: 3 })).content,
        podcast: await (await listContent({ contentItems: podcastItems, limit: 3 })).content,
        post: await (await listContent({ contentItems: postItems, limit: 3 })).content
    };
});