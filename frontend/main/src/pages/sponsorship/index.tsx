import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/notion.server';
import { Site } from '@/models/site.model';
import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import AJHeadphones from '@/components/global/icons/AJHeadphones';
import PurrfectDevPodcatchers from '@/components/PurrfectDevPodcatchers';

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
        description="Sponsorship for Purrfect.dev"
        canonical={`https://codingcat.dev/sponsorship/`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/sponsorship',
          title: 'Purrfect Podcasts',
          description: 'Sponsorship for Purrfect.dev.',
          site_name: 'Purrfect.dev',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/f_jpg/main-codingcatdev-photo/purrfect.dev',
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
                Purrfect.dev
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
                Purrfect.dev is a weekly podcast that focuses on
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
                  Purrfect.dev{' '}
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
                  joined Purrfect.dev to give a designer turned
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
          <div className="flex flex-wrap justify-center py-8 dark:bg-basics-600 bg-primary-500 text-primary-50 rounded-xl">
            <p className="flex justify-center w-full text-6xl font-bold">
              Sponsoring is Purrfect for:
            </p>
            <div className="flex flex-col max-w-xl gap-4 p-8 font-extrabold">
              <div className="grid grid-cols-[3rem_1fr] items-center text-2xl">
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
          {[6, 7, 8, 9, 10, 11].map((x, i) => (
            <div className="w-full" key={x}>
              <Image
                src={`/main-codingcatdev-photo/2022_-_Sponsorship_${x + 1}.png`}
                alt="Purrfect.dev Sponsorship Image show logo."
                layout="responsive"
                width="1920"
                height="1080"
                className="rounded-md"
              />
            </div>
          ))}

          <div
            ref={form}
            className="flex flex-wrap justify-center py-8 bg-white text-primary-50 rounded-xl"
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
