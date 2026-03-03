import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/lib/api";

/**
 * Server-side Sanity client for dashboard operations.
 * Uses SANITY_API_TOKEN for authenticated read/write access.
 * No CDN (fresh data), no stega (no preview encoding).
 */
export const dashboardClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: false,
	token: process.env.SANITY_API_TOKEN,
});

/**
 * Fetch documents with a GROQ query using the dashboard client.
 */
export async function dashboardQuery<T = unknown>(
	query: string,
	params?: Record<string, unknown>,
): Promise<T> {
	return dashboardClient.fetch<T>(query, params ?? {});
}

/**
 * Patch a document by ID using the dashboard client.
 */
export async function dashboardPatch(
	id: string,
	operations: Record<string, unknown>,
) {
	return dashboardClient.patch(id).set(operations).commit();
}
