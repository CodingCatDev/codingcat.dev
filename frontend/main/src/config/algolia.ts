export const config = {
  searchKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  apiKey: process.env.ALGOLIA_API_KEY || '',
  index: process.env.NEXT_PUBLIC_ALGOLIA_INDEX || '',
};
