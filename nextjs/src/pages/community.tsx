import Head from 'next/head';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';
import { Post } from '@/models/post.model';

export default function Community({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Head>
        <title>Community | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 place-items-auto ">
        <PostsCards posts={posts} />
      </main>

      <footer></footer>
    </Layout>
  );
}
