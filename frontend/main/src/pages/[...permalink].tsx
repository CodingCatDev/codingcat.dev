import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import {
  getSite,
  postBySlugService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import matter from 'gray-matter';
import rehypePrism from '@mapbox/rehype-prism';
import renderToString from 'next-mdx-remote/render-to-string';
import { Source } from 'next-mdx-remote/hydrate';
import PostLayout from '@/components/PostLayout';
import { Site } from '@/models/site.model';
import AJLoading from '@/components/global/icons/AJLoading';
import Layout from '@/layout/Layout';

export default function Post({
  site,
  post,
  source,
  recentPosts,
}: {
  site: Site | null;
  post: PostModel;
  recentPosts: { [key: string]: PostModel[] };
  source: Source | null;
}): JSX.Element {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <Layout site={site}>
        <section className="max-w-md p-10 mx-auto">
          <h1>Loading...</h1>
          <AJLoading className="w-full h-auto" />
        </section>
      </Layout>
    );
  }
  return (
    <>
      <NextSeo
        title={post.title}
        description={post.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: post.title,
          description: post.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_800,h_600/${post.coverPhoto?.public_id}`,
              width: 800,
              height: 600,
              alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain',
            },
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_900,h_800/${post.coverPhoto?.public_id}`,
              width: 900,
              height: 800,
              alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain',
            },
            {
              url: `https://media.codingcat.dev/image/upload/${post.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>

      <PostLayout
        router={router}
        site={site}
        post={post}
        source={source}
        recentPosts={recentPosts}
      />
    </>
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { type: PostType; slug: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { type: PostType; slug: string } }[] = [];
  [PostType.post, PostType.tutorial, PostType.podcast, PostType.page].forEach(
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
        site: Site | null;
        post: PostModel | null;
        recentPosts: { [key: string]: PostModel[] };
        source: Source | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const site = await getSite();

  let type = params.permalink[0] as PostType;
  let slug = params.permalink[1] as string;

  // Redirect plural page types
  if (['podcasts', 'tutorials', 'courses'].includes(type) && slug) {
    let dest;
    switch (type as string) {
      case 'podcasts':
        dest = 'podcast';
        break;
      case 'tutorials':
        dest = 'tutorial';
        break;
      case 'courses':
        dest = 'course';
        break;
    }
    return {
      redirect: {
        destination: `/${dest}/${slug}`,
        permanent: true,
      },
    };
  }

  // Make assumption that this should be a base page.
  if (type && !slug) {
    slug = type;
    type = PostType.page;
  }

  const allowedTypes = [
    PostType.post,
    PostType.podcast,
    PostType.tutorial,
    PostType.page,
  ];
  if (!type || !slug || !allowedTypes.includes(type)) {
    return {
      notFound: true,
    };
  }

  let posts = await postBySlugService(type, slug);
  let post = posts.length > 0 ? posts[0] : null;

  // Check if old blog link is trying to be used.
  if (!post) {
    if (type === PostType.page) {
      posts = await postBySlugService(PostType.post, slug);
      post = posts.length > 0 ? posts[0] : null;
    }
    // This means the page was found, but we want to redirect them.
    if (post) {
      return {
        redirect: {
          destination: `/${PostType.post}/${slug}`,
          permanent: true,
        },
      };
    }
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  const recentPosts = await postsRecentService([
    PostType.course,
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
  ]);

  let source: Source | null;

  if (post && post.content) {
    const { content } = matter(post.content);
    source = await renderToString(content, {
      mdxOptions: {
        // remarkPlugins: [parse, mdx],
        rehypePlugins: [rehypePrism],
      },
    });
  } else {
    source = null;
  }

  return {
    props: {
      site,
      post,
      recentPosts,
      source,
    },
    revalidate: 60,
  };
}
