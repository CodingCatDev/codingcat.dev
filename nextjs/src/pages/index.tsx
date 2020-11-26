import Head from "next/head";
import admin from "../utils/firebaseAdmin";

import RecentPostsCards from "../components/RecentPostsCards";

export default function Home({ recentPosts }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto mt-16">
        <RecentPostsCards recentPosts={recentPosts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const recentPosts = { post: [], tutorials: [], podcasts: [] };
  await Promise.all(
    Object.keys(recentPosts).map(async (postType) => {
      const posts = await admin
        .firestore()
        .collection(postType === "post" ? "posts" : postType)
        .orderBy("post_publish_datetime", "desc")
        .limit(3)
        .get();
      for (const doc of posts.docs) {
        recentPosts[postType].push(doc.data());
      }
    })
  );

  return {
    props: {
      recentPosts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
