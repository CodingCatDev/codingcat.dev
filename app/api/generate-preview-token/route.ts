import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

// Set this in your environment variables for security
const SHARED_SECRET = process.env.NEXT_PUBLIC_PREVIEW_TOKEN_SECRET;
const sanityClient = createClient({
	projectId,
	dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN, // Must have write access
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const { documentId, secret } = await req.json();
  // check if authorized
  console.log('Received request to generate preview token for document ID:', documentId);
  console.log('Using secret:', secret);
  console.log('Expected secret:', SHARED_SECRET);

  if (!documentId || !secret || secret !== SHARED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

  // Create previewSession document in Sanity
  await sanityClient.create({
    _type: 'previewSession',
    token,
    documentId,
    expiresAt,
  });

  return NextResponse.json({ token, expiresAt });
}
