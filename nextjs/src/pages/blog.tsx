import Head from 'next/head';
import PostsCards from '@/components/PostsCards';

import admin from '@/utils/firebaseAdmin';

export default function Blog({ posts }) {
  return (
    <div>
      <Head>
        <title>Blog | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto mt-16">
        <PostsCards post_type={'post'} posts={posts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  const postDocs = await admin
    .firestore()
    .collection('posts')
    .orderBy('post_publish_datetime', 'desc')
    .get();

  const posts = [];
  for (const doc of postDocs.docs) {
    posts.push(doc.data());
  }

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
