import {
  getSite,
  queryPurrfectStreamBySlug,
  queryPurrfectStreamByScheduled,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Post, PostType } from '@/models/post.model';
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
    fallback: true,
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
  const scheduled = await queryPurrfectStreamByScheduled(
    undefined,
    undefined,
    slug
  );
  const post = scheduled?.results?.at(0) || null;

  if (!post) {
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

export default function AuthorPage({
  site,
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={post.title}
        description={post.excerpt}
        canonical={`https://codingcat.dev/${post._type}/${post.slug}`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: `https://codingcat.dev/${post._type}/${post.slug}`,
          title: post.title,
          description: post.excerpt,
          site_name: 'CodingCatDev',
          images: [
            {
              url: `https://media.codingcat.dev/image/upload/f_png,c_fit,w_1200,h_630${post?.coverPhoto?.public_id}`,
              width: 1200,
              height: 630,
              alt: post?.title,
            },
            {
              url: `https://media.codingcat.dev/image/upload/f_png${post?.coverPhoto?.public_id}`,
              alt: post?.title,
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
