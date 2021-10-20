import http from 'http';
import cookie from 'cookie';

import { NextSeo } from 'next-seo';

import AdminLayout from '@/layout/admin/AdminLayout';

import { PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { getSite, validateAdminUser } from '@/services/serversideApi';
import { resetServerContext } from 'react-beautiful-dnd';
import AdminPostTypes from '@/components/admin/AdminPostTypes';

export default function AdminPostTypesPage({
  type,
  site,
}: {
  type: PostType | null;
  site: Site | null;
}): JSX.Element {
  return (
    <>
      <NextSeo title={`${type} | CodingCatDev`} noindex={true}></NextSeo>

      <AdminLayout site={site}>
        <AdminPostTypes type={type} />
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { type: PostType };
  req: http.IncomingMessage;
}): Promise<
  | {
      props: {
        type: PostType | null;
        site: Site | null;
      };
    }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: boolean }
> {
  // Reset for Beautiful DnD
  resetServerContext();

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
  const { type } = params;
  return {
    props: {
      type,
      site,
    },
  };
}
