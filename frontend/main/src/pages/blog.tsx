import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { getAllBuilder } from '@/services/builder.server';
import { NextSeo } from 'next-seo';
import { CodingCatBuilderContent } from '@/models/builder.model';
import PostsCards from '@/components/PostsCards';
import { BuilderComponent } from '@builder.io/react';

export async function getStaticProps({
  preview,
}: GetStaticPropsContext<{ page: string[] }>) {
  const [header, footer, modelData, list] = await Promise.all([
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
    getAllBuilder({
      preview,
      model: 'page',
      limit: 1,
      userAttributes: {
        urlPath: '/blog',
      },
    }),
    getAllBuilder({
      preview,
      model: 'post',
      omit: 'data.blocks',
      limit: 10000,
    }) as Promise<CodingCatBuilderContent[]>,
  ]);

  return {
    props: {
      modelData: modelData?.[0] ? modelData[0] : null,
      model: 'page',
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      list: list ? list : null,
    },
    revalidate: 3600,
  };
}

export default function Blog({
  modelData,
  model,
  header,
  footer,
  list,
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
      </Layout>
    </>
  );
}
