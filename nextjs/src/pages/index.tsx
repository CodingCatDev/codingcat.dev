import Head from 'next/head';
import Link from 'next/link';

// import dynamic from 'next/dynamic';

import { postsRecentService } from '@/services/serversideApi';
import { RecentPostsCards } from '@/components/RecentPostsCards';
import { Post } from '@/models/post.model';
import Layout from '@/layout/Layout';
import Intro from '@/components/Home/Intro';
import BreakBarLeft from '@/components/Home/BreakBarLeft';
import BreakBarRight from '@/components/Home/BreakBarRight';

import Skills from '@/components/Home/Skills';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import KCAlt from '@/components/global/icons/KCAlt';
import AJHeartAlt from '@/components/global/icons/AJHeartAlt';
import Podcasts from '../components/global/icons/nav/Podcasts';

export default function Home({
  recentPosts,
}: {
  recentPosts: {
    [key: string]: Post[];
  };
}) {
  return (
    <Layout>
      <Head>
        <title>CodingCatDev</title>
      </Head>
      {/* <div
          className="col-span-full"
          style={{
            backgroundImage: 'url(/static/images/drip.svg)',
            backgroundPosition: '4rem -1rem',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        > */}
      <Intro />
      {/* </div> */}
      {/* COURSES */}
      <BreakBarLeft>
        <Skills />
      </BreakBarLeft>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl lg:text-5xl text-ccd-purples-900">
          Latest Courses
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts['courses']} />
        </div>
        <Link href="/courses">
          <a className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Courses
            </button>
          </a>
        </Link>
      </section>
      {/* TUTORIALS */}
      <BreakBarRight>
        <AJLogoLeft className="w-16 sm:w-16 md:w-20" />
        <h3 className="absolute w-full text-2xl text-center text-ccd-basics-050 sm:text-4xl lg:text-4xl">
          Learn with AJ and KC
        </h3>
        <KCAlt className="w-14 sm:w-14 md:w-20" />
      </BreakBarRight>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-right lg:text-5xl text-ccd-purples-900">
          Latest Tutorials
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts['tutorials']} />
        </div>
        <Link href="/tutorials">
          <a className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Tutorials
            </button>
          </a>
        </Link>
      </section>
      {/* BLOG */}
      <BreakBarLeft>
        <div className="relative flex items-center w-full">
          <AJHeartAlt className="w-16 sm:w-16 md:w-20" />
          <h3 className="absolute w-full text-2xl text-center left-6 sm:left-8 md:left-0 text-ccd-basics-050 sm:text-3xl lg:text-4xl">
            Read what's going on in web dev
          </h3>
        </div>
      </BreakBarLeft>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl lg:text-5xl text-ccd-purples-900">
          Blog Posts
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts['post']} />
        </div>
        <Link href="/blog">
          <a className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Posts
            </button>
          </a>
        </Link>
      </section>
      {/* PODCASTS */}
      <BreakBarRight>
        <div className="relative flex items-center justify-end w-full">
          <h3 className="absolute w-full text-2xl text-center right-6 sm:right-8 md:right-0 text-ccd-basics-050 sm:text-3xl lg:text-4xl">
            Listen to the latest tech news
          </h3>
          <Podcasts className="w-16 sm:w-16 md:w-20" />
        </div>
      </BreakBarRight>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-right lg:text-5xl text-ccd-purples-900">
          Latest Podcasts
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts['podcasts']} />
        </div>
        <Link href="/podcasts">
          <a className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Podcasts
            </button>
          </a>
        </Link>
      </section>
      `
    </Layout>
  );
}

export async function getStaticProps() {
  const recentPosts = await postsRecentService([
    'courses',
    'post',
    'tutorials',
    'podcasts',
  ]);
  return {
    props: {
      recentPosts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
