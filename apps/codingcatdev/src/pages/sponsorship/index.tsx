import { NextSeo } from 'next-seo';
import Image from "next/legacy/image";
import { useRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/notion.server';
import { Site } from '@/models/site.model';
import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import AJHeadphones from '@/components/global/icons/AJHeadphones';
import PurrfectDevPodcatchers from '@/components/PurrfectDevPodcatchers';
import Link from 'next/link';
interface StaticParams {
  site: Site;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: getSite(),
    },
    revalidate: 3600,
  };
};

export default function Sponsorship({
  site,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const form = useRef<HTMLDivElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const scroll = useScroll();
  const scrollBtn = useRef<HTMLButtonElement>(null);

  const scrollToForm = () => {
    if (form && form.current) form.current.scrollIntoView();
  };

  useEffect(() => {
    if (router.query && router.query.form) {
      scrollToForm();
      router.replace('/sponsorship', undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    if (form) {
      const formRect = form.current?.getBoundingClientRect();
      if (formRect && scrollBtn && scrollBtn.current) {
        if (formRect.top >= window.innerHeight) {
          scrollBtn.current.hidden = false;
        } else {
          scrollBtn.current.hidden = true;
        }
      }
    }
  }, [scroll]);

  const arrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76z"
      ></path>
    </svg>
  );

  return (
    <>
      <NextSeo
        title="Purrfect Sponsorship"
        description="Sponsorship for CodingCat.dev Podcast"
        canonical={`https://codingcat.dev/sponsorship/`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/sponsorship',
          title: 'Purrfect Podcasts',
          description: 'Sponsorship for CodingCat.dev Podcast.',
          site_name: 'CodingCat.dev Podcast',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/f_jpg/main-codingcatdev-photo/Sponsorship',
            },
          ],
        }}
      />
      <Layout site={site}>
        <div className="sticky top-0 right-0 z-50 flex m-2 jusify-end">
          <button
            ref={scrollBtn}
            className="btn-secondary"
            onClick={() => scrollToForm()}
          >
            Apply To Sponsor -{'>'}
          </button>
        </div>
        <section className="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8">
          <div className="flex flex-col items-center sm:hidden">
            <AJHeadphones className="w-48 h-48" />
          </div>
          <div className="flex justify-center m-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-4xl">Sponsorship for</p>
              <p className="text-6xl font-extrabold md:text-8xl">
                CodingCat.dev Podcast
              </p>
              <p className="text-2xl">a CodingCat.dev Production</p>
            </div>
            <div className="flex-col items-center hidden sm:flex">
              <AJHeadphones className="w-48 h-48" />
            </div>
          </div>
          <div className="flex justify-center dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex flex-col max-w-xl gap-4 p-8 font-extrabold">
              <p className="text-4xl">
                Are you interested in reaching other web designers and
                developers?
              </p>
              <p className="text-6xl dark:text-secondary-400 text-secondary-300">
                We&lsquo;d love to help!
              </p>
              <p className="text-2xl">
                CodingCat.dev Podcast is a weekly podcast that focuses on
                developer&lsquo;s backgrounds, tools and tiips.
              </p>
              <p className="text-2xl">
                We aim to keep listeners up to date on teh latest technology and
                best practices, along with guiding developers on their journey
                and helping them use tools in their everyday workflow.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
              <p className="text-4xl">
                <span className="text-8xl dark:text-secondary-400 text-secondary-300">
                  Why
                </span>
                <span className="font-bold">do we make the podcast?</span>
              </p>
            </div>
            <div className="flex flex-col w-full max-w-xl gap-4 p-8 font-extrabold">
              <p className="text-2xl">
                Alex and Brittney both have a passion for teaching and the
                <span className="dark:text-secondary-400 text-secondary-300">
                  {' '}
                  CodingCat.dev Podcast{' '}
                </span>
                podcast is an extension of that passion!
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:flex-nowrap">
              <div className="flex flex-col gap-4 p-8 font-extrabold">
                <p className="text-2xl">
                  <span className="dark:text-secondary-400 text-secondary-300">
                    Alex{' '}
                  </span>
                  created CodingCat.dev so that everyone has access to a great
                  learning platform and a safe learning community. He has a
                  primary background in web development and architecture.
                </p>
              </div>
              <div className="flex flex-col gap-4 p-8 font-extrabold">
                <p className="text-2xl">
                  <span className="dark:text-secondary-400 text-secondary-300">
                    Brittney{' '}
                  </span>
                  joined Alex to complete the design of CodingCat.dev and then
                  joined CodingCat.dev Podcast to give a designer turned
                  developer&lsquo;s perspective to the discussion.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
              <p className="text-4xl">
                <span className="text-8xl dark:text-secondary-400 text-secondary-300">
                  Where
                </span>
                <span className="font-bold">
                  {' '}
                  do we distribute the podcast?
                </span>
              </p>
            </div>
            <div className="flex flex-col w-full max-w-xl gap-4 p-8 font-extrabold">
              <p className="text-2xl">
                Our podcast is very visual and interactive, so we first
                livestream to{' '}
                <a
                  href="https://twitch.tv/codingcatdev"
                  rel="noreferrer"
                  target="_blank"
                  className="dark:text-secondary-400 text-secondary-300"
                >
                  Twitch
                </a>{' '}
                then the episodes receive a number for release and are released
                to all the below syndication platforms.
              </p>
            </div>
            <div className="flex flex-wrap justify-center mb-8 sm:flex-nowrap">
              <PurrfectDevPodcatchers />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-8 p-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <p className="flex justify-center w-full text-6xl font-bold">
              Audience Breakdown
            </p>
            <div className="flex flex-col w-full gap-8 text-2xl">
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl font-bold dark:text-secondary-400 text-secondary-300">
                  Age Range
                </div>
                <div className="font-bold text-8xl dark:text-primary-600 text-secondary-400">
                  25-34
                </div>
                <div>Most listeners fall within this range.</div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl font-bold dark:text-secondary-400 text-secondary-300">
                  Spotify
                </div>
                <div className="w-full max-w-xl">
                  <Image
                    src={`/main-codingcatdev-photo/spotify-analytics.png`}
                    alt="Spotify Analytics"
                    layout="responsive"
                    width="2220"
                    height="556"
                    className="rounded-md"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="text-4xl font-bold dark:text-secondary-400 text-secondary-300">
                  YouTube
                </div>
                <div className="w-full max-w-xl">
                  <Image
                    src={`/main-codingcatdev-photo/youtube-analytics.png`}
                    alt="Spotify Analytics"
                    layout="responsive"
                    width="1614"
                    height="934"
                    className="rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center p-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <p className="flex justify-center w-full text-4xl font-bold md:text-6xl">
              Sponsoring is Purrfect for:
            </p>
            <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
              <div className="grid grid-cols-[3rem_1fr] items-center text-xl md:text-2xl">
                <div className="w-12">{arrow()}</div>
                <div>
                  Web design and development tools, software and services
                </div>

                <div className="w-12">{arrow()}</div>
                <div>Teams looking to hire</div>

                <div className="w-12">{arrow()}</div>
                <div>Technical training material and courses</div>

                <div className="w-12">{arrow()}</div>
                <div>Technical software</div>

                <div className="w-12">{arrow()}</div>
                <div>Hardware products</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center p-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <p className="flex justify-start w-full text-4xl font-bold md:text-6xl">
              Audience Interests:
            </p>
            <div className="flex flex-wrap md:flex-nowrap">
              <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
                <p className="flex justify-start w-full text-3xl font-bold md:text-4xl">
                  Hard Skills
                </p>
                <div className="grid grid-cols-[3rem_1fr] gap-2 items-center text-xl md:text-2xl">
                  <div className="w-12">{arrow()}</div>
                  <div>
                    JavaScript frameworks (e.g. React, Angular, Vue, and Svelte)
                  </div>

                  <div className="w-12">{arrow()}</div>
                  <div>CSS and CSS libraries like TailwindCSS</div>

                  <div className="w-12">{arrow()}</div>
                  <div>Backend Frameworks (e.g. NodeJs, Rust)</div>

                  <div className="w-12">{arrow()}</div>
                  <div>Cloud Solutions (e.g. AWS, GCP, Azure)</div>

                  <div className="w-12">{arrow()}</div>
                  <div>Lifestyle Products (e.g. keyboards, VSCode themes)</div>
                </div>
              </div>
              <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
                <p className="flex justify-start w-full text-3xl font-bold md:text-4xl">
                  Soft Skills
                </p>
                <div className="grid grid-cols-[3rem_1fr] gap-2 items-center text-xl md:text-2xl">
                  <div className="w-12">{arrow()}</div>
                  <div>How to get a job in tech</div>

                  <div className="w-12">{arrow()}</div>
                  <div>How to run a freelance business</div>

                  <div className="w-12">{arrow()}</div>
                  <div>How to start a podcast</div>

                  <div className="w-12">{arrow()}</div>
                  <div>How to change careers</div>

                  <div className="w-12">{arrow()}</div>
                  <div>Mental health and awareness</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-start gap-4 p-8 md:gap-8 md:px-24 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex flex-col justify-start w-full gap-4 font-extrabold ">
              <p className="text-8xl dark:text-secondary-400 text-secondary-300">
                Pricing
              </p>
            </div>
            <div className="grid grid-cols-[1fr] gap-2 text-xl md:text-2xl p-2 md:p-8">
              <div>
                <span className="text-2xl font-bold md:text-4xl dark:text-secondary-400 text-secondary-300">
                  Single Show
                </span>{' '}
                - $300 USD
              </div>
              <div>
                <span className="text-2xl font-bold md:text-4xl dark:text-secondary-400 text-secondary-300">
                  3+ Shows
                </span>{' '}
                - $250 USD
              </div>
              <div>
                <span className="text-2xl font-bold md:text-4xl dark:text-secondary-400 text-secondary-300">
                  10+ Shows
                </span>{' '}
                - $200 USD
              </div>
              <p className="text-sm">
                * per show pricing, contact us to arrange for annual terms.
              </p>
            </div>
            <p className="text-md md:text-2xl">
              We have found that we get the best results for our advertisers
              when they sponsor at least three shows, Alex and Brittney are able
              to test out the product, and your marketing team approves both
              pre-roll and mid-roll videos.
            </p>
          </div>
          <div className="flex flex-col gap-4 p-4 md:py-8 md:flex-row md:px-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex flex-col w-full gap-4">
              <p className="w-full text-2xl font-bold md:text-4xl">
                As part of the sponsorship package, you&lsquo;ll receive:
              </p>
              <div className="flex gap-2 py-8 text-2xl">
                <span className="text-6xl font-bold dark:text-secondary-400 text-secondary-300">
                  1
                </span>
                <p className="text-3xl dark:text-secondary-400 text-secondary-300">
                  A sponsorship section within the episode show notes, on our
                  website.
                </p>
              </div>
              <p className="text-xl md:text-2xl">
                These notes will be listed on CodingCat.dev Podcast permanently
                and within the user&lsquo;s podcatcher of choice (Apple,
                Spotify...). This is a great opportunity to include unique
                targeted links and promo codes!
              </p>
            </div>
            <div className="w-full">
              <Image
                src={`/main-codingcatdev-photo/Screen_Shot_2022-08-02_at_12.55.38_PM.png`}
                alt="CodingCat.dev Podcast Sponsorship Image show logo."
                layout="responsive"
                width="2078"
                height="2390"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 md:py-8 md:flex-row md:px-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2 py-8 text-2xl">
                <span className="text-6xl font-bold dark:text-secondary-400 text-secondary-300">
                  2
                </span>
                <p className="text-3xl dark:text-secondary-400 text-secondary-300">
                  A call-out in the pre-roll of the show.
                </p>
              </div>
              <p className="text-2xl">
                The call-out will include the name of the company and slogan.
                Because we are a video podcast, there will also be an
                opportunity for your own branding to be included in the video.
                We highly suggest your marketing team creates the video with a
                voice-over from Brittney and Alex.
              </p>
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2 py-8 text-2xl">
                <span className="text-6xl font-bold dark:text-secondary-400 text-secondary-300">
                  3
                </span>
                <p className="text-3xl dark:text-secondary-400 text-secondary-300">
                  A 60-90 second sponsor spot mid-roll during the show.
                </p>
              </div>
              <p className="text-2xl">
                We can provide a standard ad read provided by your marketing
                department. We have found that because we are a video podcast,
                this is a good time to showcase your product. We can also
                provide a personal experience aad that allows Alex and Brittney
                to demonstrate their own experience with your product.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-4 md:py-8 md:flex-row md:px-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2 py-8 text-2xl">
                <span className="text-6xl font-bold dark:text-secondary-400 text-secondary-300">
                  4
                </span>
                <p className="text-3xl dark:text-secondary-400 text-secondary-300">
                  An evergreen listing on the CodingCat.dev Podcast{' '}
                  <Link href="/sponsors" className="underline">
                    sponsors page.
                  </Link>
                </p>
              </div>
              <p className="text-2xl">
                The{' '}
                <Link href="/sponsors" className="underline">
                  sponsors page
                </Link>{' '}
                is a useful resource for listeners wanting to quickly reference
                a sponsor&lsquo;s offering, but are unable to recall which
                episode, coupon code, or link was used during the ad read.
              </p>
            </div>
            <div className="flex flex-col w-full gap-4">
              <div className="flex gap-2 py-8 text-2xl">
                <span className="text-6xl font-bold dark:text-secondary-400 text-secondary-300">
                  5
                </span>
                <p className="text-3xl dark:text-secondary-400 text-secondary-300">
                  Access to a password protected dashboard.
                </p>
              </div>
              <p className="text-2xl">
                This will include easy access to all documents, including
                invoices and contracts.
              </p>
            </div>
          </div>

          <div
            ref={form}
            className="flex flex-wrap justify-center p-8 bg-basics-900 text-primary-50 rounded-xl"
          >
            <iframe
              className="w-full border-none rounded-xl"
              height="720px"
              src="https://notionforms.io/forms/sponsor-submissions"
            ></iframe>
          </div>
        </section>
      </Layout>
    </>
  );
}
