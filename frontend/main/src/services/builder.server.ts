export const getAllBuilder = async ({
  preview = false,
  model,
  limit = 1000,
  published,
  omit,
  fields,
  includeRefs = true,
  userAttributes,
  offset = 0,
  startEnd,
}: {
  preview?: boolean;
  model: string;
  includeUnpublished?: boolean;
  limit?: number;
  published?: 'published' | 'archived' | 'draft';
  omit?: string;
  fields?: string;
  includeRefs?: boolean;
  userAttributes?: {
    urlPath: string;
  };
  offset?: number;
  startEnd?: boolean;
}) => {
  try {
    const response = await fetch(
      `https://builder.io/api/v2/content/${model}?apiKey=${process.env.NEXT_PUBLIC_BUILDER_PUBLIC_API_KEY}` +
        `&limit=${limit}` +
        (!startEnd
          ? ``
          : `&query.$and=%5B%7B%27%24or%27%3A%5B%7B%27startDate%27%3A%7B%27%24eq%27%3A%27null%27%7D%7D%2C%7B%27startDate%27%3A%7B%27%24lte%27%3A${Date.now()}` +
            `%7D%7D%5D%7D%2C%7B%27%24or%27%3A%5B%7B%27endDate%27%3A%7B%27%24eq%27%3A%27null%27%7D%7D%2C%7B%27endDate%27%3A%7B%27%24gte%27%3A${Date.now()}` +
            `%7D%7D%5D%7D%5D`) +
        // `&noCache=true&cachebust=true` +
        (offset ? `&offset=${offset}` : '') +
        (preview ? `&includeUnpublished=${preview}` : '') +
        (published ? `&query.published=${published}` : '') +
        (omit ? `&omit=${omit}` : '') +
        (fields ? `&fields=${fields}` : '') +
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

    const contentType = response.headers.get('content-type');
    if (contentType == 'application/json') {
    }
    // console.log(JSON.stringify(response.body));
    const json = await response.json();
    return json?.results;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};
