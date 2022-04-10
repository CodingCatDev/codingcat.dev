import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { CodingCatBuilderFramework } from '@/models/builder.model';
import { getAllBuilder, getAllQuery } from '@/services/builder.server';
import AJ404 from '@/components/global/icons/AJ404';
import Link from 'next/link';

import dynamic from 'next/dynamic';
const CodingCatBuilder = dynamic(
  () =>
    import('@/components/builder/CodingCatBuilder').then((res) => res as any),
  { ssr: false }
) as any;

export async function getStaticProps({
  params,
  preview,
}: GetStaticPropsContext<{ framework: string }>) {
  const framework = params?.framework;
  console.log('framework', framework);
  console.log('preview', preview);

  //Get the ID to search
  const frameworks = (await getAllQuery({
    model: 'framework',
    query: `query.data.slug=%2F${framework}`,
  })) as unknown as CodingCatBuilderFramework[];

  const frameworkData = frameworks?.[0] ? frameworks[0] : null;

  const [header, footer, modelDataList, course, tutorial, post, podcast] =
    await Promise.all([
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
      // Actual Design Page
      getAllBuilder({
        preview,
        model: 'page',
        limit: 1,
        userAttributes: {
          urlPath: '/frameworks',
        },
      }),
      // All Model types with this data
      getAllQuery({
        model: 'course',
        query: `query.data.page.frameworks.framework.id=${frameworkData?.id}`,
        omit: `data.blocks`,
      }) as unknown as CodingCatBuilderFramework[],
      getAllQuery({
        model: 'tutorial',
        query: `query.data.page.frameworks.framework.id=${frameworkData?.id}`,
        omit: `data.blocks`,
      }) as unknown as CodingCatBuilderFramework[],
      getAllQuery({
        model: 'post',
        query: `query.data.page.frameworks.framework.id=${frameworkData?.id}`,
        omit: `data.blocks`,
      }) as unknown as CodingCatBuilderFramework[],
      getAllQuery({
        model: 'podcast',
        query: `query.data.page.frameworks.framework.id=${frameworkData?.id}`,
        omit: `data.blocks`,
      }) as unknown as CodingCatBuilderFramework[],
    ]);
  const modelData = modelDataList?.[0] ? modelDataList[0] : null;

  return {
    props: {
      modelData,
      data: {
        framework,
        course: course || null,
        post: post || null,
        tutorial: tutorial || null,
        podcast: podcast,
      },
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      preview: preview ? preview : null,
    },
    revalidate: 300,
    notFound: modelData ? false : true,
  };
}

export async function getStaticPaths() {
  const frameworks = (await getAllBuilder({
    model: 'framework',
    fields: `data.slug`,
    startEnd: true,
  })) as CodingCatBuilderFramework[];
  const paths = frameworks.map((page) => {
    return { params: { framework: `${page?.data?.slug.replace('/', '')}` } };
  });
  console.log('paths', JSON.stringify(paths));
  return {
    paths,
    fallback: true,
  };
}

export default function Page({
  modelData,
  data,
  header,
  footer,
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
    //Any Page (including lesson preview)
    return <CodingCatBuilder content={modelData} model="page" data={data} />;
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
