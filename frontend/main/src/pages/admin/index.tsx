import Head from 'next/head';
import AdminLayout from '@/layout/admin/AdminLayout';
import { getSite } from '@/services/serversideApi';
import { Site } from '@/models/site.model';

export default function AdminDashboard({
  site,
}: {
  site: Site | null;
}): JSX.Element {
  return (
    <AdminLayout site={site}>
      <Head>
        <title>Admin Dashboard | CodingCatDev</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-lg">Show some welcoming things here.</p>
      </section>
    </AdminLayout>
  );
}

export async function getStaticProps(): Promise<{
  props: {
    site: Site | null;
  };
  revalidate: number;
}> {
  const site = await getSite();

  return {
    props: {
      site,
    },
    revalidate: 60,
  };
}
