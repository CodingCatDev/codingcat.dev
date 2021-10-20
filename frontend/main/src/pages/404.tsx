import { NextSeo } from 'next-seo';
import Link from 'next/link';
import AJ404 from '@/components/global/icons/AJ404';

import { getSite } from '@/services/serversideApi';
import { Post } from '@/models/post.model';
import Layout from '@/layout/Layout';

import { Site } from '@/models/site.model';

export default function Custom404({
  site,
}: {
  site: Site | null;
  recentPosts: {
    [key: string]: Post[];
  };
}): JSX.Element {
  return (
    <>
      <NextSeo title="404 | Not Found"></NextSeo>

      <Layout site={site}>
        <section className="grid content-start grid-cols-1 gap-10 p-4 text-center justify-items-center">
          <AJ404 />
          <h1 className="text-5xl lg:text-6xl">
            Uh oh, that page doesn&apos;t seem to exist.
          </h1>
          <h2 className="font-sans text-4xl lg:text-5xl">
            Were you looking for{' '}
            {/* add some logic here to say which route they clicked? */}
            <Link href="/courses">
              <a className="underline text-secondary-600">Courses</a>
            </Link>
          </h2>
        </section>
      </Layout>
    </>
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
