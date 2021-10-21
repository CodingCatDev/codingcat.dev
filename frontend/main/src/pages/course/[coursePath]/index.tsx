import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import {
  getSite,
  getStripeProduct,
  postBySlugService,
  postsService,
} from '@/services/serversideApi';

import { Post as PostModel, PostType } from '@/models/post.model';
import rehypePrism from '@mapbox/rehype-prism';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { StripeProduct } from '@/models/stripe.model';
import matter from 'gray-matter';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Course from '@/components/Course';

export default function CoursePage({
  site,
  post,
  source,
  product,
}: {
  site: Site | null;
  post: PostModel;
  source: MDXRemoteSerializeResult | null;
  product: StripeProduct | null;
}): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout site={site}>
        <h2>Loading...</h2>
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
        <Course post={post} source={source} product={product} />
      </Layout>
    </>
  );
}

export async function getStaticPaths(): Promise<{
  paths: { params: { coursePath: string } }[];
  fallback: boolean;
}> {
  const paths: { params: { coursePath: string } }[] = [];
  for (const postType of [PostType.course]) {
    const docData = await postsService(postType);
    for (const doc of docData) {
      paths.push({
        params: {
          coursePath: doc.slug,
        },
      });
    }
  }
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: {
  params: { coursePath: string };
}): Promise<
  | {
      props: {
        site: Site | null;
        post: PostModel | null;
        source: MDXRemoteSerializeResult | null;
        product: StripeProduct | null;
      };
      revalidate: number;
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { coursePath } = params;

  if (!coursePath) {
    console.log('No Course Path Found.');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  const site = await getSite();
  const posts = await postBySlugService(PostType.course, coursePath);
  const post = posts.length > 0 ? posts[0] : null;

  if (!post) {
    console.log('No Post Found.');

    return {
      notFound: true,
    };
  }

  const productId = post?.accessSettings?.productId;
  let product = null;
  if (productId) {
    product = await getStripeProduct(productId);
    if (product) {
      console.log(`${coursePath} has product: `, product.id);
    }
  }

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
        remarkPlugins: [parse, remark2react],
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
      source,
      product,
    },
    revalidate: 3600,
  };
}
