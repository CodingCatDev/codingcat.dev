import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components (browser).
 * Note: NEXT_PUBLIC_ prefix is required for browser access.
 * Falls back to non-prefixed names for flexibility.
 */
export function createClient() {
	const supabaseUrl =
		process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
	const supabaseAnonKey =
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Missing Supabase environment variables",
		);
	}

	return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
