import { NextSeo } from 'next-seo';
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
      <NextSeo
        title="Podcasts | CodingCatDev"
        canonical={`https://codingcat.dev/podcasts/`}
      ></NextSeo>

      <div className="p-4 sm:p-10">
        <h1 className="mb-4 text-5xl text-center lg:text-7xl">
          {posts[0].type.charAt(0).toUpperCase() + posts[0].type.slice(1)}s
        </h1>
        <PostsCards posts={posts} />
      </div>
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
    revalidate: 3600, // In seconds
  };
}
