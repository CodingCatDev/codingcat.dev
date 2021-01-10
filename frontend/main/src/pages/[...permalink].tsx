import Head from 'next/head';
import Link from 'next/link';
import DefaultErrorPage from 'next/error';
import { useRouter } from 'next/router';

import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import RecentPostsList from '@/components/RecentPostsList';
import {
  postBySlugService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';
import ShowMDX from '@/components/ShowMDX';
import PostMedia from '@/components/PostMedia';

import { Post as PostModel, PostType } from '@/models/post.model';
import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';

export default function Post({
  post,
  recentPosts,
}: {
  post: PostModel;
  recentPosts: { [key: string]: PostModel[] };
}): JSX.Element {
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
  const pluralType = pluralize(post);

  return (
    <Layout>
      <section className="sticky top-0 z-10 bg-primary-50">
        <BreakBarLeft>
          <h1 className="w-1/2 font-sans text-4xl text-basics-50 dark:text-basics-50">
            {post.title}
          </h1>
          <Link href={`/${pluralType}`}>
            <a role="link" className="no-underline btn-secondary">
              {`back to ${toTitleCase(pluralType)}`}
            </a>
          </Link>
        </BreakBarLeft>
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
        main a {
          text-decoration: underline;
        }
        main h1,
        main h2,
        main h3,
        main h4,
        main h5,
        main h6 {
          font-family: 'Nunito', sans-serif;
          margin: 1rem 0;
        }
        main article p:first-child a img {
          width: 100%;
        }
        main p {
          margin: 1rem 0;
        }
        main ul li {
          margin-left: 2rem;
          list-style-type: circle;
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.post, PostType.tutorial, PostType.podcast].forEach(
    async (postType) => {
      const docData = await postsService(postType);
      for (const doc of docData) {
        paths.push({
          params: {
            type: doc.type,
            slug: doc.slug,
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
  params: { permalink: string[] };
}): Promise<
  | {
      props: {
        post: PostModel | null;
        recentPosts: { [key: string]: PostModel[] };
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
> {
  if (params.permalink.length !== 2) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const type = params.permalink[0] as PostType;
  const slug = params.permalink[1] as string;

  const allowedTypes = [PostType.post, PostType.podcast, PostType.tutorial];
  if (!type || !slug || !allowedTypes.includes(type)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const posts = await postBySlugService(type, slug);
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
