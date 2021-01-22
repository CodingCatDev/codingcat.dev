import Head from 'next/head';
import Layout from '@/layout/Layout';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';

const Call = dynamic(() => import('@/components/video/VideoCall'), {
  ssr: false,
});

export default function VideoCall({
  site,
}: {
  site: Site | null;
}): JSX.Element {
  const [callName, setCallName] = useState('CodingCatChat');

  return (
    <Layout site={site}>
      <Head>
        <title>Video | CodingCatDev</title>
      </Head>
      <Call />
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
    revalidate: 60,
  };
}
