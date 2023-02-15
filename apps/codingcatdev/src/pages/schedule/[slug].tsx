import {
  getSite,
  queryPurrfectStreamByScheduled,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Post } from '@/models/post.model';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import ScheduleUpper from '@/components/ScheduleUpper';
import ScheduleCard from '@/components/ScheduleCard';

interface StaticParams {
  site: Site;
  post: Post;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];
  const scheduled = await queryPurrfectStreamByScheduled(10000);
  for (const p of scheduled.results as any) {
    if (p?.properties?.slug?.url) {
      paths.push({
        params: {
          slug: `${p?.properties?.slug?.url}`,
        },
      });
    }
  }
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  params,
  preview,
  previewData,
}) => {
  const { slug } = params as any;

  if (!slug) {
    return {
      notFound: true,
    };
  }
  const site = getSite();
  const scheduled = await queryPurrfectStreamByScheduled(1, undefined, slug);
  const post = scheduled?.results?.at(0);

  if (!post || !scheduled?.results?.length) {
    console.log('Schedule not found');
    return {
      notFound: true,
    };
  }

  return {
    props: {
      site,
      post,
    },
  };
};

export default function SchedulePage({
  site,
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  let re = /(\w+).null - /;
  const title = post?.title?.replace(re, '');
  return (
    <>
      <NextSeo
        title={title}
        description={post?.excerpt}
        canonical={`https://codingcat.dev/schedule/${post.slug}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev/schedule/${post.slug}`,
          title,
          description: post?.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/f_jpg${post?.coverPhoto?.secure_url}`,
              alt: title || 'Call AJ',
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <div className="flex flex-col gap-8 p-4 sm:p-10">
          <ScheduleUpper />
          <ScheduleCard post={post} />
        </div>
      </Layout>
    </>
  );
}
