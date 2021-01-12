import Head from 'next/head';
import Layout from '@/layout/Layout';

import PostsCards from '@/components/PostsCards';

import { postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';

export default function Courses({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Head>
        <title>Courses | CodingCatDev</title>
      </Head>

      <div className="w-full mx-auto max-w-7xl">
        <section className="grid gap-4 p-4 grid-cols-fit sm:gap-10 sm:p-10">
          <PostsCards posts={posts} />
        </section>
      </div>
      <footer></footer>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await postsService(PostType.course);
  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
