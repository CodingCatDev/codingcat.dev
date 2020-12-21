import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '@/layout/Layout';
import SettingsLinks from '@/components/Settings/SettingsLinks';
import UserProfile from '@/components/Settings/UserProfile';

const ProfileCard = dynamic(() => import('@/components/User/ProfileCard'), {
  ssr: false,
  loading: () => <p>Chasing my tail..</p>,
});

export default function Profile() {
  return (
    <Layout>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      {/* <ProfileCard /> */}
      <section className="grid self-start justify-center gap-10 p-10 lg:grid-cols-settings">
        <section>
          <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
            Settings
          </h2>
          <SettingsLinks />
        </section>
        <UserProfile />
      </section>
    </Layout>
  );
}
