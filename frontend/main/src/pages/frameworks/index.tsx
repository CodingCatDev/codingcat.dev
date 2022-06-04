import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';

import { getTags, getSite } from '@/services/notion.server';
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
      tags: await getTags({ preview, tag: 'framework' }),
    },
    revalidate: 360,
  };
};

export default function AuthorsPage({
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
          <h1 className="text-5xl lg:text-7xl">Tags</h1>
          <section className="grid grid-cols-12 gap-2">
            {tags.map((tag, i) => (
              <Link href={`/frameworks/${tag.slug}`} key={i}>
                <a className="flex flex-col items-center p-2 bg-primary-900 text-primary-50 rounded-xl">
                  <p>{tag.title}</p>
                  <p className="flex-initial p-2 rounded-full text-basics-900 bg-secondary-500">
                    {tag.count}
                  </p>
                </a>
              </Link>
            ))}
          </section>
        </section>
      </Layout>
    </>
  );
}
