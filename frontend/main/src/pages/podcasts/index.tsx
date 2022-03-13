import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { NextSeo } from 'next-seo';
import { ModelType } from '@/models/builder.model';
import { BuilderComponent } from '@builder.io/react';
import { getPaginated, Pagination } from '@/components/Pagination';

export async function getStaticProps({
  preview,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({
    preview,
    baseUrl: '/podcasts',
    model: ModelType.podcast,
  });
}

export default function Podcasts({
  modelData,
  model,
  header,
  footer,
  list,
  baseUrl,
  pageNumber,
  showNext,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Purrfect Podcasts"
        description="Purrfect Podcasts"
        canonical={`https://codingcat.dev/podcasts`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/podcasts',
          title: 'Purrfect Podcasts',
          description: 'Purrfect Podcasts about development.',
          site_name: 'Purrfect.dev',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/c_thumb,w_1200,h_630/main-codingcatdev-photo/purrfect.dev.png',
              width: 1200,
              height: 630,
              alt: 'AJ Logo Black Cat Face with Purrfect.dev Domain',
            },
            {
              url: 'https://media.codingcat.dev/image/upload/main-codingcatdev-photo/purrfect.dev.png',
            },
          ],
        }}
      ></NextSeo>
      <Layout header={header} footer={footer}>
        <BuilderComponent
          options={{ includeRefs: true }}
          model={model}
          content={modelData}
          data={{
            modelData,
            list,
          }}
        />
        <Pagination
          list={list}
          baseUrl={baseUrl}
          pageNumber={pageNumber as number}
          showNext={showNext}
        />
      </Layout>
    </>
  );
}