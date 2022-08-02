import {
  getSite,
  queryByPublished,
  queryRelationById,
  getSponsorPageBlocks,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { Sponsor } from '@/models/sponsor.model';
import Image from 'next/image';

interface StaticParams {
  site: Site;
  sponsor: Sponsor;
  podcasts: Post[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { sponsorPath: string } }[] = [];
  const sponsors = await queryByPublished('sponsor', 10000);
  console.log('sponsors', sponsors);
  for (const p of sponsors.results as any) {
    if (p?.properties?.slug?.url) {
      paths.push({
        params: {
          sponsorPath: `${p?.properties?.slug?.url}`,
        },
      });
    }
  }
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  params,
  preview,
  previewData,
}) => {
  const { sponsorPath } = params as any;

  if (!sponsorPath) {
    return {
      notFound: true,
    };
  }
  const site = getSite();
  const sponsor = await getSponsorPageBlocks(sponsorPath);

  if (!sponsor) {
    console.log('Sponsor not found');
    return {
      notFound: true,
    };
  }

  const [podcasts] = await Promise.all([
    queryRelationById(sponsor.id, 'sponsors', PostType.podcast),
  ]);

  return {
    props: {
      site,
      sponsor,
      podcasts: podcasts?.results || null,
    },
  };
};

export default function SponsorPage({
  site,
  sponsor,
  podcasts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={`${sponsor?.company || ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/sponsors/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
          <a href={sponsor.url} rel="noreferrer noopener" target="_blank">
            <article className="grid items-start grid-cols-1 gap-4 shadow-lg rounded-xl justify-items-center justify-self-center hover:shadow-sm">
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
                      {sponsor?.coverPhoto?.public_id && (
                        <Image
                          src={sponsor.coverPhoto.public_id}
                          alt={`Sponsorship Image for ${sponsor.company}`}
                          layout="fill"
                        />
                      )}
                    </div>
                  </div>
                  <h2 className="flex flex-wrap content-center pl-1 text-2xl font-semibold">
                    {sponsor.company}
                  </h2>
                  <p className="m-2 text-lg">{sponsor.description}</p>
                </div>
                <div className="flex w-full mt-2 rounded-b-lg bg-primary-900">
                  <p className="px-4 py-2 text-sm text-white uppercase border-none cursor-pointer">
                    More Information -{'>'}
                  </p>
                </div>
              </div>
            </article>
          </a>
        </section>
        {podcasts && podcasts.length > 0 && (
          <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
            <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
              Podcasts
            </h2>
            {podcasts && <PostsCards posts={podcasts} />}
          </section>
        )}
      </Layout>
    </>
  );
}
