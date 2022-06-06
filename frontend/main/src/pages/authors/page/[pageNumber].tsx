import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { queryByPublished } from '@/services/notion.server';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import { Pagination } from '@/components/NotionPagination';
import Authors from '@/components/authors/Authors';
import { Author } from '@/models/user.model';

export async function getStaticProps({
  preview,
  params,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  let notionPosts;
  const pageNumber = params?.pageNumber ? parseInt(params?.pageNumber) : 1;

  //First get a cursor
  let raw = await queryByPublished('author', 20);
  let cursor = raw.next_cursor;
  let hasMore = raw.has_more;
  if (pageNumber == 1) {
    notionPosts = raw;
  } else {
    //Then loop until you get the correct page, (which stinks for perf)
    for (let p = 2; p <= pageNumber; p++) {
      if (hasMore) {
        let nextPosts = await queryByPublished('author', 20, cursor);
        cursor = nextPosts.next_cursor;
        hasMore = nextPosts.has_more;
        if (p === pageNumber) {
          notionPosts = nextPosts;
        }
      }
    }
  }
  console.log('length', notionPosts?.results?.length);
  if (!notionPosts?.results?.length) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      site: getSite(),
      posts: notionPosts?.results ? notionPosts?.results : [],
      showNext: notionPosts?.has_more ?? false,
      pageNumber,
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  let raw = await queryByPublished('author', 20);
  const paths = sliceIntoChunks(raw.results, 20).map((_chunk, index) => ({
    params: { pageNumber: `${index + 1}` },
  }));
  console.log('paths', paths);
  return {
    paths,
    fallback: 'blocking',
  };
}

export const sliceIntoChunks = (arr: any[], chunkSize: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

const Blog = ({
  site,
  posts,
  showNext,
  pageNumber,
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
            baseUrl="authors"
            pageNumber={1}
            showNext={showNext}
          />
        </section>
      </Layout>
    </>
  );
};
export default Blog;
