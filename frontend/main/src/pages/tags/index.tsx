import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';

import { getTags, getSite } from '@/services/serversideApi';
import { Site } from '@/models/site.model';
import { Tag } from '@/models/tag.model';
import Link from 'next/link';

export default function AuthorsPage({
  site,
  tags,
}: {
  site: Site | null;
  tags: Tag[];
}): JSX.Element {
  return (
    <Layout site={site}>
      <NextSeo
        title="Tags | CodingCatDev"
        canonical={`https://codingcat.dev/tags/`}
      ></NextSeo>
      <section className="grid gap-10 p-4 sm:p-10 place-items-center">
        <h1 className="text-5xl lg:text-7xl">Tags</h1>
        <section className="grid grid-cols-12 gap-2">
          {tags.map((tag, i) => (
            <Link href={`/tags/${tag.slug}`} key={i}>
              <a className="flex flex-col items-center p-2 bg-primary-900 text-primary-50 rounded-xl">
                <p>{tag.tag}</p>
                <p className="flex-initial p-2 rounded-full text-basics-900 bg-secondary-500">
                  {tag.count}
                </p>
              </a>
            </Link>
          ))}
        </section>
      </section>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
    tags: Tag[];
  };
  revalidate: number;
}> {
  const site = await getSite();
  const tags = await getTags();

  return {
    props: {
      site,
      tags,
    },
    revalidate: 60,
  };
}
