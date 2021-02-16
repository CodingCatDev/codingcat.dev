import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminLayout from '@/layout/admin/AdminLayout';

import { PostType } from '@/models/post.model';
import { useState, useEffect } from 'react';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';
const EditPosts = dynamic(() => import('@/components/admin/EditPosts'), {
  ssr: false,
  loading: () => <p>Loading EditPosts...</p>,
});

const CreatePost = dynamic(() => import('@/components/admin/CreatePost'), {
  ssr: false,
});

export default function AdminDashboard({
  type,
  site,
}: {
  type: PostType | null;
  site: Site | null;
}): JSX.Element {
  return (
    <AdminLayout site={site}>
      <Head>
        <title>{`${type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <>
        {!type ? (
          <div>
            <h1>Dashboard</h1>
            <p>Show some welcoming things here.</p>
          </div>
        ) : (
          <>
            <header className="grid gap-4 mb-4 justify-items-start">
              <h1 className="font-sans text-4xl font-bold capitalize">
                {type}
              </h1>
              <CreatePost type={type} />
            </header>
            <EditPosts type={type} />
          </>
        )}
      </>
    </AdminLayout>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { type: PostType };
}): Promise<{
  props: {
    type: PostType | null;
    site: Site | null;
  };
}> {
  const site = await getSite();
  const { type } = params;
  return {
    props: {
      type,
      site,
    },
  };
}
