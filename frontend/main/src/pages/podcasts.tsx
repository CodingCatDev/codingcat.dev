import Head from 'next/head';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';

import { getSite, postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';

export default function Blog({
  site,
  posts,
}: {
  site: Site | null;
  posts: Post[];
}): JSX.Element {
  return (
    <Layout site={site}>
      <Head>
        <title>Podcasts | CodingCatDev</title>
      </Head>

      <PostsCards posts={posts} />

      <footer></footer>
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
  const posts = await postsService(PostType.podcast);
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
