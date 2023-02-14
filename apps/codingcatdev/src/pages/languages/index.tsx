import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';

import { getTags, getSite, queryByPublished } from '@/services/notion.server';
import { Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';
import Link from 'next/link';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

interface StaticParams {
  site: Site;
  tags: Tag[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: getSite(),
      tags: (await queryByPublished('language', 10000))
        .results as unknown as Tag[],
    },
    revalidate: 360,
  };
};

export default function FrameworksPage({
  site,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Frameworks | CodingCatDev"
        canonical={`https://codingcat.dev/tags/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid gap-10 p-4 sm:p-10 place-items-center">
          <h1 className="text-5xl lg:text-7xl">Languages</h1>
          <section className="grid grid-cols-1 gap-2">
            <a className="grid grid-cols-5 gap-2 p-2 border-solid border-primary-500">
              <p>Framework</p>
              <p>Courses</p>
              <p>Tutorials</p>
              <p>Podcasts</p>
              <p>Blog</p>
            </a>
            {tags.map((tag, i) => (
              <Link
                href={`/languages/${tag.slug}`}
                key={i}
                className="grid grid-cols-5 gap-2 p-2 bg-primary-900 text-primary-50 rounded-xl"
              >
                <p className="">{tag.title}</p>
                <p className="flex-initial text-basics-50 ">
                  {tag?.courses_count}
                </p>
                <p className="flex-initial text-basics-50 ">
                  {tag?.tutorials_count}
                </p>
                <p className="flex-initial text-basics-50 ">
                  {tag?.podcasts_count}
                </p>
                <p className="flex-initial text-basics-50 ">
                  {tag?.posts_count}
                </p>
              </Link>
            ))}
          </section>
        </section>
      </Layout>
    </>
  );
}
