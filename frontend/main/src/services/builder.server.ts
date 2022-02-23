export const getAllBuilder = async ({
  preview = false,
  model,
  includeUnpublished = false,
  limit = 1000,
  published,
  omit,
  includeRefs = true,
  userAttributes,
}: {
  preview?: boolean;
  model: string;
  includeUnpublished?: boolean;
  limit?: number;
  published?: 'published' | 'archived' | 'draft';
  omit?: string;
  includeRefs?: boolean;
  userAttributes?: {
    urlPath: string;
  };
}) => {
  const response = await fetch(
    `https://builder.io/api/v2/content/${model}?apiKey=${process.env.NEXT_PUBLIC_BUILDER_PUBLIC_API_KEY}` +
      `&noCache=true&cachebust=true&limit=${limit}` +
      (preview ? `&includeUnpublished=${preview}` : '') +
      (published ? `&query.published=${published}` : '') +
      (omit ? `&omit=${omit}` : '') +
      (includeUnpublished ? `&includeUnpublished=${includeUnpublished}` : '') +
      (includeRefs ? `&includeRefs=${includeRefs}` : '') +
      (userAttributes
        ? `&userAttributes.urlPath=${encodeURIComponent(
            userAttributes.urlPath
          )}`
        : ''),
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BUILDER_PRIVATE_KEY}`,
      },
    }
  );
  const json = await response.json();
  return json?.results;
};
