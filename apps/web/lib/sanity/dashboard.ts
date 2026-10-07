import { createClient, type SanityClient } from "@sanity/client";
import { projectId, dataset, apiVersion } from "@/sanity/lib/api";

/**
 * Server-side Sanity client for dashboard operations.
 * Uses SANITY_API_TOKEN for authenticated read/write access.
 * No CDN (fresh data), no stega (no preview encoding).
 *
 * Returns null if SANITY_API_TOKEN is not set (e.g., during build).
 */
function createDashboardClient(): SanityClient | null {
	const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
	if (!token) {
		console.warn(
			"SANITY_API_TOKEN not set — dashboard queries will return empty results",
		);
		return null;
	}
	return createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		token,
	});
}

export const dashboardClient = createDashboardClient();

/**
 * Fetch documents with a GROQ query using the dashboard client.
 * Returns empty/default result if client is not available.
 */
export async function dashboardQuery<T = unknown>(
	query: string,
	params?: Record<string, unknown>,
): Promise<T> {
	if (!dashboardClient) {
		return (Array.isArray([] as unknown as T) ? [] : 0) as T;
	}
	return dashboardClient.fetch<T>(query, params ?? {});
}

/**
 * Patch a document by ID using the dashboard client.
 */
export async function dashboardPatch(
	id: string,
	operations: Record<string, unknown>,
) {
	if (!dashboardClient) {
		throw new Error("SANITY_API_TOKEN not set — cannot perform mutations");
	}
	return dashboardClient.patch(id).set(operations).commit();
}
