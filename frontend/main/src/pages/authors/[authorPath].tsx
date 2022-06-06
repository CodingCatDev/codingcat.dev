import {
  getSite,
  getPostsByUser,
  getAuthorPageMarkdown,
  queryByPublished,
  queryRelationById,
} from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Site } from '@/models/site.model';
import { Author } from '@/models/user.model';
import { Post, PostType } from '@/models/post.model';
import PostsCards from '@/components/PostsCards';
import AuthorCard from '@/components/authors/AuthorCard';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';
import { config } from '@/config/notion';

interface StaticParams {
  site: Site;
  author: Author;
  source: MDXRemoteSerializeResult | null;
  courses: Post[];
  tutorials: Post[];
  posts: Post[];
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { authorPath: string } }[] = [];
  const authors = await queryByPublished('author', 10000);

  for (const p of authors.results) {
    if (p.slug) {
      paths.push({
        params: {
          authorPath: `${p.slug}`,
        },
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  params,
  preview,
  previewData,
}) => {
  const { authorPath } = params as any;

  if (!authorPath) {
    return {
      notFound: true,
    };
  }
  const site = getSite();
  const author = await getAuthorPageMarkdown(authorPath);

  if (!author) {
    console.log('Author not found');
    return {
      notFound: true,
    };
  }

  const [courses, tutorials, posts] = await Promise.all([
    queryRelationById(author.id, 'authors', PostType.course),
    queryRelationById(author.id, 'authors', PostType.tutorial),
    queryRelationById(author.id, 'authors', PostType.post),
  ]);

  let source: MDXRemoteSerializeResult | null;
  let allContent = '';

  if (author && author.content) {
    const { content } = matter(author.content);
    allContent = allContent + content;
  }
  if (allContent) {
    source = await serialize(allContent, {
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    });
  } else {
    source = null;
  }

  return {
    props: {
      site,
      author,
      source,
      courses: courses.results,
      tutorials: tutorials.results,
      posts: posts.results,
    },
  };
};

export default function AuthorPage({
  site,
  author,
  source,
  courses,
  tutorials,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title={`${author.displayName ? author.displayName : ''} | CodingCatDev`}
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-20 p-4 sm:p-10 place-items-center">
          <article className="grid items-start grid-cols-1 gap-4 p-4 shadow-lg rounded-xl justify-items-center justify-self-center bg-basics-50 text-basics-900 hover:text-basics-900 hover:shadow-sm">
            <AuthorCard author={author} source={source} />
          </article>
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
