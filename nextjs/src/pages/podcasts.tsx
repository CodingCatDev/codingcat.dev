import Head from 'next/head';
import PostsCards from '@/components/PostsCards';
import { postsService } from '@/services/serversideApi';

export default function Podcasts({ posts }) {
  return (
    <div>
      <Head>
        <title>Podcasts | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 gap-2 mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 place-items-auto">
        <PostsCards type={'podcasts'} posts={posts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await postsService('podcasts');

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
