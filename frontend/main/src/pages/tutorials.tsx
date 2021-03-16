import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';

import { getSite, postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';

export default function Tutorials({
  site,
  posts,
}: {
  site: Site | null;
  posts: Post[];
}): JSX.Element {
  return (
    <Layout site={site}>
      <NextSeo
        title="Tutorials | CodingCatDev"
        canonical={`https://codingcat.dev/tutorials/`}
      ></NextSeo>

      <PostsCards posts={posts} />
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
    posts: Post[];
  };
  revalidate: number;
}> {
  const site = await getSite();
  const posts = await postsService(PostType.tutorial);
  return {
    props: {
      site,
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
