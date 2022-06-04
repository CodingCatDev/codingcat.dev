import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import PurrfectDevUpper from '@/components/PurrfectDevUpper';
import PostsCards from '@/components/PostsCards';
import PurrfectDevPodcatchers from '@/components/PurrfectDevPodcatchers';
import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import {
  queryByPublished,
  queryPurrfectStreamByReleased,
} from '@/services/notion.server';
import { getSite, getPostsService } from '@/services/sanity.server';
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
  let notionPosts = await queryByPublished(PostType.course, 20);
  return {
    props: {
      site: await getSite({ preview }),
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
        title="Courses | CodingCatDev"
        canonical={`https://codingcat.dev/courses`}
      ></NextSeo>
      <Layout site={site}>
        <div className="p-4 sm:p-10">
          <h1 className="mt-10 mb-16 text-5xl text-center lg:text-7xl">
            {PostType.course.charAt(0).toUpperCase() + PostType.course.slice(1)}
            s
          </h1>
          <PostsCards posts={posts} />
          <Pagination
            posts={posts}
            baseUrl="courses"
            pageNumber={1}
            showNext={showNext}
          />
        </div>
      </Layout>
    </>
  );
};
export default Podcasts;
