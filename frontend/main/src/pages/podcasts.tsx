import Head from 'next/head';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';
import { postsService } from '@/services/serversideApi';
import { Post, PostType } from '@/models/post.model';

export default function Podcasts({ posts }: { posts: Post[] }) {
  return (
    <Layout>
      <Head>
        <title>Podcasts | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 place-items-auto">
        <PostsCards type={PostType.podcast} posts={posts} />
      </main>

      <footer></footer>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = await postsService(PostType.podcast);

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
