import Head from 'next/head';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';

import AdminLayout from '@/layout/admin/AdminLayout';

import { PostType } from '@/models/post.model';
import { useState, useEffect } from 'react';
import { Site } from '@/models/site.model';
import { getSite } from '@/services/serversideApi';
import EditPost from '@/components/admin/EditPost';

export default function Edit({
  type,
  id,
  site,
}: {
  type: PostType | null;
  id: string | null;
  site: Site | null;
}): JSX.Element {
  return (
    <AdminLayout site={site}>
      <Head>
        <title>{`${type} | CodingCatDev`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      {type && id ? (
        <EditPost type={type} id={id} />
      ) : (
        <div>Post Not Found.</div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { type: PostType; id: string };
}): Promise<{
  props: {
    type: PostType | null;
    id: string | null;
    site: Site | null;
  };
}> {
  const site = await getSite();
  const { type, id } = params;
  return {
    props: {
      type,
      id,
      site,
    },
  };
}
