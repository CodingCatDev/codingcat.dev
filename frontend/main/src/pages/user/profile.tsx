import Head from 'next/head';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { StripeProduct } from '@/models/stripe.model';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
const Profile = dynamic(() => import('@/components/user/Profile'), {
  ssr: false,
});
import { getSite } from '@/services/notion.server';
import dynamic from 'next/dynamic';

interface StaticParams {
  site: Site;
  products: StripeProduct[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: getSite(),
      // products: await getActiveMemberProducts(),
      products: [],
    },
    revalidate: 3600,
  };
};

export default function ProfilePage({
  site,
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      <Layout site={site}>
        <Profile products={products} />
      </Layout>
    </>
  );
}
