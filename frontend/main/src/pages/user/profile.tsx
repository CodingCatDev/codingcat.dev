import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '@/layout/Layout';
import SettingsLinks from '@/components/Settings/SettingsLinks';
import UserProfile from '@/components/Settings/UserProfile';

import { useUser } from '@/utils/auth/useUser';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';

import { SignIn } from '@codingcatdev/shared';

export default function Profile({ site }: { site: Site | null }): JSX.Element {
  const { user } = useUser();

  return (
    <Layout site={site}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      {user ? (
        <section className="grid self-start justify-center gap-10 p-10 lg:grid-cols-settings">
          <section>
            <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
              Settings
            </h2>
            <SettingsLinks />
          </section>
          <UserProfile />
        </section>
      ) : (
        <SignIn />
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
