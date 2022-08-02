import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import { Post } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { queryByPublished } from '@/services/notion.server';
import { getSite } from '@/services/notion.server';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Pagination } from '@/components/NotionPagination';
import Authors from '@/components/authors/Authors';
import { Author } from '@/models/user.model';
interface StaticParams {
  site: Site;
  posts: Post[];
  showNext: boolean;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  const notionPosts = await queryByPublished('author', 20);

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
        title="Authors | CodingCatDev"
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-10 p-4 sm:p-10 place-items-center">
          <h1 className="text-5xl lg:text-7xl">Authors</h1>
          <Authors authors={posts as unknown as Author[]} />
          <Pagination
            posts={posts}
            baseUrl="author"
            pageNumber={1}
            showNext={showNext}
          />
        </section>
      </Layout>
    </>
  );
};
export default Podcasts;
