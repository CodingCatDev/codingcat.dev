import { NextSeo } from 'next-seo';
import Link from 'next/link';
import AJ404 from '@/components/global/icons/AJ404';

import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import builder from '@builder.io/react';
import Layout from '@/layout/Layout';

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  console.log(JSON.stringify(params));
  const [header, footer] = await Promise.all([
    builder.get('header').promise(),
    builder.get('footer').promise(),
  ]);

  return {
    props: {
      header: header || null,
      footer: footer || null,
    },
    revalidate: 5,
  };
}

export default function Custom404({
  header,
  footer,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextSeo title="404 | Not Found" noindex={true}></NextSeo>

      <Layout header={header} footer={footer}>
        <section className="grid content-start grid-cols-1 gap-10 p-4 text-center justify-items-center">
          <AJ404 />
          <h1 className="text-5xl lg:text-6xl">
            Uh oh, that page doesn&apos;t seem to exist.
          </h1>
          <h2 className="font-sans text-4xl lg:text-5xl">
            Were you looking for{' '}
            {/* add some logic here to say which route they clicked? */}
            <Link href="/courses">
              <a className="underline text-secondary-600">Courses</a>
            </Link>
          </h2>
        </section>
      </Layout>
    </>
  );
}
