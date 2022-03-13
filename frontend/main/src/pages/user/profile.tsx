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
        urlPath: '/user/profile',
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

export default function UserProfile({
  modelData,
  model,
  header,
  footer,
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={modelData?.title}
        description={modelData?.excerpt}
        canonical={`https://codingcat.dev/user/profile`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/user/profile',
          title: 'User Profile',
          description: 'User Profile',
          site_name: 'CodingCat.dev User Profile',
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
        {products ? (
          <Profile products={products} />
        ) : (
          <>Ask Alex to load the Stripe products please :D</>
        )}
      </Layout>
    </>
  );
}
