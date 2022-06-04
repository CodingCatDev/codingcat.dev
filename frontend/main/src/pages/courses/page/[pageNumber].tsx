import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import {
  queryByPublished,
  queryPurrfectStreamByReleased,
} from '@/services/notion.server';
import PostsCards from '@/components/PostsCards';
import PurrfectDevUpper from '@/components/PurrfectDevUpper';
import Layout from '@/layout/Layout';
import { PostType } from '@/models/post.model';
import { getSite } from '@/services/notion.server';
import { NextSeo } from 'next-seo';
import { Pagination } from '@/components/NotionPagination';

export async function getStaticProps({
  preview,
  params,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  let notionPosts;
  const pageNumber = params?.pageNumber ? parseInt(params?.pageNumber) : 1;

  //First get a cursor
  let raw = await queryByPublished(PostType.course, 20);
  let cursor = raw.next_cursor;
  let hasMore = raw.has_more;
  if (pageNumber == 1) {
    notionPosts = raw;
  } else {
    //Then loop until you get the correct page, (which stinks for perf)
    for (let p = 2; p <= pageNumber; p++) {
      if (hasMore) {
        let nextPosts = await queryByPublished(PostType.course, 20, cursor);
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
  let raw = await queryPurrfectStreamByReleased(10000);
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

const Podcasts = ({
  site,
  posts,
  showNext,
  pageNumber,
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
          <Pagination
            posts={posts}
            baseUrl="courses"
            pageNumber={pageNumber}
            showNext={showNext}
          />
        </div>
      </Layout>
    </>
  );
};
export default Podcasts;
