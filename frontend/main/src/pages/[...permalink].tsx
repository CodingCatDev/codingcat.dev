import Head from 'next/head';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import RecentPostsList from '@/components/RecentPostsList';
import {
  postByPermalinkService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';
import ShowMDX from '@/components/ShowMDX';
import PostMedia from '@/components/PostMedia';

import { Post as PostModel, PostType } from '@/models/post.model';

export default function Post({
  post,
  recentPosts,
}: {
  post: PostModel;
  recentPosts: { [key: string]: PostModel[] };
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

  return (
    <Layout>
      <section className="sticky top-0 z-10 bg-primary-50">
        <BreakBarLeft>
          <div className="grid items-center justify-center lg:flex lg:justify-between">
            <h1 className="font-sans text-2xl lg:text-4xl lg:w-1/2 text-basics-50 dark:text-basics-50">
              {post.title}
            </h1>
            <label htmlFor="search_blog" className="sr-only">
              Search bar
            </label>
            <input
              type="text"
              id="search_blog"
              placeholder="search"
              className="rounded-full lg:w-1/3"
            />
          </div>
        </BreakBarLeft>
        <div className="p-2 pt-8 z-9">
          <PostMedia post={post} />
        </div>
      </section>
      {/* BLOG POST */}
      <section className="relative grid items-start justify-center gap-10 px-4 leading-relaxed 2xl:px-16 2xl:justify-start">
        <article className="text-basics-900 ">
          <ShowMDX markdown={post.content || ''} />
        </article>
        {/* RECENTS */}
        <section className="grid max-w-full gap-10 p-4 rounded-md shadow-2xl 2xl:overflow-y-scroll 2xl:h-72 right-64 top-80 bg-basics-50 2xl:fixed scrollbar 2xl:max-w-xs">
          <section className="grid gap-4">
            <h3 className="m-0 font-sans text-3xl underline text-secondary-500 text-mt-4">
              Recent Courses
            </h3>
            <RecentPostsList posts={recentPosts[PostType.course]} />
          </section>
          <section className="grid gap-4">
            <h3 className="m-0 font-sans text-3xl underline text-secondary-500 text-mt-4">
              Recent Tutorials
            </h3>
            <RecentPostsList posts={recentPosts[PostType.tutorial]} />
          </section>
          <section className="grid gap-4">
            <h3 className="m-0 font-sans text-3xl underline text-secondary-500 text-mt-4">
              Recent Blog
            </h3>
            <RecentPostsList posts={recentPosts[PostType.post]} />
          </section>
          <section className="grid gap-4">
            <h3 className="m-0 font-sans text-3xl underline text-secondary-500 text-mt-4">
              Recent Podcasts
            </h3>
            <RecentPostsList posts={recentPosts[PostType.podcast]} />
          </section>
        </section>
      </section>
      <style global jsx>{`
        a {
          text-decoration: underline;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Nunito', sans-serif;
          margin: 1rem 0;
        }
        article p:first-child a img {
          width: 100%;
        }
        p {
          margin: 1rem 0;
        }
        ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths: any = [];
  [PostType.post, PostType.tutorial, PostType.podcast].forEach(
    async (postType) => {
      const docData = await postsService(postType);
      for (const doc of docData) {
        paths.push({
          params: {
            permalink: doc.permalink.substring(1).split('/'),
          },
        });
      }
    }
  );
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
  const recentPosts = await postsRecentService([
    PostType.course,
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
  ]);

  return {
    props: {
      post,
      recentPosts,
    },
    revalidate: 60,
  };
}
