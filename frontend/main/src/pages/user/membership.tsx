import Head from 'next/head';
import Layout from '@/layout/Layout';

import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';
import UserMembershipDetail from '@/components/user/UserMembershipDetail';

export default function Membership({
  site,
}: {
  site: Site | null;
}): JSX.Element {
  return (
    <Layout site={site}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      <UserMembershipDetail />
    </Layout>
  );
}
export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
  };
  revalidate: number;
}> {
  const site = await getSite();
  return {
    props: {
      site,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 60, // In seconds
  };
}
