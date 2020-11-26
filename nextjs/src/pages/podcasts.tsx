import Head from "next/head";
import PostsCards from "../components/PostsCards";
import * as admin from "firebase-admin";

import { serviceAccountKey, config } from "../config/firebase";

export default function Podcasts({ posts }) {
  return (
    <div>
      <Head>
        <title>Podcasts | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 place-items-auto">
        <PostsCards post_type={"podcasts"} posts={posts} />
      </main>

      <footer></footer>
    </div>
  );
}

export async function getStaticProps() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: config.databaseURL,
      storageBucket: config.storageBucket,
    });
  }

  const postDocs = await admin
    .firestore()
    .collection("podcasts")
    .orderBy("post_publish_datetime", "desc")
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
