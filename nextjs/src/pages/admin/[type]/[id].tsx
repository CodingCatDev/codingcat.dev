import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import Layout from '@/layout/Layout';
import AdminMenu from '@/components/Admin/AdminMenu';
import AdminTopBar from '@/components/Admin/AdminTopBar';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({ router }: { router: any }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{`Edit ${router.query.type} | CodingCatDev`}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="grid grid-cols-12 justify-items-stretch">
          <div className="col-span-2">
            <AdminMenu />
          </div>
          <div className="col-span-10">
            <EditPost router={router} />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withRouter(AdminDashboard);
