import http from 'http';
import cookie from 'cookie';

import Head from 'next/head';
import AdminLayout from '@/layout/admin/AdminLayout';
import { getSite, validateAdminUser } from '@/services/serversideApi';
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
      <section className="p-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-lg">Show some welcoming things here.</p>
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
