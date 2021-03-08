import Head from 'next/head';
import Error from 'next/error';

import { getSite } from '@/services/serversideApi';
import { Post } from '@/models/post.model';
import Layout from '@/layout/Layout';

import { Site } from '@/models/site.model';

export default function Home({
  site,
}: {
  site: Site | null;
  recentPosts: {
    [key: string]: Post[];
  };
}): JSX.Element {
  return (
    <Layout site={site}>
      <Head>
        <title>404 | CodingCatDev</title>
      </Head>
      <section className="grid justify-items-center place-items-center">
        <h1>404 | This page could not be found</h1>
      </section>
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
    revalidate: 3600,
  };
}
