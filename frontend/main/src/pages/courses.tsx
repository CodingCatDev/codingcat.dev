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
      posts: await getPostsService({ type: PostType.course, preview }),
    },
    revalidate: 3600,
  };
};

const Courses = ({
  site,
  posts,
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
        </div>
      </Layout>
    </>
  );
};
export default Courses;
