import { error } from '@sveltejs/kit';
import { filterContent, getContentTypePath } from '$lib/server/content';
import { ContentType, type Course, type Author, type Sponsor } from '$lib/types';

export const prerender = false;

export const load = (async (params) => {
    try {
        const splitPath = params.url.pathname.split('/');
        const courseSlug = splitPath.at(2);
        const lessonSlug = splitPath.at(4);

        if (!courseSlug) throw error(404);
        const md = await getContentTypePath<Course>(ContentType.course, courseSlug);

        if (!md) throw error(404);
        const contentItems = await filterContent({ contentItems: [md] })
        const course = contentItems?.at(0);
        if (!course) throw error(404);

        // Content is good, fetch surrounding items
        const authors: Author[] = [];
        if (course?.authors) {
            for (const authorSlug of course.authors) {
                const author = await getContentTypePath<Author>(ContentType.author, authorSlug);
                if (author) authors.push(author)
            }
        }

        const sponsors: Sponsor[] = [];
        if (course?.sponsors) {
            for (const sponsorSlug of course.sponsors) {
                const sponsor = await getContentTypePath<Sponsor>(ContentType.sponsor, sponsorSlug);
                if (sponsor) sponsors.push(sponsor)
            }
        }

        return {
            content: course.lesson?.find(l => l.slug === lessonSlug),
            course,
            authors
        }
    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})