import { NextSeo } from 'next-seo';
import Link from 'next/link';
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

interface StaticParams {
  site: Site;
  recentPosts: {
    [key: string]: Post[];
  };
}

const HomeDetail = ({ site, recentPosts }: StaticParams) => {
  return (
    <>
      <div>
        {/* COURSES */}
        <BreakBarLeft>
          <Skills />
        </BreakBarLeft>
        <section className="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10">
          <h2 className="mt-4 text-4xl light:text-primary-900 lg:text-5xl">
            Latest Courses
          </h2>
          <PostsCards posts={recentPosts[PostType.course]} />
          <Link href="/courses" className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Courses
            </button>
          </Link>
        </section>
        {/* TUTORIALS */}
        <BreakBarRight>
          <AJLogoLeft className="w-16 sm:w-16 md:w-20" />
          <h3 className="absolute w-1/2 text-2xl text-center sm:left-0 sm:w-full left-1/4 text-basics-50 sm:text-4xl lg:text-4xl">
            Learn with AJ and KC
          </h3>
          <KCAlt className="w-14 sm:w-14 md:w-20" />
        </BreakBarRight>
        <section className="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10">
          <h2 className="mt-4 text-4xl text-right light:text-primary-900 lg:text-5xl">
            Latest Tutorials
          </h2>
          <PostsCards posts={recentPosts[PostType.tutorial]} />
          <Link href="/tutorials" className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Tutorials
            </button>
          </Link>
        </section>
        {/* BLOG */}
        <BreakBarLeft>
          <div className="relative flex items-center w-full">
            <AJHeartAlt className="w-16 sm:w-16 md:w-20" />
            <h3 className="absolute w-3/4 ml-4 text-2xl text-center sm:left-0 sm:w-full left-16 text-basics-50 sm:text-4xl md:text-2xl lg:text-4xl">
              Read what&#39;s going on in web dev
            </h3>
          </div>
        </BreakBarLeft>
        <section className="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10">
          <h2 className="mt-4 text-4xl light:text-primary-900 lg:text-5xl">
            Blog Posts
          </h2>
          <PostsCards posts={recentPosts[PostType.post]} />
          <Link href="/blog" className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Posts
            </button>
          </Link>
        </section>
        {/* PODCASTS */}
        <BreakBarRight>
          <div className="relative flex items-center justify-end w-full">
            <h3 className="absolute left-0 w-3/4 ml-4 text-2xl text-center sm:w-full text-basics-50 sm:text-3xl md:text-3xl lg:text-4xl">
              Listen to the latest tech news
            </h3>
            <Podcasts className="w-16 sm:w-16 md:w-20" />
          </div>
        </BreakBarRight>
        <section className="grid w-full gap-10 px-4 mx-auto mb-4 xl:px-10">
          <h2 className="mt-4 text-4xl text-right light:text-primary-900 lg:text-5xl">
            Latest Podcasts
          </h2>
          <PostsCards posts={recentPosts[PostType.podcast]} />
          <Link href="/podcasts" className="justify-self-center">
            <button className="btn-primary" type="button">
              View All Podcasts
            </button>
          </Link>
        </section>
      </div>
    </>
  );
};
export default HomeDetail;
