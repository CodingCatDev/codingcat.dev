import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({ router }: { router: any }) {
  return (
    <>
      <Head>
        <title>{`Edit ${router.query.type}| CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex w-screen h-screen overflow-hidden bg-ccd-basics-100">
        <AdminMenu />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminTopBar />
          <main
            className="relative flex-1 overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <div className="flex flex-col flex-1 py-6">
              <div className="flex flex-col items-stretch flex-1 h-screen px-4 max-w-7xl sm:px-6 md:px-8">
                <EditPost router={router} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

{
  /* <>
<Head>
  <title>
    {`${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(2)}`} |
    CodingCatDev
  </title>
  <meta name="robots" content="noindex" />
</Head>

<div className="flex w-screen h-screen overflow-hidden bg-ccd-basics-100">
  <AdminMenu router={router} />
  <div className="flex flex-col flex-1 overflow-hidden">
    <AdminTopBar router={router} />
    <main
      className="relative flex-1 overflow-y-auto focus:outline-none"
      tabIndex={0}
    >
      <div className="py-6">
        {router.asPath === path ? (
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-ccd-basics-900">
              Dashboard
            </h1>
            <p className="text-lg">Show some welcoming things here.</p>
          </div>
        ) : (
          <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
            <EditPosts path={path} />
          </div>
        )}
      </div>
    </main>
  </div>
</div>
</> */
}

export default withRouter(AdminDashboard);
