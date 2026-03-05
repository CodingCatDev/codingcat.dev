import { createClient } from "@supabase/supabase-js";
import type { ConfigTable, ConfigTypeMap } from "@/lib/types/config";

/**
 * Supabase config module with stale-while-revalidate caching.
 *
 * Caching behavior:
 * - Cold start: fetches from Supabase, caches result
 * - Warm (< TTL): returns cached data, zero DB queries
 * - Stale (> TTL): returns cached data immediately, refreshes in background
 * - Invalidate: called by dashboard "Save" button via /api/dashboard/config/invalidate
 *
 * Serverless reality: each Vercel instance has its own in-memory cache.
 * Worst case: TTL propagation delay across instances. Acceptable for config.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
	data: T;
	fetchedAt: number;
	refreshing: boolean;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Create a Supabase client for config reads.
 * Uses service role key for server-side access (no RLS).
 */
function getSupabaseClient() {
	const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !key) {
		throw new Error(
			"Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for config access",
		);
	}

	return createClient(url, key, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});
}

/**
 * Fetch a singleton config row from Supabase and update the cache.
 */
async function refreshConfig<T extends ConfigTable>(
	table: T,
): Promise<ConfigTypeMap[T]> {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase
		.from(table)
		.select("*")
		.limit(1)
		.single();

	if (error) {
		throw new Error(`Config fetch failed for ${table}: ${error.message}`);
	}

	cache.set(table, {
		data,
		fetchedAt: Date.now(),
		refreshing: false,
	});

	return data as ConfigTypeMap[T];
}

/**
 * Get config for a table with stale-while-revalidate caching.
 *
 * @param table - The config table name
 * @param ttlMs - Cache TTL in milliseconds (default: 5 minutes)
 * @returns The config row data
 *
 * @example
 * const pipeline = await getConfig("pipeline_config");
 * console.log(pipeline.gemini_model); // "gemini-2.0-flash"
 */
export async function getConfig<T extends ConfigTable>(
	table: T,
	ttlMs = DEFAULT_TTL_MS,
): Promise<ConfigTypeMap[T]> {
	const cached = cache.get(table) as CacheEntry<ConfigTypeMap[T]> | undefined;
	const now = Date.now();

	// Fresh cache — return immediately
	if (cached && now - cached.fetchedAt < ttlMs) {
		return cached.data;
	}

	// Stale cache — return stale data, refresh in background
	if (cached && !cached.refreshing) {
		cached.refreshing = true;
		refreshConfig(table).catch((err) => {
			console.error(`Background config refresh failed for ${table}:`, err);
			cached.refreshing = false;
		});
		return cached.data;
	}

	// No cache — must fetch synchronously
	return refreshConfig(table);
}

/**
 * Force-invalidate cached config. Called by the dashboard after saving settings.
 *
 * @param table - Specific table to invalidate, or undefined to clear all
 */
export function invalidateConfig(table?: ConfigTable) {
	if (table) {
		cache.delete(table);
	} else {
		cache.clear();
	}
}

/**
 * Get a config value with an env var fallback.
 * Use during migration — once all config is in Supabase, remove fallbacks.
 *
 * @example
 * const model = await getConfigValue("pipeline_config", "gemini_model", process.env.GEMINI_MODEL);
 */
export async function getConfigValue<
	T extends ConfigTable,
	K extends keyof ConfigTypeMap[T],
>(
	table: T,
	key: K,
	fallback?: ConfigTypeMap[T][K],
): Promise<ConfigTypeMap[T][K]> {
	try {
		const config = await getConfig(table);
		const value = config[key];
		if (value !== undefined && value !== null) {
			return value;
		}
	} catch (err) {
		console.warn(`Config lookup failed for ${String(table)}.${String(key)}, using fallback:`, err);
	}

	if (fallback !== undefined) {
		return fallback;
	}

	throw new Error(`No config value for ${String(table)}.${String(key)} and no fallback provided`);
}
