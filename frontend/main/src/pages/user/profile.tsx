import Layout from '@/layout/Layout';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { getAllBuilder } from '@/services/builder.server';
import { NextSeo } from 'next-seo';
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
      startEnd: true,
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
  const pageData = modelData?.data?.page
    ? modelData?.data?.page
    : modelData?.data;
  return (
    <>
      <NextSeo
        title={pageData?.title}
        description={pageData?.excerpt}
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
      <Layout header={header} footer={footer}>
        {products ? (
          <div className="flex flex-col p-10">
            <div className="pb-2">
              <Profile products={products} />
            </div>
          </div>
        ) : (
          <>Ask Alex to load the Stripe products please :D</>
        )}
      </Layout>
    </>
  );
}
