import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { BuilderComponent, Builder, builder } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';

// Custom
import Layout from '@/layout/Layout';
import { PostType } from '@/models/post.model';
import { join } from 'path/posix';

function getRecent(page: string[] | undefined, type: PostType) {
  return page
    ? []
    : builder.getAll(type, {
        omit: 'data.blocks',
        includeRefs: true,
        limit: 3,
        options: {
          noTargeting: true,
        },
        query: {
          $and: [
            { startDate: { $lte: Date.now() } },
            {
              $or: [
                { endDate: { $exists: false } },
                { endDate: { $gte: Date.now() } },
              ],
            },
          ],
        },
      });
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  const [header, footer, page, course, post, tutorial, podcast] =
    await Promise.all([
      builder.get('header').promise(),
      builder.get('footer').promise(),
      builder
        .get('page', {
          userAttributes: {
            urlPath: '/' + (params?.page?.join('/') || ''),
          },
        })
        .toPromise(),
      getRecent(params?.page, PostType.course),
      getRecent(params?.page, PostType.post),
      getRecent(params?.page, PostType.tutorial),
      getRecent(params?.page, PostType.podcast),
    ]);

  return {
    props: {
      page,
      header,
      footer,
      recentPosts: { course, post, tutorial, podcast },
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    fields: `data.url`,
    options: { noTargeting: true },
  });

  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  };
}

export default function Page({
  page,
  header,
  footer,
  recentPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    setIsLive(!Builder.isEditing && !Builder.isPreviewing);
  }, []);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!page && isLive) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta name="title"></meta>
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  return (
    <>
      <NextSeo
        title={page.title}
        description={page.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: page.title,
          description: page.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_1200,h_630/${page.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: page.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/${page.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      <Layout header={header} footer={footer}>
        <BuilderComponent
          model="page"
          content={page}
          context={{ recentPosts }}
        />
      </Layout>
    </>
  );
}
