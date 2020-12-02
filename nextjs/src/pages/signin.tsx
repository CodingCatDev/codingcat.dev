import Head from 'next/head';
import dynamic from 'next/dynamic';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function Signin() {
  return (
    <div>
      <Head>
        <title>Signin | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <FirebaseAuth />
      </main>

      <footer></footer>
    </div>
  );
}
