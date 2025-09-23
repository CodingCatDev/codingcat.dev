

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Podcast from '../../Podcast';

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token) return notFound();

  // Build absolute URL for API call
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/get-preview-content`;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    cache: 'no-store',
  });

  if (!res.ok) return notFound();
  const data = await res.json();

  if (!data || !data.document) return notFound();

  return (
    <Podcast podcast={data.document} />
  );
}
