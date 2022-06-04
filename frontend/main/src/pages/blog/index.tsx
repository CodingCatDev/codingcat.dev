import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';
import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { queryByPublished } from '@/services/notion.server';
import { getSite } from '@/services/notion.server';
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
  let notionPosts = await queryByPublished(PostType.post, 20);
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
        title="Blog | CodingCatDev"
        canonical={`https://codingcat.dev/blog`}
      ></NextSeo>
      <Layout site={site}>
        <div className="p-4 sm:p-10">
          <h1 className="mt-10 mb-16 text-5xl text-center lg:text-7xl">
            {PostType.post.charAt(0).toUpperCase() + PostType.post.slice(1)}s
          </h1>
          <PostsCards posts={posts} />
          <Pagination
            posts={posts}
            baseUrl="blog"
            pageNumber={1}
            showNext={showNext}
          />
        </div>
      </Layout>
    </>
  );
};
export default Podcasts;
