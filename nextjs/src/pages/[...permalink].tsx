import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import admin from '@/utils/firebaseAdmin';

import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import parse from 'remark-parse';
import mdx from 'remark-mdx';

import RecentPostsList from '@/components/RecentPostsList';
import {
  postByPermalinkService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

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
    <div className="grid grid-cols-12 gap-2 ">
      <div className="col-span-12 xl:col-span-10">
        <h1>{post.post_title}</h1>
        <article className="prose prose-ccd-purples lg:prose-xl">
          {content}
        </article>
      </div>
      <div className="col-span-12 xl:col-span-2">
        <div className="p-3 m-3 bg-white rounded-lg shadow">
          <p className="mb-2 text-xl tracking-wide text-bold text-ccd-basics-800">
            Recent Posts
          </p>
          <RecentPostsList posts={recentPosts.post} />
          <p className="mb-2 text-xl tracking-wide text-bold text-ccd-basics-800">
            Recent Tutorials
          </p>
          <RecentPostsList posts={recentPosts.tutorials} />
          <p className="mb-2 text-xl tracking-wide text-bold text-ccd-basics-800">
            Recent Podcasts
          </p>
          <RecentPostsList posts={recentPosts.podcasts} />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const POSTS = [];
  ['post', 'tutorials', 'podcasts'].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      POSTS.push({
        params: {
          permalink: doc.permalink.substring(1).split('/'),
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
  const { permalink } = params;

  const posts = await postByPermalinkService(permalink);
  const post = posts.length > 0 ? posts[0] : null;
  const markdown = post
    ? await renderToString(post.content, {
        mdxOptions: {
          remarkPlugins: [parse, mdx],
        },
      })
    : null;

  const recentPosts = await postsRecentService([
    'courses',
    'post',
    'tutorials',
    'podcasts',
  ]);

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
