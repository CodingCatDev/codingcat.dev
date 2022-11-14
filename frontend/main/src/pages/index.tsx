import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { Post } from '@/models/post.model';
import Layout from '@/layout/Layout';

import AJPrimary from '@/components/global/icons/AJPrimary';
import { Site } from '@/models/site.model';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getSite } from '@/services/notion.server';
import { getRecent } from '@/services/notion.server';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import HomeDetail from '@/components/HomeDetails';

const Profile = dynamic(() => import('@/components/user/Profile'), {
  ssr: false,
});

interface StaticParams {
  site: Site;
  recentPosts: {
    [key: string]: Post[];
  };
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: getSite(),
      recentPosts: await getRecent({ preview }),
    },
    revalidate: 3600,
  };
};

const Home = ({
  site,
  recentPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="CodingCatDev"
        canonical={`https://codingcat.dev/`}
      ></NextSeo>
      <Layout site={site}>
        <div>
          {/* Hero */}
          <section className="grid justify-center grid-cols-1 p-8 mx-auto 2xl:gap-10 lg:grid-cols-2 lg:px-10 2xl:min-h-768 max-w-7xl">
            <section className="grid items-center content-center grid-cols-1 gap-4 mx-auto 2xl:mx-0 2xl:justify-self-end">
              <h1 className="pt-4 -mb-4 text-5xl leading-snug tracking-tight vertical-text-clip xl:tracking-wide xl:text-6xl xl:leading-snug 2xl:text-7xl 2xl:leading-snug">
                Purrfect
                <br />
                Web Tutorials
              </h1>
              <p className="font-sans text-2xl" style={{ maxWidth: `40ch` }}>
                Get the skills you need to become a better web developer today.
                High quality courses with projects to show off your new skills.
              </p>
            </section>
            <section className="grid grid-cols-1 row-start-1 -ml-10 lg:col-start-2 place-items-center 3xl:justify-items-start 3xl:ml-0">
              <AJPrimary className="w-1/2 max-w-xs lg:w-3/4 lg:max-w-md" />
            </section>
          </section>

          {/* <section className="grid justify-center grid-cols-1 p-4 mx-auto 2xl:gap-10 lg:px-10 2xl:min-h-768 max-w-7xl">
            <div className="relative z-10 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-center lg:text-4xl sm:text-3xl leading-tighter sm:max-w-[22ch] tracking-tight">
                Full Stack Courses for Busy Web Developers
              </p>
              <p className="pt-3 text-sm leading-tight text-center lg:text-lg sm:text-base">
                High-quality video tutorials made by expert developers in their
                field.
              </p>
            </div>

            <Link href="/user/profile">
              <a className="btn-primary justify-self-start" role="button">
                Join CodingCat.dev
              </a>
            </Link>
          </section> */}
          <section>
            <HomeDetail site={site} recentPosts={recentPosts} />
          </section>
        </div>
      </Layout>
    </>
  );
};
export default Home;
