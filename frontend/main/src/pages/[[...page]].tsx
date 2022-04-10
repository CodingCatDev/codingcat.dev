import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import {
  CodingCatBuilderContent,
  ModelType,
  Section,
  SectionLesson,
} from '@/models/builder.model';
import { getAllBuilder } from '@/services/builder.server';
import { useUser } from 'reactfire';
import useIsMember from '@/hooks/useIsMember';
import { UserInfoExtended } from '@/models/user.model';
import PostMediaLocked from '@/components/PostMediaLocked';
import AJ404 from '@/components/global/icons/AJ404';
import Link from 'next/link';

import dynamic from 'next/dynamic';
const CodingCatBuilder = dynamic(
  () =>
    import('@/components/builder/CodingCatBuilder').then((res) => res as any),
  { ssr: false }
) as any;

function getRecent(type: ModelType, preview?: boolean) {
  return getAllBuilder({
    preview,
    model: type,
    omit: 'data.blocks',
    limit: 3,
    startEnd: true,
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
  console.log('preview', preview);
  console.log('type', type);
  console.log('slug', slug);
  console.log('lesson', lesson);
  console.log('lessonPath', lessonPath);

  const model = slug ? type : 'page';
  console.log('model', model);

  const [
    header,
    footer,
    modelDataList,
    courseData,
    course,
    post,
    tutorial,
    podcast,
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
    type == ModelType.course && lesson
      ? getAllBuilder({
          preview,
          model: 'lesson',
          limit: 1,
          userAttributes: {
            urlPath: `/${lesson}/${lessonPath}`,
          },
          startEnd: true,
        })
      : // Lesson needs to remain locked so make sure to 404
      type == ModelType.lesson && !preview
      ? null
      : getAllBuilder({
          preview,
          model: slug ? type : 'page',
          limit: 1,
          userAttributes: {
            urlPath: '/' + (params?.page?.join('/') || ''),
          },
          startEnd: true,
        }),
    type == ModelType.course
      ? getAllBuilder({
          preview,
          model: 'course',
          omit: 'data.blocks',
          limit: 1,
          userAttributes: {
            urlPath: `/${type}/${slug}`,
          },
          startEnd: true,
        })
      : null,
    getRecent(ModelType.course, preview),
    getRecent(ModelType.post, preview),
    getRecent(ModelType.tutorial, preview),
    getRecent(ModelType.podcast, preview),
  ]);

  const cleanedCourseData = (c: any) => {
    const course = c?.[0] ? c[0] : null;
    if (!course) {
      return null;
    }
    return {
      ...course,
      data: {
        ...course?.data,
        sections: course?.data?.sections?.map((section: Section) => {
          return {
            ...section,
            lessons: section?.lessons
              ?.filter((l: any) => l?.lesson?.value?.published === 'published')
              .map((l: any) => {
                return {
                  title: l?.lesson?.value?.data?.page?.title || null,
                  url: l?.lesson?.value?.data?.url || null,
                };
              }),
          };
        }),
      },
    };
  };

  const modelData = modelDataList?.[0] ? modelDataList[0] : null;
  return {
    props: {
      modelData,
      model,
      lessonPath,
      type: slug,
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      recentPosts: {
        course: course || null,
        post: post || null,
        tutorial: tutorial || null,
        podcast: podcast,
      },
      courseData: cleanedCourseData(courseData),
      preview: preview ? preview : null,
    },
    revalidate: 300,
    notFound: modelData ? false : true,
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
    ModelType.authors,
  ]) {
    const pages = (await getAllBuilder({
      model: postType,
      fields: `data.url`,
      startEnd: true,
    })) as CodingCatBuilderContent[];
    pages
      .filter(
        (page) =>
          !['/blog', '/courses', '/podcasts', '/tutorials'].includes(
            `${page?.data?.url}`
          )
      )
      .map((page) => paths.push(`${page?.data?.url}`));
  }
  return {
    paths,
    fallback: true,
  };
}

export default function Page({
  modelData,
  model,
  lessonPath,
  header,
  footer,
  recentPosts,
  courseData,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <main className="flex items-center justify-center w-screen h-screen dark:bg-basics-700">
        <h1 className="m-2 text-basics-50">Fetching Purrfect Page...</h1>;
      </main>
    );
  }

  const UserWrapper = ({
    modelData,
    model,
    recentPosts,
    courseData,
  }: {
    modelData: any;
    model: string;
    recentPosts: any;
    courseData: any;
  }) => {
    const { data: user } = useUser();
    if (user)
      return (
        <MemberWrapper
          user={user}
          modelData={modelData}
          model={model}
          recentPosts={recentPosts}
          courseData={courseData}
        />
      );
    else return <PostMediaLocked />;
  };

  const MemberWrapper = ({
    user,
    modelData,
    model,
    recentPosts,
    courseData,
  }: {
    user: UserInfoExtended;
    modelData: any;
    model: string;
    recentPosts: any;
    courseData: any;
  }) => {
    const { member, team } = useIsMember(user);

    if (member || team) {
      return (
        <>
          <CodingCatBuilder
            options={{ includeRefs: true }}
            model={model}
            content={modelData}
            data={{
              recentPosts,
              modelData,
              user,
              team,
              member,
              courseData,
            }}
          />
        </>
      );
    } else {
      return <PostMediaLocked />;
    }
  };

  const BuilderWrapper = ({
    modelData,
    model,
    recentPosts,
    courseData,
  }: {
    modelData: any;
    model: string;
    recentPosts: any;
    courseData: any;
  }) => {
    return (
      <>
        <CodingCatBuilder
          options={{ includeRefs: true }}
          model={model}
          content={modelData}
          data={{
            recentPosts,
            modelData,
            courseData,
          }}
        />
      </>
    );
  };

  const getLayout = () => {
    // 404
    if (!modelData) {
      return (
        <main className="grid justify-center w-full grid-cols-1 gap-10 bg-primary-50 dark:bg-basics-700">
          <section className="grid content-start grid-cols-1 gap-10 p-4 text-center justify-items-center">
            <AJ404 />
            <h1 className="text-5xl lg:text-6xl">
              Uh oh, that page doesn&apos;t seem to exist.
            </h1>
            <h2 className="font-sans text-4xl lg:text-5xl">
              Were you looking for{' '}
              {/* add some logic here to say which route they clicked? */}
              <Link href="/courses">
                <a className="underline text-secondary-600">Courses</a>
              </Link>
            </h2>
          </section>
        </main>
      );
    }
    // // User Profile
    // if (['user'].includes(model)) {
    //   return <Profile products={products} />;
    // }
    //Lesson
    if (lessonPath && courseData?.data?.accessSettings?.accessMode != 'free') {
      return (
        <UserWrapper
          modelData={modelData}
          model={model}
          recentPosts={recentPosts}
          courseData={courseData}
        />
      );
    }
    //Any Page (including lesson preview)
    return (
      <BuilderWrapper
        modelData={modelData}
        model={model}
        recentPosts={recentPosts}
        courseData={courseData}
      />
    );
  };

  const pageData = modelData?.data?.page
    ? modelData?.data?.page
    : modelData?.data;

  return (
    <>
      <NextSeo
        title={pageData?.title}
        description={pageData?.excerpt}
        canonical={`https://codingcat.dev${router.asPath}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev${router.asPath}`,
          title: pageData?.title,
          description: pageData?.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/f_jpg,c_fit,w_1200,h_630/${pageData?.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: pageData?.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/f_jpg/${pageData?.coverPhoto?.public_id}`,
            },
          ],
        }}
      ></NextSeo>
      {preview && (
        <div
          style={{
            color: 'white',
            background: 'red',
            width: '100vw',
            textAlign: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          Preview Mode is on!
        </div>
      )}
      <Layout header={header} footer={footer}>
        {getLayout()}
      </Layout>
    </>
  );
}
