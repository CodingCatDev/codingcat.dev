import { error } from '@sveltejs/kit';
import { filterContent, getContentTypeDirectory, getContentTypePath, listContent, listContentByAuthor, listContentByGuest, listContentBySponsor } from '$lib/server/content';
import { ContentType, type Content, type Course, type Author, type Podcast, type Sponsor } from '$lib/types';

export const load = (async (params) => {
    try {
        const splitPath = params.url.pathname.split('/');
        const contentType = splitPath.at(1)
        const path = splitPath.at(2)

        if (!contentType || !path) throw error(404);
        const md = await getContentTypePath<Content & Podcast & Author & Sponsor>(contentType as ContentType, path);
        if (!md) throw error(404);

        const contentItems = await filterContent({ contentItems: [md] })
        const content = contentItems?.at(0);
        if (!content) throw error(404);

        // Content is good, fetch surrounding items
        const authors: Author[] = [];
        if (content?.authors) {
            for (const authorSlug of content.authors) {
                const author = await getContentTypePath<Author>(ContentType.author, authorSlug);
                if (author) authors.push(author)
            }
        }
        const guests: Author[] = [];
        if (content?.guests) {
            for (const guestSlug of content.guests) {
                const guest = await getContentTypePath<Author>(ContentType.guest, guestSlug);
                if (guest) guests.push(guest)
            }
        }

        const sponsors: Sponsor[] = [];
        if (content?.sponsors) {
            for (const sponsorSlug of content.sponsors) {
                const sponsor = await getContentTypePath<Sponsor>(ContentType.sponsor, sponsorSlug);
                if (sponsor) sponsors.push(sponsor)
            }
        }

        // Static last 3 content
        const post = (await listContent<Content>({
            contentItems: await getContentTypeDirectory<Content>(ContentType.post),
            limit: 3
        })).content

        const course = (await listContent<Course>({
            contentItems: await getContentTypeDirectory<Course>(ContentType.course),
            limit: 3
        })).content


        const podcast = (await listContent<Content>({
            contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
            limit: 3
        })).content

        const baseContent = {
            content, // Main Content
            authors, // Possibly Empty
            guests, // Possibly Empty
            sponsors, // Possibly Empty
            course, // Top 3
            podcast, // Top 3
            post, // Top 3
        }

        if (content.type === ContentType.author) {
            const allCourses = (await listContent<Course>({
                contentItems: await getContentTypeDirectory<Course>(ContentType.course),
                limit: 10000,
            })).content;

            const authorCourses = await listContentByAuthor<Course>({ authorSlug: content.slug, contentItems: allCourses })

            const allPosts = (await listContent<Content>({
                contentItems: await getContentTypeDirectory<Content>(ContentType.post),
                limit: 10000,
            })).content;

            const authorPosts = await listContentByAuthor<Course>({ authorSlug: content.slug, contentItems: allPosts })


            return {
                ...baseContent,

                // Author Specific
                authorCourses,
                authorPosts
            }
        }

        if (content.type === ContentType.guest) {
            const allPodcasts = (await listContent<Podcast>({
                contentItems: await getContentTypeDirectory<Podcast>(ContentType.podcast),
                limit: 10000,
            })).content;

            const guestPodcasts = await listContentByGuest({ slug: content.slug, podcastItems: allPodcasts })

            return {
                ...baseContent,

                // Guest Specific
                guestPodcasts
            }
        }

        if (content.type === ContentType.sponsor) {
            const allCourses = (await listContent<Course>({
                contentItems: await getContentTypeDirectory<Course>(ContentType.course),
                limit: 10000,
            })).content;

            const sponsorCourses = await listContentBySponsor<Course>({ sponsorSlug: content.slug, contentItems: allCourses })

            const allPosts = (await listContent<Content>({
                contentItems: await getContentTypeDirectory<Content>(ContentType.post),
                limit: 10000,
            })).content;

            const sponsorPosts = await listContentBySponsor<Course>({ sponsorSlug: content.slug, contentItems: allPosts })

            const allPodcasts = (await listContent<Podcast>({
                contentItems: await getContentTypeDirectory<Podcast>(ContentType.podcast),
                limit: 10000,
            })).content;

            const sponsorPodcasts = await listContentBySponsor({ sponsorSlug: content.slug, contentItems: allPodcasts })


            return {
                ...baseContent,

                // Sponsor Specific
                sponsorCourses,
                sponsorPosts,
                sponsorPodcasts
            }
        }

        return baseContent;
    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})