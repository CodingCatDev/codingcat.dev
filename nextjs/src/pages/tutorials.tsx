import Head from 'next/head';
import PostsCards from '@/components/PostsCards';
import { postsService } from '@/services/serversideApi';

export default function Tutorials({ posts }) {
  return (
    <>
      <Head>
        <title>Tutorials | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 place-items-auto ">
        <PostsCards type={'tutorials'} posts={posts} />
      </main>

      <footer></footer>
    </>
  );
}

export async function getStaticProps() {
  const posts = await postsService('tutorials');
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
