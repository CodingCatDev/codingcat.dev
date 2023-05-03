import { getContentBySlug, parseLessonModules, parseModules } from '$lib/server/content';
import { ContentType, type Author, type Sponsor } from '$lib/types';
import { error } from '@sveltejs/kit';

const contentType = ContentType.course;

export const load = (async ({ params }) => {
    const courseModules = import.meta.glob(['../../../../content/course/*/*.md']);
    const lessonModules = import.meta.glob('../../../../content/course/*/lesson/*.md');

    const courses = await parseModules(courseModules);
    const courseItems = await parseLessonModules({ lessonModules, courses });
    const course = await getContentBySlug({ contentItems: courseItems, slug: params.slug });
    if (!course) {
        throw error(404, {
            message: 'Not found'
        });
    }

    const authorModules = import.meta.glob(['../../../../content/author/*.md']);
    const authorItems = await parseModules(authorModules);

    const authors: Author[] = [];
    if (course?.authors?.length) {
        for (const authorSlug of course.authors) {
            const author = await getContentBySlug({ contentItems: authorItems, slug: authorSlug }) as unknown as Author;
            if (author) {
                authors.push(author);
            }
        }
    }

    const sponsorModules = import.meta.glob(['../../../../../content/sponsor/*.md']);
    const sponsorItems = await parseModules(sponsorModules);

    const sponsors: Sponsor[] = [];
    if (course?.sponsors?.length) {
        for (const sponsorSlug of course.sponsors) {
            const sponsor = await getContentBySlug({ contentItems: sponsorItems, slug: sponsorSlug }) as unknown as Sponsor;
            if (sponsor)
                sponsors.push(sponsor);
        }
    }

    return {
        contentType,
        course,
        courseItems,
        authors,
        sponsors,
    };
});
