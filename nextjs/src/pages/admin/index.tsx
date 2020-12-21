import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';
import Layout from '@/layout/Layout';

const EditPosts = dynamic(() => import('@/components/Admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Finding Admin...</p>,
});

function AdminDashboard({ router }: { router: any }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <>
      <Layout>
        <Head>
          <title>
            {`${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(2)}`} |
            CodingCatDev
          </title>
          <meta name="robots" content="noindex" />
        </Head>

        <div className="grid grid-cols-12 justify-items-stretch">
          <div className="col-span-2">
            <AdminMenu />
          </div>
          <div className="grid col-span-10 place-content-center">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-lg">Show some welcoming things here.</p>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withRouter(AdminDashboard);
