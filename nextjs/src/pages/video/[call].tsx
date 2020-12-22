import Head from 'next/head';
import Layout from '@/layout/Layout';
import { useState } from 'react';
import { withRouter } from 'next/router';
import CopyButton from '@/components/common/CopyButton';
import dynamic from 'next/dynamic';

const VideoCall = dynamic(() => import('@/components/video/VideoCall'), {
  ssr: false,
});

export default withRouter(({ router }) => {
  const [callName, setCallName] = useState('CodingCatChat');

  return (
    <Layout>
      <Head>
        <title>Video | CodingCatDev</title>
      </Head>
      <VideoCall />
    </Layout>
  );
});
