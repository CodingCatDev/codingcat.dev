import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/notion.server';
import { Site } from '@/models/site.model';
import { useEffect, useRef } from 'react';
import { useScroll } from '@/hooks/useScroll';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

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
              url: 'https://media.codingcat.dev/image/upload/f_png,c_thumb,w_1200,h_630/main-codingcatdev-photo/purrfect.dev.png',
              width: 1200,
              height: 630,
              alt: 'AJ Logo Black Cat Face with Purrfect.dev Domain',
            },
            {
              url: 'https://media.codingcat.dev/image/upload/f_png/main-codingcatdev-photo/purrfect.dev.png',
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
        <section className="grid grid-cols-1 gap-2 mx-2">
          {Array.apply(0, Array(12)).map((x, i) => (
            <div className="w-full" key={i}>
              <Image
                src={`/main-codingcatdev-photo/2022_-_Sponsorship_${i + 1}.png`}
                alt="Purrfect.dev Sponsorship Image show logo."
                layout="responsive"
                width="1920"
                height="1080"
                className="rounded-md"
              />
            </div>
          ))}

          <div ref={form} className="bg-white rounded">
            <iframe
              className="border-none w-full"
              height="720px"
              src="https://notionforms.io/forms/sponsor-submissions"
            ></iframe>
          </div>
        </section>
      </Layout>
    </>
  );
}
