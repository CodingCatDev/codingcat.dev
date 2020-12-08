import Head from 'next/head';
import Link from 'next/link';

import { postsRecentService } from '@/services/serversideApi';
import RecentPostsCards from '@/components/RecentPostsCards';
import Intro from '@/components/Home/Intro';
import Layout from '../layout/Layout';

import {
  React,
  Angular,
  Vue,
  Svelte,
  CSS,
  HTML,
} from '@/components/global/icons/VendorLogos';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import KCLogo from '@/components/global/icons/KCLogo';
import AJHeartAlt from '@/components/global/icons/AJHeartAlt';
import AJHeadphones from '@/components/global/icons/AJHeadphones';

export default function Home({ recentPosts }) {
  return (
    <Layout>
      <Head>
        <title>CodingCatDev</title>
      </Head>
      <div className="bg-ccd-purples-050 sm::max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
        <div
          className="col-span-full"
          style={{
            backgroundImage: 'url(/static/images/drip.svg)',
            backgroundPosition: '4rem -1rem',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Intro />
        </div>
        <div className="col-span-full">
          <div className="static flex flex-col justify-center w-full h-20 px-2 md:h-32 vertical-clip">
            {
              <div className="flex content-center justify-between px-8">
                <React className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
                <Angular className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
                <Vue className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
                <Svelte className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
                <CSS className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
                <HTML className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 " />
              </div>
            }
          </div>
          <div
            className="w-8 h-8 ml-8 text-ccd-reds-900"
            style={{
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderTop: '30px solid currentColor',
            }}
          ></div>
        </div>
        <div className="bg-ccd-purples-900">
          <div className="grid w-full grid-cols-1 gap-2 px-12 pt-10 pb-10 mx-auto md:pb-20 lg:pb-40 md:pt-20 lg:pt-40 bg-ccd-purples-050 justify-items-stretch md:grid-cols-2 lg:grid-cols-2 place-items-auto ">
            <div className="col-span-full sm:place-self-start">
              <p className="text-5xl text-center font-heading text-ccd-purples-900">
                Latest Courses
              </p>
            </div>
            <RecentPostsCards recentPosts={recentPosts['courses']} />
            <div className="pt-16 col-span-full justify-self-center ">
              <Link href="/courses">
                <button
                  className="h-16 px-16 py-2 font-bold text-white rounded shadow-xl bg-ccd-purples-900 hover:bg-blue-dark w-96"
                  type="button"
                >
                  View All Courses
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div className="static flex flex-col justify-center w-full h-20 px-2 md:h-32 vertical-clip">
            {
              <div className="flex content-center justify-between p-8">
                <AJLogoLeft className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24" />
                <div className="flex flex-col content-center justify-center">
                  <p className="text-2xl tracking-widest text-center text-white md:text-5xl font-heading">
                    Learn with AJ and KC
                  </p>
                </div>
                <KCLogo className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24" />
              </div>
            }
          </div>
          <div className="flex justify-end">
            <div
              className="right-0 w-8 h-8 mr-8 text-ccd-reds-900"
              style={{
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderTop: '30px solid currentColor',
              }}
            ></div>
          </div>
        </div>
        <div className="bg-ccd-purples-900">
          <div className="grid w-full grid-cols-1 gap-2 px-12 pt-10 pb-10 mx-auto md:pb-20 lg:pb-40 md:pt-20 lg:pt-40 bg-ccd-purples-050 justify-items-stretch md:grid-cols-2 lg:grid-cols-2 place-items-auto ">
            <div className="col-span-full sm:place-self-end">
              <p className="text-5xl text-center font-heading text-ccd-purples-900">
                Latest Tutorials
              </p>
            </div>
            <RecentPostsCards recentPosts={recentPosts['tutorials']} />
            <div className="pt-16 col-span-full justify-self-center ">
              <Link href="/tutorials">
                <button
                  className="h-16 px-16 py-2 font-bold text-white rounded shadow-xl bg-ccd-purples-900 hover:bg-blue-dark w-96"
                  type="button"
                >
                  View All Tutorials
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div className="static flex flex-col justify-center w-full h-20 px-2 md:h-32 vertical-clip">
            {
              <div className="flex content-center justify-between p-8">
                <AJHeartAlt className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24" />
                <div className="flex flex-col content-center justify-center">
                  <p className="text-2xl tracking-widest text-center text-white md:text-5xl font-heading">
                    Read what's going on in web dev
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24"></div>
              </div>
            }
          </div>
          <div
            className="w-8 h-8 ml-8 text-ccd-reds-900"
            style={{
              borderLeft: '30px solid transparent',
              borderRight: '30px solid transparent',
              borderTop: '30px solid currentColor',
            }}
          ></div>
        </div>
        <div className="bg-ccd-purples-900">
          <div className="grid w-full grid-cols-1 gap-2 px-12 pt-10 pb-10 mx-auto md:pb-20 lg:pb-40 md:pt-20 lg:pt-40 bg-ccd-purples-050 justify-items-stretch md:grid-cols-2 lg:grid-cols-2 place-items-auto ">
            <div className="col-span-full sm:place-self-start">
              <p className="text-5xl text-center font-heading text-ccd-purples-900">
                Blog Posts
              </p>
            </div>
            <RecentPostsCards recentPosts={recentPosts.post} />
            <div className="pt-16 col-span-full justify-self-center ">
              <Link href="/blog">
                <button
                  className="h-16 px-16 py-2 font-bold text-white rounded shadow-xl bg-ccd-purples-900 hover:bg-blue-dark w-96"
                  type="button"
                >
                  View All Posts
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div className="static flex flex-col justify-center w-full h-20 px-2 md:h-32 vertical-clip">
            {
              <div className="flex content-center justify-between p-8">
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24"></div>
                <div className="flex flex-col content-center justify-center">
                  <p className="text-2xl tracking-widest text-center text-white md:text-5xl font-heading">
                    Listen to the latest tech news
                  </p>
                </div>
                <AJHeadphones className="w-8 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24" />
              </div>
            }
          </div>
          <div className="flex justify-end">
            <div
              className="right-0 w-8 h-8 mr-8 text-ccd-reds-900"
              style={{
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderTop: '30px solid currentColor',
              }}
            ></div>
          </div>
        </div>
        <div className="bg-ccd-purples-900">
          <div className="grid w-full grid-cols-1 gap-2 px-12 pt-10 pb-10 mx-auto md:pb-20 lg:pb-40 md:pt-20 lg:pt-40 bg-ccd-purples-050 justify-items-stretch md:grid-cols-2 lg:grid-cols-2 place-items-auto ">
            <div className="col-span-full sm:place-self-end">
              <p className="text-5xl text-center font-heading text-ccd-purples-900">
                Latest Podcasts
              </p>
            </div>
            <RecentPostsCards recentPosts={recentPosts.podcasts} />
            <div className="pt-16 col-span-full justify-self-center ">
              <Link href="/podcasts">
                <button
                  className="h-16 px-16 py-2 font-bold text-white rounded shadow-xl bg-ccd-purples-900 hover:bg-blue-dark w-96"
                  type="button"
                >
                  View All Podcasts
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer></footer>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
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
