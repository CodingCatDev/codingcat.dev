import Head from 'next/head';
import { withRouter } from 'next/router';
import Layout from '@/layout/Layout';

function AdminDashboard({ router }: { router: any }) {
  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <Layout>
      <Head>
        <title>
          {`${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(2)}`} |
          CodingCatDev
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="grid h-screen grid-cols-12 justify-items-stretch">
        <div className="grid col-span-10 place-content-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-lg">Show some welcoming things here.</p>
        </div>
      </div>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
