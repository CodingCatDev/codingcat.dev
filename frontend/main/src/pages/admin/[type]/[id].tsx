import http from 'http';
import cookie from 'cookie';

import Head from 'next/head';
import AdminLayout from '@/layout/admin/AdminLayout';

import { Post, PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { getSite, postById, validateAdminUser } from '@/services/serversideApi';
import EditPost from '@/components/admin/EditPost';

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
  return (
    <AdminLayout site={site} post={post}>
      <Head>
        <title>{`${type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {type && id ? (
        <EditPost type={type} id={id} />
      ) : (
        <div>Post Not Found.</div>
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
    return {
      notFound: true,
    };
  }

  const post = await postById(id);

  if (!post) {
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
