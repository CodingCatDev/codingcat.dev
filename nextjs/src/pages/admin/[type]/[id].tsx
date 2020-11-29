import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import MdxEditor from '@/components/MdxEditor';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({ router }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <div>
      <Head>
        <title>
          {`${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(2)}`} |
          CodingCatDev
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <main>
        <>
          <div className="h-screen flex overflow-hidden bg-gray-100">
            <AdminMenu router={router} />
            <div className="flex flex-col w-0 flex-1 overflow-hidden pt-16">
              <main
                className="flex-1 relative overflow-y-auto focus:outline-none"
                tabIndex={0}
              >
                <div className="m-6 border-2 border-ccd-primary-800 bg-white flex flex-col">
                  <EditPost className="flex-grow" />
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
