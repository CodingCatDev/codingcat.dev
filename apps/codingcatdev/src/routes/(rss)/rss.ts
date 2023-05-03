import type { Content, ContentType } from "$lib/types";
import { Feed } from 'feed';

const site = 'https://codingcat.dev';


export const buildFeed = ({
    contents,
    contentType,
}: {
    contents: Content[];
    contentType: ContentType;
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
        feed.addItem({
            title: content.title || '',
            link: `${site}/${contentType}/${content.slug}`,
            description: `${content.excerpt}`,
            image: content.cover || feed.items.at(0)?.image,
            date: content.start || new Date(),
            author: content?.authors ? content.authors?.map((author) => {
                return {
                    name: author.name,
                    link: `${site}/authors/${author.slug}`,
                };
            })
                : [{
                    name: 'Alex Patterson',
                    email: 'alex@codingcat.dev',
                    link: `${site}`,
                }],
        });
    }
    return feed;
};
