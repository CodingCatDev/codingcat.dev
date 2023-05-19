import type { Content, ContentType, Author } from "$lib/types";
import { Feed, type Author as FeedAuthor } from 'feed';

const site = 'https://codingcat.dev';


export const buildFeed = ({
    contents,
    contentType,
    authorItems,
}: {
    contents: Content[];
    contentType: ContentType;
    authorItems: Author[];
}) => {
    const feed = new Feed({
        title: `${site} - ${contentType} feed`,
        description: `${site} - ${contentType} feed`,
        id: `${site}`,
        link: `${site}`,
        language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: `https://media.codingcat.dev/image/upload/f_png,c_thumb,g_face,w_1200,h_630/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png`,
        favicon: `${site}/favicon.ico`,
        copyright: `All rights reserved 2021, ${site}`,
        updated: new Date(),
        feedLinks: {
            rss2: `${site}/blog/rss.xml`,
        },
        author: {
            name: 'Alex Patterson',
            email: 'alex@codingcat.dev',
            link: `${site}`,
        },
    });

    for (const content of contents) {

        const authors = content?.authors?.map((authorSlug) => {
            return authorItems.filter(a => a.slug === authorSlug).map(a => {
                return {
                    name: a.name,
                    link: `${site}/author/${a.slug}`,
                }
            })?.at(0) as FeedAuthor;
        }).filter(a => a !== undefined)
        feed.addItem({
            title: content.title || '',
            content: content.html,
            link: `${site}/${contentType}/${content.slug}`,
            description: `${content.excerpt}`,
            image: content.cover || feed.items.at(0)?.image,
            date: content.start || new Date(),
            author: authors ? authors
                : [{
                    name: 'Alex Patterson',
                    email: 'alex@codingcat.dev',
                    link: `${site}/author/alex-patterson`,
                }],
        });
    }
    return feed;
};
