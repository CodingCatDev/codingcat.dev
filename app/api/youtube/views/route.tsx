import { youtubeParser } from '@/lib/utils';
import { createClient } from 'next-sanity';
import type { NextRequest } from 'next/server';

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: 'raw'
});

export async function GET(request: NextRequest) {
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   });
  // }

  const searchParams = request.nextUrl.searchParams;
  const youtube = searchParams.get('youtube');
  const _id = searchParams.get('_id');

  if (!_id) {
    console.error('Missing Sanity ID');
    return new Response('Missing Sanity ID', { status: 404 });
  }

  if (!youtube) {
    console.error('Missing YouTube URL');
    return new Response('Missing YouTube URL', { status: 404 });
  }
  const id = youtubeParser(youtube)
  if (!id) {
    console.error('Missing YouTube Id');
    return new Response('Missing YouTube Id', { status: 404 });
  }

  try {
    const videoResp = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_API_KEY}&fields=items(id,statistics)&part=statistics`)
    const json = await videoResp.json();
    if (videoResp.status !== 200) {
      console.error(JSON.stringify(json));
      return Response.json(json, { status: videoResp.status })
    }
    console.debug(JSON.stringify(json));
    const statistics = json?.items?.at(0)?.statistics;

    if (!statistics) {
      const words = `No statistics found for YouTube Id ${id}`
      console.error(words);
      return new Response(words, { status: 404 });
    }

    const sanityUpdate = await sanityWriteClient.patch(_id).set({
      'statistics.youtube.commentCount': parseInt(statistics.commentCount),
      'statistics.youtube.favoriteCount': parseInt(statistics.favoriteCount),
      'statistics.youtube.likeCount': parseInt(statistics.likeCount),
      'statistics.youtube.viewCount': parseInt(statistics.viewCount),
    }).commit();
    return Response.json(sanityUpdate);
  } catch (error) {
    console.error(JSON.stringify(error));
    return Response.json({ success: false }, { status: 404 });
  }
}