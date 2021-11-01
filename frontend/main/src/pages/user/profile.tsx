import Head from 'next/head';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { getActiveMemberProducts, getSite } from '@/services/serversideApi';
import { StripeProduct } from '@/models/stripe.model';
import Profile from '@/components/user/Profile';

interface StaticParams {
  site: Site;
  products: StripeProduct[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: await getSite({ preview }),
      products: await getActiveMemberProducts(),
    },
    revalidate: 3600,
  };
};

export default function ProfilePage({
  site,
  products,
}: {
  site: Site | null;
  products: StripeProduct[];
}): JSX.Element {
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
