import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import PurrfectDevUpper from '@/components/PurrfectDevUpper';
import PostsCards from '@/components/PostsCards';
import PurrfectDevPodcatchers from '@/components/PurrfectDevPodcatchers';
import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import {
  queryPurrfectStreamByReleased,
  getSite,
} from '@/services/notion.server';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Pagination } from '@/components/NotionPagination';
interface StaticParams {
  site: Site;
  posts: Post[];
  showNext: boolean;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  let notionPosts = await queryPurrfectStreamByReleased(20);
  return {
    props: {
      site: getSite(),
      posts: notionPosts.results,
      showNext: notionPosts.has_more,
    },
    revalidate: 3600,
  };
};

const Podcasts = ({
  site,
  posts,
  showNext,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="Purrfect Podcasts"
        description="Purrfect Podcasts"
        canonical={`https://codingcat.dev/podcasts`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/podcasts',
          title: 'Purrfect Podcasts',
          description: 'Purrfect Podcasts about development.',
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
      ></NextSeo>
      <Layout site={site}>
        <div className="p-4 sm:p-10">
          <PurrfectDevUpper />
          <h2 className="mt-10 mb-16 text-5xl text-center lg:text-7xl">
            {PostType.podcast.charAt(0).toUpperCase() +
              PostType.podcast.slice(1)}
            s
          </h2>
          <PostsCards posts={posts} />
          <Pagination
            posts={posts}
            baseUrl="podcasts"
            pageNumber={1}
            showNext={showNext}
          />
        </div>
      </Layout>
    </>
  );
};
export default Podcasts;
