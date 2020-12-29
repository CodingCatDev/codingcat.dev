import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '@/layout/Layout';
import { useUser } from '@/utils/auth/useUser';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

const ProfileCard = dynamic(() => import('@/components/User/ProfileCard'), {
  ssr: false,
  loading: () => <p>Chasing my tail..</p>,
});

export default function Profile({
  handleThemeChange,
  darkMode,
}: {
  handleThemeChange: any;
  darkMode: boolean;
}) {
  const { user, signout }: { user: any; signout: any } = useUser();

  return (
    <Layout handleThemeChange={handleThemeChange} darkMode={darkMode}>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      {user ? <ProfileCard /> : <FirebaseAuth />}
    </Layout>
  );
}
