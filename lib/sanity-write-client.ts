import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

// Server-side Sanity client with write access (uses SANITY_API_TOKEN)
export const sanityWriteClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	token: process.env.SANITY_API_TOKEN,
});

// Alias for compatibility
export const writeClient = sanityWriteClient;
