import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import UserMembership from '@/components/user/UserMembership';

import { getActiveMemberProducts, getSite } from '@/services/serversideApi';
import { StripeProduct } from '@/models/stripe.model';
import { Site } from '@/models/site.model';
import { useSigninCheck } from 'reactfire';
import FirebaseSignin from '@/components/FirebaseSignin';

export default function Membership({
  site,
  products,
}: {
  site: Site | null;
  products: StripeProduct[];
}): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();

  return (
    <>
      <NextSeo
        title="Membership | CodingCatDev"
        canonical={`https://codingcat.dev/membership/`}
      ></NextSeo>

      <Layout site={site}>
        {signInCheckResult?.signedIn === true && signInCheckResult.user ? (
          <UserMembership user={signInCheckResult.user} products={products} />
        ) : (
          <div className="relative z-0 w-full mx-auto lg:w-1/2">
            <div className="overflow-hidden rounded-b shadow-lg text-basics-50 dark:text-basics-50 bg-primary-800 dark:bg-primary-800 md:rounded-b-none md:rounded-r">
              <div className="p-4 text-xl tracking-wide text-center uppercase border-b border-primary-100 dark:border-primary-100">
                Create account by signing in with one below.
              </div>
              <FirebaseSignin />
            </div>
          </div>
        )}
      </Layout>
      <style global jsx>{`
        .firebaseui-tos {
          color: #fbfbfb;
        }
        .firebaseui-tos > a {
          color: #ee9cbe;
        }
      `}</style>
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
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 3600, // In seconds
  };
}
