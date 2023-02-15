import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { queryByPublished } from '@/services/notion.server';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import { Pagination } from '@/components/NotionPagination';
import Link from 'next/link';
import Image from 'next/image';
import { Sponsor } from '@/models/sponsor.model';
import { Site } from '@/models/site.model';
import { Post } from '@/models/post.model';

interface StaticParams {
  site: Site;
  sponsors: Sponsor[];
  showNext: boolean;
  pageNumber: number;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  params,
  preview = false,
}) => {
  let notionPosts;
  const pageNumber = params?.pageNumber ? parseInt(`${params?.pageNumber}`) : 1;

  //First get a cursor
  let raw = await queryByPublished('sponsor', 20);
  let cursor = raw.next_cursor;
  let hasMore = raw.has_more;
  if (pageNumber == 1) {
    notionPosts = raw;
  } else {
    //Then loop until you get the correct page, (which stinks for perf)
    for (let p = 2; p <= pageNumber; p++) {
      if (hasMore) {
        let nextPosts = await queryByPublished('sponsor', 20, cursor);
        cursor = nextPosts.next_cursor;
        hasMore = nextPosts.has_more;
        if (p === pageNumber) {
          notionPosts = nextPosts;
        }
      }
    }
  }
  if (!notionPosts?.results?.length) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      site: getSite(),
      sponsors: (notionPosts?.results
        ? notionPosts?.results
        : []) as unknown as Sponsor[],
      showNext: notionPosts?.has_more ?? false,
      pageNumber,
    },
    revalidate: 3600,
  };
};

export async function getStaticPaths() {
  let raw = await queryByPublished('sponsor', 20);
  const paths = sliceIntoChunks(raw.results, 20).map((_chunk, index) => ({
    params: { pageNumber: `${index + 1}` },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
}

export const sliceIntoChunks = (arr: any[], chunkSize: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

const SponsorsPage = ({
  site,
  sponsors,
  showNext,
  pageNumber,
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
                        {s?.coverPhoto?.secure_url && (
                          <Image
                            src={s.coverPhoto.secure_url}
                            alt={`Sponsorship Image for ${s.company}`}
                            fill
                            sizes="100vw"
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
              </Link>
            </div>
          ))}
        </section>
        <Pagination
          posts={sponsors as unknown as Post[]}
          baseUrl="sponsors"
          pageNumber={pageNumber}
          showNext={showNext}
        />
      </Layout>
    </>
  );
};
export default SponsorsPage;
