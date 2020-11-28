import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';

const EditPosts = dynamic(() => import('@/components/Admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Climbing a tree...</p>,
});

function AdminDashboard({ router }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <div>
      <Head>
        <title>
          {`Admin-${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(
            2
          )} | CodingCatDev`}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <>
          <div className="h-screen flex overflow-hidden bg-gray-100">
            <AdminMenu router={router} />
            <div className="flex flex-col w-0 flex-1 overflow-hidden pt-16">
              <AdminTopBar router={router} />
              <main
                className="flex-1 relative overflow-y-auto focus:outline-none"
                tabIndex={0}
              >
                <div className="py-6">
                  {router.asPath === path ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        Dashboard
                      </h1>
                      <p className="text-lg">
                        Show some welcoming things here.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      <EditPosts path={path} />
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </>
      </main>

      <footer></footer>
    </div>
  );
}

export default withRouter(AdminDashboard);
