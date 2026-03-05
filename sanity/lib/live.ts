import { defineLive } from "next-sanity/live";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

// SanityLive is only used in draft mode for real-time updates
const live = defineLive({
	client,
	serverToken: token || undefined,
	browserToken: token || undefined,
});

export const SanityLive = live.SanityLive;

// Re-export the ISR-compatible sanityFetch
export { sanityFetch } from "@/sanity/lib/fetch";
