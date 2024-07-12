import { publicURL } from '@/lib/utils';
import { createClient } from 'next-sanity';
import type { NextRequest } from 'next/server';

const sanityReadClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  apiVersion: '2022-03-07',
  perspective: 'raw'
});

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  //Get all YouTube ID's and make calls
  const docs = await sanityReadClient.fetch(`*[youtube != null]{_id,youtube}`);
  for (const doc of docs) {
    const result = await fetch(publicURL() + `/api/youtube/views?youtube=${doc.youtube}&_id=${doc._id}`)
    console.debug(result.status);
  }

  return Response.json({ success: true });
}