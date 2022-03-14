import { CodingCatBuilderContent, ModelType } from '@/models/builder.model';
import { Feed } from 'feed';
import { getAllBuilder } from '@/services/builder.server';

const site = 'https://codingcat.dev';

export const buildFeed = ({
  posts,
  type,
}: {
  posts: CodingCatBuilderContent[];
  type: ModelType;
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
      email: 'alex@codingcat.dev',
      link: `${site}`,
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.data.title,
      link: `${site}${post.data.url}`,
      description: `${post.data.page.excerpt}`,
      date: post.startDate ? new Date(post.startDate) : new Date(),
      author: post.data.page?.authors?.map((author) => {
        return {
          name: author.author.value.data.displayName,
          link: `${site}/authors/${author.author.value.data.slug}`,
        };
      }),
    });
  }
  return feed;
};

export const build = async ({ type }: { type: ModelType }) => {
  const posts = (await getAllBuilder({
    omit: 'data.blocks',
    model: type,
    startEnd: true,
  })) as CodingCatBuilderContent[];

  return buildFeed({ posts, type });
};
