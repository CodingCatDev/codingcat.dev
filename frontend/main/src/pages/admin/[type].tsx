import http from 'http';
import cookie from 'cookie';

import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

import AdminLayout from '@/layout/admin/AdminLayout';
import SiteData from '@/components/admin/SiteData';
import EditPosts from '@/components/admin/EditPosts';
import CreatePost from '@/components/admin/CreatePost';

import { PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { getSite, validateAdminUser } from '@/services/serversideApi';
import { resetServerContext } from 'react-beautiful-dnd';
import { useSigninCheck } from 'reactfire';

export default function NavTypes({
  type,
  site,
}: {
  type: PostType | null;
  site: Site | null;
}): JSX.Element {
  const { status, data: signInCheckResult } = useSigninCheck();

  return (
    <AdminLayout site={site}>
      <NextSeo title={`${type} | CodingCatDev`} noindex={true}></NextSeo>

      {type && (type as string) == 'site' && (
        <div className="p-4">
          <SiteData />
        </div>
      )}
      {type && (type as string) !== 'site' && (
        <>
          {signInCheckResult?.signedIn === true && signInCheckResult?.user ? (
            <div className="p-4">
              <header className="grid gap-4 mb-4 justify-items-start">
                <h1 className="font-sans text-4xl font-bold capitalize">
                  {type}
                </h1>
                <CreatePost type={type} user={signInCheckResult.user} />
              </header>
              <EditPosts type={type} />
            </div>
          ) : (
            <span>Checking Authentication...</span>
          )}
        </>
      )}
    </AdminLayout>
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
