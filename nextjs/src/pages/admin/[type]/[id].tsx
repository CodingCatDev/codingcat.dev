import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({ router }) {
  return (
    <div>
      <Head>
        <title>{`Edit ${router.query.type}| CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <>
          <div className="flex overflow-hidden bg-gray-100">
            <AdminMenu router={router} />
            <div className="flex flex-col w-0 flex-1 overflow-hidden pt-16">
              <main
                className="flex-1 relative overflow-y-auto focus:outline-none"
                tabIndex={0}
              >
                <div className="m-6">
                  <EditPost className="h-48 bg-blue-200" router={router} />
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
