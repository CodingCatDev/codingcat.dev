import Head from 'next/head';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';
import { postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';

export default function Tutorials({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Head>
        <title>Tutorials | CodingCatDev</title>
      </Head>

      <section className="grid gap-4 p-4 sm:gap-10 grid-cols-fit sm:p-10">
        <PostsCards posts={posts} />
      </section>

      <footer></footer>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await postsService(PostType.tutorial);
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
