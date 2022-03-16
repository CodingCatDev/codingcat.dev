export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  apiVersion: '2021-05-19',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
};

export const webhook = {
  secret: process.env.SANITY_WEBHOOK_SECRET || '',
};