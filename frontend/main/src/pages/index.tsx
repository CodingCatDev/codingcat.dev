import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { postsRecentService } from '@/services/serversideApi';
import { RecentPostsCards } from '@/components/RecentPostsCards';
import { Post, PostType } from '@/models/post.model';
import Layout from '@/layout/Layout';
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
      <section className="grid content-center gap-10 justify-self-center">
        <h1 className="pt-8 text-5xl tracking-tight vertical-text-clip xl:tracking-wide sm:text-7xl lg:text-6xl 2xl:text-7xl">
          Purrfect
          <br />
          Web Tutorials
        </h1>
        <p
          className="font-light sm:text-2xl lg:text-xl xl:text-2xl"
          style={{ maxWidth: `40ch` }}
        >
          Get the skills you need to become a better web developer today. High
          quality courses with custom certificates and projects to show off your
          new skills.
        </p>
        <div className="grid grid-flow-col gap-2">
          <Link href="/user/profile">
            <a
              className="btn-secondary justify-self-end"
              role="button"
            >
              Start Now
            </a>
          </Link>
          <Link href="/user/pro">
            <a className="btn-primary justify-self-start" role="button">
              Go Pro
            </a>
          </Link>
        </div>
      </section>
      {/* COURSES */}
      <BreakBarLeft>
        <Skills />
      </BreakBarLeft>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
          Latest Courses
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts[PostType.course]} />
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
        <h3 className="absolute w-full text-2xl text-center text-basics-050 sm:text-4xl lg:text-4xl">
          Learn with AJ and KC
        </h3>
        <KCAlt className="w-14 sm:w-14 md:w-20" />
      </BreakBarRight>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-right text-primary-900 lg:text-5xl">
          Latest Tutorials
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts[PostType.tutorial]} />
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
          <h3 className="absolute w-full text-2xl text-center left-6 sm:left-8 md:left-0 text-basics-050 sm:text-3xl lg:text-4xl">
            Read what's going on in web dev
          </h3>
        </div>
      </BreakBarLeft>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
          Blog Posts
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts[PostType.post]} />
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
          <h3 className="absolute w-full text-2xl text-center right-6 sm:right-8 md:right-0 text-basics-050 sm:text-3xl lg:text-4xl">
            Listen to the latest tech news
          </h3>
          <Podcasts className="w-16 sm:w-16 md:w-20" />
        </div>
      </BreakBarRight>
      <section className="grid gap-10 px-10">
        <h2 className="mt-4 text-4xl text-right text-primary-900 lg:text-5xl">
          Latest Podcasts
        </h2>
        <div className="grid grid-cols-fit">
          <RecentPostsCards recentPosts={recentPosts[PostType.podcast]} />
        </div>
        <Link href="/podcasts">
          <a className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Podcasts
            </button>
          </a>
        </Link>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const recentPosts = await postsRecentService([
    PostType.course,
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
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
