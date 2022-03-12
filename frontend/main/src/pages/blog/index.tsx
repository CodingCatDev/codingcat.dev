import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { NextSeo } from 'next-seo';
import { BuilderComponent } from '@builder.io/react';
import { getPaginated, Pagination } from '@/components/Pagination';

export async function getStaticProps({
  preview,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({ preview, baseUrl: '/blog' });
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
        title="Blog | CodingCatDev"
        canonical={`https://codingcat.dev/blog`}
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
