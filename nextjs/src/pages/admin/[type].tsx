import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';
import CreatePost from '@/components/Admin/CreatePost';

const EditPosts = dynamic(() => import('@/components/Admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Climbing a tree...</p>,
});

function AdminDashboard({ router }: { router: any }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <>
      <Head>
        <title>
          {`Admin-${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(
            2
          )} | CodingCatDev`}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex w-screen h-screen overflow-hidden bg-ccd-basics-100">
        <AdminMenu />
        <div className="flex flex-col flex-1 overflow-hidden ">
          <AdminTopBar />
          <main
            className="relative flex flex-col flex-1 overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <div className="flex flex-col flex-1">
              {router.asPath === path ? (
                <div className="flex flex-col flex-1 px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                  <h1 className="text-2xl font-semibold text-ccd-basics-900">
                    Dashboard
                  </h1>
                  <p className="text-lg">Show some welcoming things here.</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col flex-1 px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                    <CreatePost />
                    <EditPosts path={path} />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default withRouter(AdminDashboard);
