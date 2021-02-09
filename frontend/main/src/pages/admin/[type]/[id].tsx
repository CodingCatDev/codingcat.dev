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

      <EditPost type={type} />
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
