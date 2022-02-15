import { Post, PostType } from '@/models/post.model';
import { getPostsService } from '@/services/sanity.server';
import { Feed } from 'feed';
import { Timestamp } from 'firebase/firestore';

import { remark } from 'remark';
import remarkHtml from 'remark-html';

import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

const site = 'https://codingcat.dev';

export function markdownToHtml(markdownText: string) {
  const file = remark().use(remarkHtml).processSync(markdownText);
  return String(file);
}

export const buildFeed = ({
  posts,
  type,
}: {
  posts: Post[];
  type: PostType;
}) => {
  const feed = new Feed({
    title: `${site} - ${type} feed`,
    description: `${site} - ${type} feed`,
    id: `${site}`,
    link: `${site}`,
    language: 'en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: `https://media.codingcat.dev/image/upload/c_thumb,g_face,w_1200,h_630/dev-codingcatdev-photo/v60h88eohd7ufghkspgo.png`,
    favicon: `${site}/favicon.ico`,
    copyright: `All rights reserved 2021, ${site}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${site}/blog/rss.xml`,
    },
    author: {
      name: 'Alex Patterson',
      email: 'alex@builder.io',
      link: `${site}`,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      link: `${site}/${type}/${post.slug}`,
      description: `${post.excerpt}`,
      image: post.coverPhoto ? post.coverPhoto.secure_url : '',
      date: post.publishedAt
        ? Timestamp.fromMillis(post.publishedAt as unknown as number).toDate()
        : new Date(),
      author: post.authors?.map((author) => {
        return {
          name: author.displayName,
          link: `${site}/authors/${author.slug}`,
        };
      }),
      content: post.content ? markdownToHtml(post.content) : '',
    });
  }
  return feed;
};

export const build = async ({ type }: { type: PostType }) => {
  const posts = await getPostsService({
    type,
    limit: 100,
    params: `
        title,
        "slug":slug.current,
        excerpt,
        publishedAt,
        authors[]->{
            ...,
            "slug":slug.current,
        },
        content,
        coverPhoto{
          ...
        }
    `,
  });
  return buildFeed({ posts, type });
};
