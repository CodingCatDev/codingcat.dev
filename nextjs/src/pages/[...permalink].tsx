import Head from "next/head";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";

import * as admin from "firebase-admin";
import { serviceAccountKey, config } from "../config/firebase";

import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import parse from "remark-parse";
import remark2react from "remark-react";

import RecentPostsList from "../components/RecentPostsList";

export default function Post({ post, markdown, recentPosts }) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  if (!post) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  const content = hydrate(markdown);
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12 xl:col-span-10">
        <h1>{post.post_title}</h1>
        <article className="prose lg:prose-xl prose-red">{content}</article>
      </div>
      <div className="col-span-12 xl:col-span-2">
        <div className="bg-white shadow p-3 m-3 rounded-lg">
          <p className="text-xl text-bold tracking-wide text-gray-800 mb-2">
            Recent Posts
          </p>
          <RecentPostsList posts={recentPosts.post} />
          <p className="text-xl text-bold tracking-wide text-gray-800 mb-2">
            Recent Tutorials
          </p>
          <RecentPostsList posts={recentPosts.tutorials} />
          <p className="text-xl text-bold tracking-wide text-gray-800 mb-2">
            Recent Podcasts
          </p>
          <RecentPostsList posts={recentPosts.podcasts} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: config.databaseURL,
      storageBucket: config.storageBucket,
    });
  }
  const POSTS = [];
  ["post", "tutorials", "podcasts"].forEach(async (postType) => {
    const posts = await admin
      .firestore()
      .collection(postType === "post" ? "posts" : postType)
      .orderBy("post_publish_datetime", "desc")
      .get();
    for (const doc of posts.docs) {
      POSTS.push({
        params: {
          permalink: doc.data().post_permalink.substring(1).split("/"),
        },
      });
    }
  });
  return {
    paths: POSTS,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountKey),
      databaseURL: config.databaseURL,
      storageBucket: config.storageBucket,
    });
  }

  const { permalink } = params;

  const posts = await admin
    .firestore()
    .collection(permalink.length > 1 ? `${permalink[0]}` : "posts")
    .where("post_permalink", "==", `/${permalink.join("/")}`)
    .get();

  let postData;
  for (const doc of posts.docs) {
    postData = doc.data();
  }
  const post = posts.docs.length > 0 ? postData : null;
  const markdown = post
    ? await renderToString(postData.post_content, {
        mdxOptions: {
          remarkPlugins: [parse, remark2react],
        },
      })
    : null;

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
      post,
      markdown,
      recentPosts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
