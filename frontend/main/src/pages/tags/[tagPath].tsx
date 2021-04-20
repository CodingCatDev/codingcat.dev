import http from 'http';
import { getSite, getTagBySlug, postsByTag } from '@/services/serversideApi';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { UserInfoExtended } from '@/models/user.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import AuthorCard from '@/components/authors/AuthorCard';
import { Tag } from '@/models/tag.model';

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
    <Layout site={site}>
      <NextSeo
        title={`${tag.tag ? tag.tag : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/tag/${tag.slug}`}
      ></NextSeo>
      <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
        <h1>{tag.tag}</h1>
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
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { tagPath: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        site: Site | null;
        tag: Tag;
        courses: Post[] | null;
        tutorials: Post[] | null;
        posts: Post[] | null;
        podcasts: Post[] | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const { tagPath } = params;

  if (!tagPath) {
    return {
      notFound: true,
    };
  }
  const site = await getSite();
  const tag = await getTagBySlug(tagPath);
  if (!tag) {
    return {
      notFound: true,
    };
  }

  const courses = await postsByTag(PostType.course, tag.tag);
  const tutorials = await postsByTag(PostType.tutorial, tag.tag);
  const posts = await postsByTag(PostType.post, tag.tag);
  const podcasts = await postsByTag(PostType.podcast, tag.tag);

  return {
    props: {
      site,
      tag,
      courses,
      tutorials,
      posts,
      podcasts,
    },
  };
}
