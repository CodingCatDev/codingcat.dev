import Head from 'next/head';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';

import { postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';

export default function Blog({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Head>
        <title>Blog | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 place-items-auto ">
        <PostsCards posts={posts} />
      </main>

      <footer></footer>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await postsService(PostType.post);
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
