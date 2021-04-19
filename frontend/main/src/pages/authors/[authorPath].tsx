import http from 'http';
import {
  getSite,
  getAuthorProfile,
  postsByUser,
} from '@/services/serversideApi';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { UserInfoExtended } from '@/models/user.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import AuthorCard from '@/components/authors/AuthorCard';

export default function AuthorPage({
  site,
  author,
  courses,
  tutorials,
  posts,
}: {
  site: Site | null;
  author: UserInfoExtended;
  courses: Post[] | null;
  tutorials: Post[] | null;
  posts: Post[] | null;
}): JSX.Element {
  return (
    <Layout site={site}>
      <NextSeo
        title={`${author.displayName ? author.displayName : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
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
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { authorPath: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        site: Site | null;
        author: UserInfoExtended | null;
        courses: Post[] | null;
        tutorials: Post[] | null;
        posts: Post[] | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { authorPath } = params;

  if (!authorPath) {
    return {
      notFound: true,
    };
  }
  const site = await getSite();
  const author = (await getAuthorProfile(authorPath)) as UserInfoExtended;
  const courses = await postsByUser(PostType.course, authorPath);
  const tutorials = await postsByUser(PostType.tutorial, authorPath);
  const posts = await postsByUser(PostType.post, authorPath);

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
}
