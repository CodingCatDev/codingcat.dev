import { NextSeo } from 'next-seo';
import Layout from '@/layout/Layout';
import Authors from '@/components/authors/Authors';

import { getAuthorProfiles, getSite } from '@/services/serversideApi';
import { Site } from '@/models/site.model';
import { UserInfoExtended } from '@/models/user.model';

export default function AuthorsPage({
  site,
  authors,
}: {
  site: Site | null;
  authors: UserInfoExtended[];
}): JSX.Element {
  return (
    <Layout site={site}>
      <NextSeo
        title="Authors | CodingCatDev"
        canonical={`https://codingcat.dev/authors/`}
      ></NextSeo>
      <section className="grid grid-cols-1 gap-10 p-4 sm:p-10 place-items-center">
        <h1 className="text-5xl lg:text-7xl">Authors</h1>
        <Authors authors={authors} />
      </section>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
    authors: UserInfoExtended[];
  };
  revalidate: number;
}> {
  const site = await getSite();
  const allAuthors = await getAuthorProfiles();

  // Return only authors with Profile Data
  const authors = allAuthors.filter((a) =>
    Object.keys(a).includes('basicInfo')
  );

  return {
    props: {
      site,
      authors,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
