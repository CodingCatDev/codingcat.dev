export const getAllBuilder = async ({
  preview = false,
  model,
  limit = 1000,
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
    const fetchInput =
      `https://builder.io/api/v2/content/${model}?apiKey=${process.env.NEXT_PUBLIC_BUILDER_PUBLIC_API_KEY}` +
      `&limit=${limit}` +
      (preview ? `&query.published.$ne="archived"` : ``) +
      (!startEnd
        ? ``
        : `&query.$and=%5B%7B%27%24or%27%3A%5B%7B%27startDate%27%3A%7B%27%24eq%27%3A%27null%27%7D%7D%2C%7B%27startDate%27%3A%7B%27%24lte%27%3A${Date.now()}` +
          `%7D%7D%5D%7D%2C%7B%27%24or%27%3A%5B%7B%27endDate%27%3A%7B%27%24eq%27%3A%27null%27%7D%7D%2C%7B%27endDate%27%3A%7B%27%24gte%27%3A${Date.now()}` +
          `%7D%7D%5D%7D%5D`) +
      (preview ? `&noCache=true&cachebust=true` : '') +
      (offset ? `&offset=${offset}` : '') +
      (preview ? `&includeUnpublished=${preview}` : '') +
      (omit ? `&omit=${omit}` : '') +
      (fields ? `&fields=${fields}` : '') +
      (includeRefs ? `&includeRefs=${includeRefs}` : '') +
      (userAttributes
        ? `&userAttributes.urlPath=${encodeURIComponent(
            userAttributes.urlPath
          )}`
        : '');
    console.log('fetchInput', JSON.stringify(fetchInput));
    const response = await fetch(fetchInput, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BUILDER_PRIVATE_KEY}`,
      },
    });

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

export const getAllQuery = async ({
  model,
  query,
  fields,
  omit,
}: {
  model: string;
  query: string;
  fields?: string;
  omit?: string;
}) => {
  try {
    const fetchInput =
      `https://builder.io/api/v2/content/${model}?apiKey=${process.env.NEXT_PUBLIC_BUILDER_PUBLIC_API_KEY}` +
      `&limit=10000` +
      `&${query}` +
      (fields ? `&fields=${fields}` : '') +
      (omit ? `&omit=${omit}` : '');
    console.log('fetchInput', JSON.stringify(fetchInput));
    const response = await fetch(fetchInput, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.BUILDER_PRIVATE_KEY}`,
      },
    });

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
