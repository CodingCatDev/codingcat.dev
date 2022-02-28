import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { BuilderComponent, Builder, builder } from '@builder.io/react';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { CodingCatBuilderContent, ModelType } from '@/models/builder.model';
import { getActiveMemberProducts } from '@/services/firebase.server';
import { getAllBuilder } from '@/services/builder.server';

function getRecent(type: ModelType, preview?: boolean) {
  return getAllBuilder({
    preview,
    model: type,
    omit: 'data.blocks',
    limit: 3,
  }) as Promise<CodingCatBuilderContent[]>;
}

function getList(type: string, preview?: boolean) {
  let singular = type === 'blog' ? 'post' : type.slice(0, -1);
  console.log('getAll: ', singular);
  return getAllBuilder({
    preview,
    model: type,
    omit: 'data.blocks',
    limit: 10000,
  }) as Promise<CodingCatBuilderContent[]>;
}

export async function getStaticProps({
  params,
  preview,
}: GetStaticPropsContext<{ page: string[] }>) {
  let type = (params?.page?.[0] as ModelType) || '';
  let slug = (params?.page?.[1] as string) || '';
  let lesson = (params?.page?.[2] as string) || '';
  let lessonPath = (params?.page?.[3] as string) || '';

  console.log('params:', '/' + (params?.page?.join('/') || ''));

  const isList = ['courses', 'pages', 'podcasts', 'blog', 'tutorials'].includes(
    type
  );
  console.log('preview', preview);
  console.log('course', type == ModelType.course);
  const [
    header,
    footer,
    modelData,
    courseData,
    course,
    post,
    tutorial,
    podcast,
    list,
    products,
  ] = await Promise.all([
    getAllBuilder({
      preview,
      model: 'header',
      limit: 1,
    }),
    getAllBuilder({
      preview,
      model: 'footer',
      limit: 1,
    }),
    type == ModelType.course
      ? getAllBuilder({
          preview,
          model: 'lesson',
          limit: 1,
          userAttributes: {
            urlPath: `/${lesson}/${lessonPath}`,
          },
        })
      : getAllBuilder({
          preview,
          model: slug ? type : 'page',
          limit: 1,
          userAttributes: {
            urlPath: '/' + (params?.page?.join('/') || ''),
          },
        }),
    type == 'course'
      ? getAllBuilder({
          preview,
          model: 'course',
          omit: 'data.blocks',
          limit: 1,
          userAttributes: {
            urlPath: `/${type}/${slug}`,
          },
        })
      : null,
    isList ? null : getRecent(ModelType.course, preview),
    isList ? null : getRecent(ModelType.post, preview),
    isList ? null : getRecent(ModelType.tutorial, preview),
    isList ? null : getRecent(ModelType.podcast, preview),
    isList ? getList(type, preview) : null,
    ['user'].includes(type) ? getActiveMemberProducts() : [],
  ]);

  const cleanedCourseData = (c: any) => {
    // if (c?.[0]?.data?.sections) {
    //   const data = c[0].data.sections.map((section: any) =>
    //     section?.lessons?.map((lesson: any) => {
    //       console.log(lesson?.value?.data?.block);
    //       return lesson;
    //     })
    //   );
    //   return data[0];
    // } else {
    //   null;
    // }
    console.log(c?.[0]); //TODO - remove blocks
    return c?.[0] ? c[0] : null;
  };

  return {
    props: {
      modelData: modelData?.[0] ? modelData[0] : null,
      model: slug ? type : 'page',
      type: slug,
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      recentPosts: {
        course: course || null,
        post: post || null,
        tutorial: tutorial || null,
        podcast: podcast,
      },
      list,
      products,
      courseData: cleanedCourseData(courseData),
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
  products,
  courseData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    console.log(courseData);
    console.log(modelData);
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
      <Layout
        header={header}
        footer={footer}
        modelData={modelData}
        model={model as ModelType}
        recentPosts={recentPosts}
        list={list}
        products={products}
        courseData={courseData}
      />
    </>
  );
}
