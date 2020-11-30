import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({ router }) {
  return (
    <>
      <Head>
        <title>{`Edit ${router.query.type}| CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex flex-1 overflow-auto no-scroll">
        <AdminMenu router={router} />
        <div className="flex flex-1 overflow-hidden ">
          <main
            className="flex flex-1 relative overflow-y-auto focus:outline-none"
            tabIndex={0}
          >
            <div className="flex flex-col flex-1 py-6">
              <div className="flex flex-col flex-1 max-w-7xl px-4 sm:px-6 md:px-8">
                <EditPost router={router} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default withRouter(AdminDashboard);
