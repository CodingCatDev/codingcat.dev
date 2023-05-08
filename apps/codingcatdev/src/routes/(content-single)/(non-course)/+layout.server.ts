import { compile } from 'mdsvex';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { error } from '@sveltejs/kit';
import { ContentType, type Author, type Content, type Podcast, type Sponsor } from '$lib/types';
import { getContentBySlug, listContent, parseModules } from '$lib/server/content';


export const prerender = true;

export const load = (async (params) => {
    try {
        const file = fileURLToPath(new URL(`./${params.url.pathname}/+page.md`, import.meta.url));
        const md = readFileSync(file, 'utf8');
        const transformed = await compile(md);
        const content = transformed?.data?.fm as Content & Podcast | undefined;
        const start = content?.start && new Date(content.start);
        console.log(start)
        if (start && start < new Date()) {

            const courseModules = import.meta.glob(['../../../content/course/*/*.md']);
            const tutorialModules = import.meta.glob(['../../../content/tutorial/*.md']);
            const podcastModules = import.meta.glob(['../../../content/podcast/*.md']);
            const postModules = import.meta.glob(['../../../content/post/*.md']);

            const courseItems = await parseModules(courseModules);
            const tutorialItems = await parseModules(tutorialModules);
            const podcastItems = await parseModules(podcastModules);
            const postItems = await parseModules(postModules);

            const guestModules = import.meta.glob(['../../../../../content/guest/*.md']);
            const guestItems = await parseModules(guestModules);

            const guests: Author[] = [];
            if (content?.guests?.length) {
                for (const guestSlug of content.guests) {
                    const guest = await getContentBySlug({ contentItems: guestItems, slug: guestSlug }) as unknown as Author;
                    if (guest)
                        guests.push(guest);
                }
            }

            const authorModules = import.meta.glob(['../../../../../content/author/*.md']);
            const authorItems = await parseModules(authorModules);

            const authors: Author[] = [];

            for (const authorSlug of ['alex-patterson', 'brittney-postma']) {
                const author = await getContentBySlug({ contentItems: authorItems, slug: authorSlug }) as unknown as Author;
                if (author)
                    authors.push(author);
            }

            const sponsorModules = import.meta.glob(['../../../../../content/sponsor/*.md']);
            const sponsorItems = await parseModules(sponsorModules);

            const sponsors: Sponsor[] = [];
            if (content?.sponsors?.length) {
                for (const sponsorSlug of content.sponsors) {
                    const sponsor = await getContentBySlug({ contentItems: sponsorItems, slug: sponsorSlug }) as unknown as Sponsor;
                    if (sponsor)
                        sponsors.push(sponsor);
                }
            }

            return {
                content,
                contentType: ContentType.post,
                course: await (await listContent({ contentItems: courseItems, limit: 3 })).content,
                tutorial: await (await listContent({ contentItems: tutorialItems, limit: 3 })).content,
                podcast: await (await listContent({ contentItems: podcastItems, limit: 3 })).content,
                post: await (await listContent({ contentItems: postItems, limit: 3 })).content
            };

        } else {
            throw error(404)
        }
    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})