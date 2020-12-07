import Head from 'next/head';
import PostsCards from '@/components/PostsCards';

import { postsService } from '@/services/serversideApi';

export default function Blog({ posts }) {
  return (
    <div>
      <Head>
        <title>Blog | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 place-items-auto ">
        <PostsCards type={'post'} posts={posts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await postsService('post');
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
