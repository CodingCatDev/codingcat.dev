import http from 'http';
import cookie from 'cookie';

import Head from 'next/head';
import dynamic from 'next/dynamic';

import AdminLayout from '@/layout/admin/AdminLayout';

import { PostType } from '@/models/post.model';
import { Site } from '@/models/site.model';
import { getSite, validateAdminUser } from '@/services/serversideApi';
const EditPosts = dynamic(() => import('@/components/admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Loading EditPosts...</p>,
});

const CreatePost = dynamic(() => import('@/components/admin/CreatePost'), {
  ssr: false,
});

export default function AdminDashboard({
  type,
  site,
}: {
  type: PostType | null;
  site: Site | null;
}): JSX.Element {
  return (
    <AdminLayout site={site}>
      <Head>
        <title>{`${type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {type && (
        <div className="p-4">
          <header className="grid gap-4 mb-4 justify-items-start">
            <h1 className="font-sans text-4xl font-bold capitalize">{type}</h1>
            <CreatePost type={type} />
          </header>
          <EditPosts type={type} />
        </div>
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
  const { type } = params;
  return {
    props: {
      type,
      site,
    },
  };
}
