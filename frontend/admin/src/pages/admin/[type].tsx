import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import Layout from '@/layout/Layout';
import { Grid } from '@material-ui/core';

import { PostType } from '@/models/post.model';
import { useState, useEffect } from 'react';
const EditPosts = dynamic(() => import('@/components/Admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Loading EditPosts...</p>,
});

const CreatePost = dynamic(() => import('@/components/Admin/CreatePost'), {
  ssr: false,
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
      case 'posts':
        setType(PostType.podcast);
        break;
      case 'podcasts':
        setType(PostType.podcast);
        break;
      case 'community':
        setType(PostType.group);
        break;
      default:
        setType(PostType.page);
        break;
    }
  }, [router]);

  const path = `/${router.asPath.substring(
    router.asPath.lastIndexOf('/') + 1
  )}`;
  return (
    <Layout handleThemeChange={handleThemeChange} darkMode={darkMode}>
      <Head>
        <title>
          {`Admin-${path.substr(1).substr(0, 1).toUpperCase()}${path.substr(
            2
          )} | CodingCatDev`}
        </title>
        <meta name="robots" content="noindex" />
      </Head>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="flex-start"
        style={{ paddingTop: '0.25rem' }}
      >
        {' '}
        {router.asPath === path ? (
          <div>
            <h1>Dashboard</h1>
            <p>Show some welcoming things here.</p>
          </div>
        ) : (
          <>
            <div style={{ width: '100%' }}>
              <CreatePost type={type} />
              <EditPosts path={path} />
            </div>
          </>
        )}
      </Grid>
    </Layout>
  );
}

export default withRouter(AdminDashboard);
