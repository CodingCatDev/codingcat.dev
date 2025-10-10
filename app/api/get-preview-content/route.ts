import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { podcastQuery, postQuery } from '@/sanity/lib/queries';
import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: 'drafts',
});

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }

  // Find previewSession by token
  const session = await sanityClient.fetch(
    '*[_type == "previewSession" && token == $token && (!defined(expiresAt) || expiresAt > now())][0]',
    { token }
  );

  if (!session) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
  }

  // Fetch the draft document (post or podcast)
  const doc = await sanityClient.fetch(
    '*[_id == $docId && (_type == "post" || _type == "podcast")][0]',
    { docId: session.documentId }
  );

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (doc?._type !== 'post' && doc?._type !== 'podcast' && !doc.slug?.current) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if(doc?._type === 'podcast') {
    return NextResponse.json({ document: await sanityClient.fetch(podcastQuery, { slug: doc.slug.current }) });
  }

  if(doc?._type === 'post') {
    return NextResponse.json({ document: await sanityClient.fetch(postQuery, { slug: doc.slug.current }) });
  }

  return NextResponse.json({ error: 'Document not found' }, { status: 404 });
}
