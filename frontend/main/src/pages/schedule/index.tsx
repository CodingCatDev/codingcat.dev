import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import ScheduleUpper from '@/components/ScheduleUpper';
import ScheduleCards from '@/components/ScheduleCards';
import { Post } from '@/models/post.model';
import { Site } from '@/models/site.model';
import {
  getSite,
  queryPurrfectStreamByScheduled,
  queryPurrfectGuestsByStreamId,
} from '@/services/notion.server';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
interface StaticParams {
  site: Site;
  posts: Post[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  const notionPosts = await queryPurrfectStreamByScheduled(10000);

  const guestResults = await Promise.all(
    notionPosts?.results?.map(async (post) => {
      return {
        ...post,
        guests: await queryPurrfectGuestsByStreamId(post.id),
      };
    })
  );
  const posts = guestResults.map((post) => {
    const guests = post?.guests?.results?.map((g: any) => {
      return {
        ...g,
        name: `${g?.properties?.Name?.title
          .map((t: any) => t.plain_text)
          .join('')}`,
        twitter: g?.properties?.Twitter?.url
          ? g?.properties?.Twitter.url
          : null,
      };
    });
    return {
      ...post,
      guests,
    };
  });

  return {
    props: {
      site: getSite(),
      posts,
    },
    revalidate: 3600,
  };
};

const Podcasts = ({
  site,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="Stream Schedule"
        description="Stream Schedule"
        canonical={`https://codingcat.dev/schedule`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/schedule',
          title: 'Stream Schedule',
          description: 'Stream schedules for all things codingcat.dev.',
          site_name: 'CodingCat.dev',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/f_png,c_thumb,w_1200,h_630/main-codingcatdev-photo/Schedule.png',

              width: 1200,
              height: 630,
              alt: 'AJ Logo Black Cat Face with Purrfect.dev Domain',
            },
            {
              url: 'https://media.codingcat.dev/image/upload/f_png/main-codingcatdev-photo/Schedule.png',
            },
          ],
        }}
      ></NextSeo>
      <Layout site={site}>
        <div className="flex flex-col gap-8 p-4 sm:p-10">
          <ScheduleUpper />
          <ScheduleCards posts={posts} />
        </div>
      </Layout>
    </>
  );
};
export default Podcasts;
