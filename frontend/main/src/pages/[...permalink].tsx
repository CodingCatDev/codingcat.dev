import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import {
  getSite,
  historyById,
  postBySlugService,
  postsRecentService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import matter from 'gray-matter';
import rehypePrism from '@mapbox/rehype-prism';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { serialize } from 'next-mdx-remote/serialize';
import PostLayout from '@/components/PostLayout';
import { Site } from '@/models/site.model';
import AJLoading from '@/components/global/icons/AJLoading';
import Layout from '@/layout/Layout';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import DefaultErrorPage from 'next/error';

export default function Post({
  site,
  post,
  source,
  recentPosts,
  preview,
}: {
  site: Site | null;
  post: PostModel;
  recentPosts: { [key: string]: PostModel[] };
  source: MDXRemoteSerializeResult | null;
  preview: boolean;
}): JSX.Element {
  console.log(source);
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
  if (!post) {
    return (
      <Layout site={site}>
        <DefaultErrorPage statusCode={404} />
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
              url: `https://media.codingcat.dev/image/upload/c_fit,w_1200,h_630/${post.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/${post.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <PostLayout
          router={router}
          post={post}
          source={source}
          recentPosts={recentPosts}
          preview={preview}
        />
      </Layout>
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
  preview,
  previewData,
}: {
  params: { permalink: string[] };
  preview: boolean;
  previewData: PostModel;
}): Promise<
  | {
      props: {
        site: Site | null;
        post: PostModel | null;
        recentPosts: { [key: string]: PostModel[] };
        source: MDXRemoteSerializeResult | null;
        preview: boolean;
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

  // Preview page
  let post;
  let posts;

  if (preview && previewData && previewData.slug === slug) {
    const { postId, id } = previewData;
    if (!postId || !id) {
      return {
        notFound: true,
      };
    }

    post = await historyById(postId, id);
  } else {
    posts = await postBySlugService(type, slug);
    post = posts.length > 0 ? posts[0] : null;
    preview = false;
  }

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

  let source: MDXRemoteSerializeResult | null;
  let allContent = '';

  if (post && post.urlContent) {
    const c = await (await fetch(post.urlContent)).text();
    if (c) {
      const { content } = matter(c);

      if (post.urlContent.includes('next.js') && content) {
        allContent = content.replace(
          new RegExp(/<a href\="\/docs/g),
          '<a href="https://nextjs.org/docs'
        );
        allContent = allContent.replace(new RegExp(/.md/g), '');
      } else {
        if (!content) {
          console.log('missing content after matter');
        }
      }
    } else {
      console.log('URL Content Failed');
    }
  }

  if (post && post.content) {
    const { content } = matter(post.content);
    allContent = allContent + content;
  }
  if (allContent) {
    source = await serialize(allContent, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
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
      preview,
    },
    revalidate: 3600,
  };
}
