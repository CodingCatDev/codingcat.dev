import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import Authors from '@/components/authors/Authors';

import { Site } from '@/models/site.model';
import { Author } from '@/models/user.model';
import { getAuthors, getSite } from '@/services/sanity.server';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

interface StaticParams {
  site: Site;
  authors: Author[];
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: await getSite({ preview }),
      authors: await getAuthors({ preview }),
    },
    revalidate: 3600,
  };
};

export default function AuthorsPage({
  site,
  authors,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo
        title="Authors | CodingCatDev"
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <Layout site={site}>
        <section className="grid grid-cols-1 gap-10 p-4 sm:p-10 place-items-center">
          <h1 className="text-5xl lg:text-7xl">Authors</h1>
          <Authors authors={authors} />
        </section>
      </Layout>
    </>
  );
}
