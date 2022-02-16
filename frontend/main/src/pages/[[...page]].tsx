import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { BuilderComponent, Builder, builder } from '@builder.io/react';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { CodingCatBuilderContent, ModelType } from '@/models/builder.model';

function getRecent(type: ModelType) {
  return builder.getAll(type, {
    omit: 'data.blocks',
    includeRefs: true,
    limit: 3,
    options: {
      noTargeting: true,
    },
    query: {
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: { $lte: Date.now() } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: Date.now() } },
          ],
        },
      ],
    },
  }) as Promise<CodingCatBuilderContent[]>;
}

function getList(type: string) {
  let singular = type === 'blog' ? 'post' : type.slice(0, -1);
  console.log('getAll: ', singular);

  return builder.getAll(singular, {
    omit: 'data.blocks',
    includeRefs: true,
    limit: 100,
    options: {
      noTargeting: true,
    },
    // query: {
    //   $and: [
    //     {
    //       $or: [
    //         { startDate: { $exists: false } },
    //         { startDate: { $lte: Date.now() } },
    //       ],
    //     },
    //     {
    //       $or: [
    //         { endDate: { $exists: false } },
    //         { endDate: { $gte: Date.now() } },
    //       ],
    //     },
    //   ],
    // },
  }) as Promise<CodingCatBuilderContent[]>;
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  let type = (params?.page?.[0] as ModelType) || '';
  let slug = (params?.page?.[1] as string) || '';
  let lesson = (params?.page?.[2] as string) || '';
  let lessonPath = (params?.page?.[3] as string) || '';

  console.log('url:', '/' + (params?.page?.join('/') || ''));

  const isList = ['courses', 'pages', 'podcasts', 'blog', 'tutorials'].includes(
    type
  );

  isList
    ? console.log('fetching list', type)
    : console.log('fetching model', slug ? type : 'page');

  const [header, footer, modelData, course, post, tutorial, podcast, list] =
    await Promise.all([
      builder.get('header').promise(),
      builder.get('footer').promise(),
      builder
        .get(slug ? type : 'page', {
          userAttributes: {
            urlPath: '/' + (params?.page?.join('/') || ''),
          },
          // includeRefs: true,
          // options: {
          //   noTargeting: true,
          // },
          // query: {
          //   $and: [
          //     {
          //       $or: [
          //         { startDate: { $exists: false } },
          //         { startDate: { $lte: Date.now() } },
          //       ],
          //     },
          //     {
          //       $or: [
          //         { endDate: { $exists: false } },
          //         { endDate: { $gte: Date.now() } },
          //       ],
          //     },
          //   ],
          // },
        })
        .toPromise(),
      isList ? null : getRecent(ModelType.course),
      isList ? null : getRecent(ModelType.post),
      isList ? null : getRecent(ModelType.tutorial),
      isList ? null : getRecent(ModelType.podcast),
      isList ? getList(type) : null,
    ]);
  console.log(modelData?.data?.title);

  return {
    props: {
      modelData: modelData || null,
      model: slug ? type : 'page',
      type: slug,
      header: header || null,
      footer: footer || null,
      recentPosts: {
        course: course || null,
        post: post || null,
        tutorial: tutorial || null,
        podcast: podcast || null,
      },
      list,
    },
    revalidate: 300,
  };
}

export async function getStaticPaths() {
  const paths: string[] = [];
  for (const postType of [
    ModelType.page,
    ModelType.post,
    ModelType.tutorial,
    ModelType.podcast,
    ModelType.course,
  ]) {
    const pages = await builder.getAll(postType, {
      fields: `data.url`,
      options: { noTargeting: true },
      query: {
        $and: [
          {
            $or: [
              { startDate: { $exists: false } },
              { startDate: { $lte: Date.now() } },
            ],
          },
          {
            $or: [
              { endDate: { $exists: false } },
              { endDate: { $gte: Date.now() } },
            ],
          },
        ],
      },
    });
    pages.map((page) => paths.push(`${page?.data?.url}`));
  }
  return {
    paths,
    fallback: true,
  };
}

export default function Page({
  modelData,
  model,
  header,
  footer,
  recentPosts,
  list,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    setIsLive(!Builder.isEditing && !Builder.isPreviewing);
  }, []);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!modelData && isLive) {
    router.push('/404');
  }

  return (
    <>
      <NextSeo
        title={modelData?.title}
        description={modelData?.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: modelData?.title,
          description: modelData?.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/c_fit,w_1200,h_630/${modelData?.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: modelData?.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/${modelData?.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      <Layout header={header} footer={footer}>
        <BuilderComponent
          options={{ includeRefs: true }}
          model={model}
          content={modelData}
          context={{ recentPosts, modelData, list }}
        />
      </Layout>
    </>
  );
}
