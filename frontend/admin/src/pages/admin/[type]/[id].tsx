import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import Layout from '@/layout/Layout';
import AdminMenu from '@/layout/AdminMenu';
import { useEffect, useState } from 'react';
import { PostType } from '@/models/post.model';

const EditPost = dynamic(() => import('@/components/Admin/EditPost'), {
  ssr: false,
  loading: () => <p>Chasing a mouse...</p>,
});

function AdminDashboard({
  router,
  handleThemeChange,
  darkMode,
}: {
  router: any;
  handleThemeChange: any;
  darkMode: boolean;
}) {
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
  return (
    <Layout handleThemeChange={handleThemeChange} darkMode={darkMode}>
      <Head>
        <title>{`Edit ${router.query.type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <EditPost router={router} type={type} />
    </Layout>
  );
}

export default withRouter(AdminDashboard);
