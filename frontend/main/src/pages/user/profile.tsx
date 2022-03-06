import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { getAllBuilder } from '@/services/builder.server';
import { NextSeo } from 'next-seo';
import { CodingCatBuilderContent } from '@/models/builder.model';
import PostsCards from '@/components/PostsCards';
import { BuilderComponent } from '@builder.io/react';
import { getActiveMemberProducts } from '@/services/firebase.server';
import Profile from '@/components/user/Profile';

export async function getStaticProps({
  preview,
}: GetStaticPropsContext<{ page: string[] }>) {
  const [header, footer, modelData, products] = await Promise.all([
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
    getActiveMemberProducts(),
  ]);

  return {
    props: {
      modelData: modelData?.[0] ? modelData[0] : null,
      model: 'page',
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      products: products ? products : null,
    },
    revalidate: 3600,
  };
}

export default function Blog({
  modelData,
  model,
  header,
  footer,
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Profile | CodingCatDev"
        canonical={`https://codingcat.dev/user/profile`}
      ></NextSeo>
      <Layout header={header} footer={footer}>
        {products ? (
          <Profile products={products} />
        ) : (
          <>Ask Alex to load the Stripe products please :D</>
        )}
      </Layout>
    </>
  );
}
