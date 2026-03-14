import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

// Server-side Sanity client with write access
// Checks SANITY_API_TOKEN first, falls back to SANITY_API_WRITE_TOKEN for compatibility
export const sanityWriteClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

// Alias for compatibility
export const writeClient = sanityWriteClient;
