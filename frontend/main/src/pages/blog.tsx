import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import PostsCards from '@/components/PostsCards';

import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getSite, getPostsService } from '@/services/sanity.server';

interface StaticParams {
  site: Site;
  posts: Post[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: await getSite({ preview }),
      posts: await getPostsService({ type: PostType.post, preview }),
    },
    revalidate: 3600,
  };
};

const Blog = ({
  site,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <NextSeo
        title="Blog | CodingCatDev"
        canonical={`https://codingcat.dev/blog`}
      ></NextSeo>
      <Layout site={site}>
        <div className="p-4 sm:p-10">
          <h1 className="mb-4 text-5xl text-center lg:text-7xl">
            {PostType.post.charAt(0).toUpperCase() + PostType.post.slice(1)}s
          </h1>
          <PostsCards posts={posts} />
        </div>
      </Layout>
    </>
  );
};
export default Blog;
