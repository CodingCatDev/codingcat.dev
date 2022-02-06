import {
  getSite,
  getTagBySlugService,
  getPostsByTag,
} from '@/services/sanity.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import { Tag } from '@/models/tag.model';
import { GetServerSideProps } from 'next';

export default function AuthorPage({
  site,
  tag,
  courses,
  tutorials,
  posts,
  podcasts,
}: {
  site: Site | null;
  tag: Tag;
  courses: Post[] | null;
  tutorials: Post[] | null;
  posts: Post[] | null;
  podcasts: Post[] | null;
}): JSX.Element {
  return (
    <>
      <NextSeo
        title={`${tag.title ? tag.title : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/tags/${tag.slug}`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
          <h1>{tag.title}</h1>
        </section>
        {courses && courses.length > 0 && (
          <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
            <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
              Courses
            </h2>
            {courses && <PostsCards posts={courses} />}
          </section>
        )}
        {tutorials && tutorials.length > 0 && (
          <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
            <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
              Tutorials
            </h2>
            {tutorials && <PostsCards posts={tutorials} />}
          </section>
        )}
        {posts && posts.length > 0 && (
          <section className="grid w-full gap-10 px-4 mx-auto xl:px-10">
            <h2 className="mt-4 text-4xl text-primary-900 lg:text-5xl">
              Blog Posts
            </h2>
            {posts && <PostsCards posts={posts} />}
          </section>
        )}
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

interface StaticParams {
  site: Site;
  tag: Tag;
}

export const getServerSideProps: GetServerSideProps<StaticParams> = async ({
  params,
  preview,
}) => {
  const { tagPath } = params as any;

  if (!tagPath) {
    return {
      notFound: true,
    };
  }
  const tag = await getTagBySlugService({
    tag: 'framework',
    preview,
    slug: tagPath,
  });
  if (!tag) {
    return {
      notFound: true,
    };
  }

  const courses = await getPostsByTag({
    type: PostType.course,
    _id: tag._id,
    tag: 'frameworks',
  });
  const tutorials = await getPostsByTag({
    type: PostType.tutorial,
    _id: tag._id,
    tag: 'frameworks',
  });
  const posts = await getPostsByTag({
    type: PostType.post,
    _id: tag._id,
    tag: 'frameworks',
  });
  const podcasts = await getPostsByTag({
    type: PostType.podcast,
    _id: tag._id,
    tag: 'frameworks',
  });

  return {
    props: {
      site: await getSite({ preview }),
      tag,
      courses,
      tutorials,
      posts,
      podcasts,
    },
  };
};
