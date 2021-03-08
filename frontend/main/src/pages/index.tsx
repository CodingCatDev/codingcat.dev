import Head from 'next/head';
import Link from 'next/link';

import { getSite, postsRecentService } from '@/services/serversideApi';
import PostsCards from '@/components/PostsCards';
import { Post, PostType } from '@/models/post.model';
import Layout from '@/layout/Layout';
import BreakBarLeft from '@/components/home/BreakBarLeft';
import BreakBarRight from '@/components/home/BreakBarRight';

import Skills from '@/components/home/Skills';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import KCAlt from '@/components/global/icons/KCAlt';
import AJHeartAlt from '@/components/global/icons/AJHeartAlt';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import AJPrimary from '@/components/global/icons/AJPrimary';
import { Site } from '@/models/site.model';

export default function Home({
  site,
  recentPosts,
}: {
  site: Site | null;
  recentPosts: {
    [key: string]: Post[];
  };
}): JSX.Element {
  return (
    <Layout site={site}>
      <Head>
        <title>CodingCatDev</title>
      </Head>
      {/* Hero */}
      <section className="grid justify-center grid-cols-1 p-8 mx-auto 2xl:gap-10 lg:grid-cols-2 lg:px-10 2xl:min-h-768 max-w-7xl">
        <section className="grid items-center content-center grid-cols-1 gap-4 mx-auto 2xl:mx-0 2xl:justify-self-end">
          <h1 className="pt-4 -mb-4 text-5xl leading-snug tracking-tight vertical-text-clip xl:tracking-wide xl:text-6xl xl:leading-snug 2xl:text-7xl 2xl:leading-snug">
            Purrfect
            <br />
            Web Tutorials
          </h1>
          <p className="font-sans 2xl:text-2xl" style={{ maxWidth: `40ch` }}>
            Get the skills you need to become a better web developer today. High
            quality courses with custom certificates and projects to show off
            your new skills.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses">
              <a className="btn-secondary justify-self-end" role="button">
                Start Now
              </a>
            </Link>
            <Link href="/membership">
              <a className="btn-primary justify-self-start" role="button">
                Join CodingCat.dev
              </a>
            </Link>
          </div>
        </section>
        <section className="grid grid-cols-1 row-start-1 -ml-10 lg:col-start-2 place-items-center 3xl:justify-items-start 3xl:ml-0">
          <AJPrimary className="w-1/2 max-w-xs lg:w-3/4 lg:max-w-md" />
        </section>
      </section>
      {/* COURSES */}
      <BreakBarLeft>
        <Skills />
      </BreakBarLeft>
      <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
        <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
          Latest Courses
        </h2>
        {/* <div className="grid gap-4 grid-cols-fit"> */}
        <PostsCards posts={recentPosts[PostType.course]} />
        {/* </div> */}
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
        <h3 className="absolute w-1/2 text-2xl text-center sm:left-0 sm:w-full left-1/4 text-basics-50 dark:text-basics-50 sm:text-4xl lg:text-4xl">
          Learn with AJ and KC
        </h3>
        <KCAlt className="w-14 sm:w-14 md:w-20" />
      </BreakBarRight>
      <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
        <h2 className="mt-4 text-4xl text-right text-primary-900 lg:text-5xl">
          Latest Tutorials
        </h2>
        <div className="grid gap-4 grid-cols-fit">
          <PostsCards posts={recentPosts[PostType.tutorial]} />
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
          <h3 className="absolute w-3/4 ml-4 text-2xl text-center sm:left-0 sm:w-full left-16 text-basics-50 dark:text-basics-50 sm:text-4xl md:text-2xl lg:text-4xl">
            Read what&#39;s going on in web dev
          </h3>
        </div>
      </BreakBarLeft>
      <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
        <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
          Blog Posts
        </h2>
        {/* <div className="grid gap-4 grid-cols-fit"> */}
        <PostsCards posts={recentPosts[PostType.post]} />
        {/* </div> */}
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
          <h3 className="absolute left-0 w-3/4 ml-4 text-2xl text-center sm:w-full text-basics-50 dark:text-basics-50 sm:text-3xl md:text-3xl lg:text-4xl">
            Listen to the latest tech news
          </h3>
          <Podcasts className="w-16 sm:w-16 md:w-20" />
        </div>
      </BreakBarRight>
      <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
        <h2 className="mt-4 text-4xl text-right text-primary-900 lg:text-5xl">
          Latest Podcasts
        </h2>
        {/* <div className="grid gap-4 grid-cols-fit"> */}
        <PostsCards posts={recentPosts[PostType.podcast]} />
        {/* </div> */}
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

export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
    recentPosts: {
      [key: string]: Post[];
    };
  };
  revalidate: number;
}> {
  const site = await getSite();

  const recentPosts = await postsRecentService([
    PostType.course,
    PostType.post,
    PostType.tutorial,
    PostType.podcast,
  ]);
  return {
    props: {
      site,
      recentPosts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
