import Head from 'next/head';
import dynamic from 'next/dynamic';

const ProfileCard = dynamic(() => import('@/components/User/ProfileCard'), {
  ssr: false,
  loading: () => <p>Chasing my tail..</p>,
});

export default function Profile() {
  return (
    <div>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-2 place-items-auto mt-20 mx-16">
        <div className="col-span-1 lg:col-span-6">
          <ProfileCard />
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
