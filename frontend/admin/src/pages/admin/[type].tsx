import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import Layout from '@/layout/Layout';

import AdminMenu from '@/layout/AdminMenu';
import { PostType } from '@/models/post.model';
import { useState, useEffect } from 'react';

const EditPosts = dynamic(() => import('@/components/Admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Climbing a tree...</p>,
});

const CreatePost = dynamic(() => import('@/components/Admin/CreatePost'), {
  ssr: false,
});

function AdminDashboard({ router }: { router: any }) {
  const [type, setType] = useState(PostType.post);

  useEffect(() => {
    const pathType = router.query.type;
    switch (pathType) {
      case 'courses':
        setType(PostType.course);
        break;
      case 'lessons':
        setType(PostType.lesson);
        break;
      case 'tutorials':
        setType(PostType.tutorial);
        break;
      case 'podcasts':
        setType(PostType.podcast);
        break;
      default:
        setType(PostType.post);
        break;
    }
  }, [router]);

  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <Layout>
      <Head>
        <title>
          {`Admin-${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(
            2
          )} | CodingCatDev`}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex flex-col flex-1 h-full">
        {router.asPath === path ? (
          <div className="flex flex-col flex-1 px-4 mx-auto sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-lg">Show some welcoming things here.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-1 h-full px-4 mx-auto sm:px-6 md:px-8">
              <CreatePost type={type} />
              <EditPosts path={path} />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
