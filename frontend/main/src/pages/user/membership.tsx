import Head from 'next/head';
import Layout from '@/layout/Layout';

import { Site } from '@/models/site.model';
import { getSite } from '@/services/sanity.server';
import UserMembershipDetail from '@/components/user/UserMembershipDetail';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

interface StaticParams {
  site: Site;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: await getSite({ preview }),
    },
    revalidate: 3600,
  };
};

export default function Membership({
  site,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout site={site}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      <UserMembershipDetail />
    </Layout>
  );
}
