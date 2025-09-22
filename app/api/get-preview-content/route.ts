import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-09-22',
  token: process.env.SANITY_API_TOKEN, // must have read access
  useCdn: false,
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

  return NextResponse.json({ document: doc });
}
