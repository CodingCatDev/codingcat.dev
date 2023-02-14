import {
  getSite,
  queryRelationById,
  queryNotionDbBySlug,
  queryByPublished,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import { Tag } from '@/models/tag.model';
import { GetStaticPaths, GetStaticProps } from 'next';

interface StaticParams {
  site: Site;
  tag: Tag;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Don't build
  // const tags = await queryByPublished('language', 10000);
  // const paths: { params: { tagPath: string } }[] = [];

  // for (const p of tags.results) {
  //   if (p.slug) {
  //     paths.push({
  //       params: {
  //         tagPath: `${p.slug}`,
  //       },
  //     });
  //   }
  // }
  return {
    paths: [],
    fallback: 'blocking',
  };
};
export const getStaticProps: GetStaticProps<StaticParams> = async ({
  params,
  preview,
}) => {
  const tagPath = params?.tagPath;

  if (!tagPath || Array.isArray(tagPath)) {
    return {
      notFound: true,
    };
  }

  const raw = await queryNotionDbBySlug('language', tagPath);
  const tag = raw?.results?.at(0) as unknown as Tag;

  if (!tag) {
    return {
      notFound: true,
    };
  }
  const courses = (
    await queryRelationById(tag._id, 'languages', PostType.course)
  ).results;
  const tutorials = (
    await queryRelationById(tag._id, 'languages', PostType.tutorial)
  ).results;
  const posts = (await queryRelationById(tag._id, 'languages', PostType.post))
    .results;
  const podcasts = (
    await queryRelationById(tag._id, 'languages', PostType.podcast)
  ).results;

  return {
    props: {
      site: getSite(),
      tag,
      courses,
      tutorials,
      posts,
      podcasts,
    },
  };
};

export default function LanguagePage({
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
