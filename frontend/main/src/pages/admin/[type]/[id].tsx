import http from 'http';
import cookie from 'cookie';

import { NextSeo } from 'next-seo';
import AdminLayout from '@/layout/admin/AdminLayout';

import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { getSite, postById, validateAdminUser } from '@/services/serversideApi';
import EditPost from '@/components/admin/EditPost';
import { useSigninCheck } from 'reactfire';

export default function Edit({
  type,
  id,
  site,
  post,
}: {
  type: PostType | null;
  id: string | null;
  site: Site | null;
  post: Post;
}): JSX.Element {
  const { status, data: signInCheckResult } = useSigninCheck();

  return (
    <AdminLayout site={site} post={post}>
      <NextSeo title={`${type} | CodingCatDev`} noindex={true}></NextSeo>
      {signInCheckResult?.signedIn === true ? (
        <>
          {type && id ? (
            <EditPost type={type} id={id} user={signInCheckResult.user} />
          ) : (
            <div>Post Not Found.</div>
          )}
        </>
      ) : (
        <>Gathering Post Details...</>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps({
  params,
  req,
}: {
  params: { type: PostType; id: string };
  req: http.IncomingMessage;
}): Promise<
  | {
      props?: {
        type: PostType | null;
        id: string | null;
        site: Site | null;
        post: Post;
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
  const { type, id } = params;

  if (!type || !id || !site) {
    if (!type) console.log('Missing Type');
    if (!id) console.log('Missing ID');
    if (!site) console.log('Missing Site');
    console.log('Sending 404');
    return {
      notFound: true,
    };
  }

  const post = await postById(id);

  if (!post) {
    console.log('Post not found for id:', id);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      type,
      id,
      site,
      post,
    },
  };
}
