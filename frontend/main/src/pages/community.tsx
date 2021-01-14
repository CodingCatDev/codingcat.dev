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

      <main className="grid gap-4 p-4 sm:gap-10 grid-cols-fit sm:p-10">
        <PostsCards posts={posts} />
      </main>

      <footer></footer>
    </Layout>
  );
}
