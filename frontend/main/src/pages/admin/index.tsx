import http from 'http';
import cookie from 'cookie';

import { NextSeo } from 'next-seo';
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
      <NextSeo title="Admin Dashboard | CodingCatDev" noindex={true}></NextSeo>

      <section className="p-4">
        <header className="grid grid-cols-1 gap-4 mb-4 justify-items-start">
          This should show more current details for logged in user.
        </header>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps({
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
    console.log('User is not valid, or unauthenticated');

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
