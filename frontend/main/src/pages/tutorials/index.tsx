import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { NextSeo } from 'next-seo';
import { ModelType } from '@/models/builder.model';
import { getPaginated, Pagination } from '@/components/Pagination';
import dynamic from 'next/dynamic';
const CodingCatBuilder = dynamic(
  () =>
    import('@/components/builder/CodingCatBuilder').then((res) => res as any),
  { ssr: false }
) as any;

export async function getStaticProps({
  preview,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({
    preview,
    baseUrl: '/tutorials',
    model: ModelType.tutorial,
  });
}

export default function Blog({
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
        title="Tutorials | CodingCatDev"
        canonical={`https://codingcat.dev/tutorials`}
      ></NextSeo>
      <Layout header={header} footer={footer}>
        <CodingCatBuilder
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
