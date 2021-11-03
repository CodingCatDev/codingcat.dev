// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap, ISitemapField } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { PostType } from '@/models/post.model';
import { getPostsService } from '@/services/sanity.server';

const url = `${process.env.SITE_URL || 'https://codingcat.dev'}`;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields: ISitemapField[] = [];
  for (const type of [
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
    PostType.page,
    PostType.course,
  ]) {
    const docData = await getPostsService({ type });
    for (const doc of docData) {
      fields.push({
        loc: `${url}/${doc._type}/${doc.slug}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    }
  }
  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
const Named = () => {};
export default Named;
