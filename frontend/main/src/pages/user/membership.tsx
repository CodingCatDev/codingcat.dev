import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '@/layout/Layout';
import SettingsLinks from '@/components/settings/SettingsLinks';
import FirebaseSignin from '@/components/FirebaseSignin';

import { useState } from 'react';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';
import { useFunctions, useSigninCheck } from 'reactfire';
import { httpsCallable } from 'firebase/functions';

export default function Profile({ site }: { site: Site | null }): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();
  const functions = useFunctions();

  const [loading, setLoading] = useState(false);
  async function onStripePortal() {
    setLoading(true);
    const { url } = await (
      await httpsCallable<unknown, { url: string }>(
        functions,
        'ext-firestore-stripe-subscriptions-createPortalLink'
      ).call('params', { returnUrl: window.location.href })
    )?.data;
    window.location.assign(url);
  }

  return (
    <Layout site={site}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      {signInCheckResult?.signedIn === true ? (
        <section className="grid self-start justify-center gap-10 p-10 lg:grid-cols-settings">
          <section>
            <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
              Settings
            </h2>
            <SettingsLinks />
          </section>
          <div className="grid">
            <div>
              <p className="text-4xl">CodingCat.dev uses the Stripe Portal.</p>
              <p className="text-2xl">
                You will find all payment and subscription statuses by clicking
                the below button.
              </p>
              <button
                className="mt-4 btn-primary"
                onClick={() => onStripePortal()}
              >
                {loading ? 'Redirecting...' : 'Access Stripe Portal'}
              </button>
              <p className="mt-1">
                *Please note this will redirect you away from codingcat.dev.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <FirebaseSignin />
      )}
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
