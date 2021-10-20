import Head from 'next/head';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { getActiveMemberProducts, getSite } from '@/services/serversideApi';
import { StripeProduct } from '@/models/stripe.model';
import Profile from '@/components/user/Profile';

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
export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
    products: StripeProduct[];
  };
  revalidate: number;
}> {
  const site = await getSite();
  const products = await getActiveMemberProducts();
  return {
    props: {
      site,
      products,
    },
    revalidate: 3600,
  };
}
