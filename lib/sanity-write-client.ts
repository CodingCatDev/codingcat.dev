import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/lib/api'

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
  useCdn: false,
})
