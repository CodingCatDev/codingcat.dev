import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';
import parse from 'remark-parse';
import mdx from 'remark-mdx';

import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
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
      <section className="sticky top-0 z-10">
        <BreakBarLeft>
          <h1 className="w-1/2 font-sans text-4xl leading-relaxed text-ccd-basics-050">
            {post.title}
          </h1>
          <label htmlFor="search_blog" className="sr-only">
            Search bar
          </label>
          <input
            type="text"
            id="search_blog"
            placeholder="search"
            className="w-1/3 rounded-full"
          />
        </BreakBarLeft>
      </section>
      {/* BLOG POST */}
      <section className="relative grid items-start justify-center gap-10 px-4 2xl:px-16 2xl:justify-start">
        <article className="prose sm:prose-sm lg:prose-lg 2xl:prose-xl">
          {content}
        </article>
        {/* RECENTS */}
        <section className="grid max-w-xs gap-10 p-4 overflow-y-scroll rounded-md shadow-2xl h-72 right-64 top-80 bg-ccd-basics-050 2xl:fixed scrollbar">
          <section className="grid gap-4">
            <h3 className="font-sans text-3xl underline text-mt-4 text-ccd-pinks-500">
              Recent Posts
            </h3>
            <RecentPostsList posts={recentPosts.post} />
          </section>

          <section className="grid gap-4">
            <h3 className="font-sans text-3xl underline text-mt-4 text-ccd-pinks-500">
              Recent Tutorials
            </h3>
            <RecentPostsList posts={recentPosts.tutorials} />
          </section>
          <section className="grid gap-4">
            <h3 className="font-sans text-3xl underline text-mt-4 text-ccd-pinks-500">
              Recent Podcasts
            </h3>
            <RecentPostsList posts={recentPosts.podcasts} />
          </section>
        </section>
      </section>
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
