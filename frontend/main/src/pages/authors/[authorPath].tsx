import {
  getSite,
  getPostsByUser,
  getAuthorBySlugService,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Author } from '@/models/user.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import AuthorCard from '@/components/authors/AuthorCard';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

interface StaticParams {
  site: Site;
  author: Author;
  courses: Post[];
  tutorials: Post[];
  posts: Post[];
}

export const getServerSideProps: GetServerSideProps<StaticParams> = async ({
  params,
  preview,
}) => {
  const { authorPath } = params as any;

  if (!authorPath) {
    return {
      notFound: true,
    };
  }
  const site = getSite();
  const author = await getAuthorBySlugService({
    preview,
    slug: authorPath,
  });
  console.log(author);
  const courses = await getPostsByUser({
    type: PostType.course,
    _id: author._id,
  });
  const tutorials = await getPostsByUser({
    type: PostType.tutorial,
    _id: author._id,
  });
  const posts = await getPostsByUser({ type: PostType.post, _id: author._id });

  if (!author) {
    console.log('Author not found');
    return {
      notFound: true,
    };
  }

  return {
    props: {
      site,
      author,
      courses,
      tutorials,
      posts,
    },
  };
};

export default function AuthorPage({
  site,
  author,
  courses,
  tutorials,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <NextSeo
        title={`${author.displayName ? author.displayName : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
          <AuthorCard author={author} />
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
      </Layout>
    </>
  );
}
