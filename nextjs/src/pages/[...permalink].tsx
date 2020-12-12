import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import parse from 'remark-parse';
import mdx from 'remark-mdx';

import Layout from '@/layout/Layout';
import RecentPostsList from '@/components/RecentPostsList';
import {
  postByPermalinkService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostType } from '@/models/post.model';

export default function Post({
  post,
  markdown,
  recentPosts,
}: {
  post: PostType;
  markdown: any;
  recentPosts: { [key: string]: PostType[] };
}) {
  const router = useRouter();
  if (router.isFallback) {
    return <h2>Loading ...</h2>;
  }

  if (!post) {
    return (
      <Layout>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </Layout>
    );
  }

  const content = hydrate(markdown);
  return (
    <Layout>
      <div className="grid grid-cols-12 gap-2 ">
        <div className="col-span-12 xl:col-span-10">
          <h1>{post.title}</h1>
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
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths: any = [];
  ['post', 'tutorials', 'podcasts'].forEach(async (postType) => {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          permalink: doc.permalink.substring(1).split('/'),
        },
      });
    }
  });
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { permalink: [] };
}) {
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
