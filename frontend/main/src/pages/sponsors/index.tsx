import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { queryByPublished } from '@/services/notion.server';
import { getSite } from '@/services/notion.server';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Pagination } from '@/components/NotionPagination';
import SponsorCards from '@/components/SponsorCards';
import { Sponsor } from '@/models/sponsor.model';
import { Post } from '@/models/post.model';
import Image from 'next/image';
import Link from 'next/link';

interface StaticParams {
  site: Site;
  sponsors: Sponsor[];
  showNext: boolean;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  const notionPosts = await queryByPublished('sponsor', 20);

  return {
    props: {
      site: getSite(),
      sponsors: notionPosts.results as unknown as Sponsor[],
      showNext: notionPosts.has_more,
    },
    revalidate: 3600,
  };
};

const Sponsors = ({
  site,
  sponsors,
  showNext,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="Sponsors | CodingCatDev"
        description="Sponsors | CodingCatDev"
        canonical={`https://codingcat.dev/sponsors`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/sponsors',
          title: 'Sponsors | CodingCatDev',
          description: 'Sponsors for CodingCat.dev Podcast',
          site_name: 'CodingCat.dev Podcast',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/f_jpg/main-codingcatdev-photo/Sponsors.png',
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <section className="flex justify-center p-4">
          <h1 className="text-5xl lg:text-7xl">Sponsors</h1>
        </section>
        <section className="flex flex-wrap justify-center gap-10 p-4 md:grid md:grid-cols-[1fr_1fr_1fr] sm:p-10">
          {sponsors.map((s, i) => (
            <div className="w-full p-2" key={i}>
              <Link href={`/sponsors/${s.slug}`}>
                <a>
                  <div className="w-full rounded-lg shadow-lg bg-primary-100 dark:bg-primary-500">
                    <div className="p-2">
                      <div
                        style={{
                          overflow: 'hidden',
                          paddingTop: '56.25%',
                          position: 'relative',
                          width: '100%',
                          height: 0,
                        }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          {s?.coverPhoto?.public_id && (
                            <Image
                              src={s.coverPhoto.public_id}
                              alt={`Sponsorship Image for ${s.company}`}
                              layout="fill"
                            />
                          )}
                        </div>
                      </div>
                      <h2 className="flex flex-wrap content-center pl-1 text-2xl font-semibold">
                        {s.company}
                      </h2>
                      <p className="m-2 text-lg">{s.description}</p>
                    </div>
                    <div className="flex w-full mt-2 rounded-b-lg bg-primary-900">
                      <p className="px-4 py-2 text-sm text-white uppercase border-none cursor-pointer">
                        More Information -{'>'}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </section>
        <Pagination
          posts={sponsors as unknown as Post[]}
          baseUrl="sponsors"
          pageNumber={1}
          showNext={showNext}
        />
      </Layout>
    </>
  );
};
export default Sponsors;