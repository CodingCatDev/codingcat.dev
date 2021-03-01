import http from 'http';
import cookie from 'cookie';

import Head from 'next/head';
import AdminLayout from '@/layout/admin/AdminLayout';
import { getSite, validateAdminUser } from '@/services/serversideApi';
import { Site } from '@/models/site.model';
import SiteData from '@/components/admin/SiteData';

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
      <section className="p-4">
        <header className="grid gap-4 mb-4 justify-items-start">
          <h1 className="font-sans text-4xl font-bold capitalize">Site</h1>
          <SiteData />
        </header>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { coursePath: string; lessonPath: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        site: Site | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  const cookies = cookie.parse(req.headers.cookie || '');
  const auth = cookies.auth;
  // Check for user authentication from cookie
  let validUser = true;
  if (auth) {
    const user = JSON.parse(auth) as {
      uid: string;
      email: string;
      token: string;
    };
    validUser = await validateAdminUser(user.token);
  } else {
    validUser = false;
  }

  if (!validUser) {
    return {
      redirect: {
        destination: `/user/profile`,
        permanent: false,
      },
    };
  }

  const site = await getSite();

  return {
    props: {
      site,
    },
  };
}
