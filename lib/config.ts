import { writeClient } from "@/lib/sanity-write-client";
import type { ConfigTable, ConfigTypeMap } from "@/lib/types/config";

/**
 * Sanity config module with in-memory caching.
 *
 * Each config "table" maps to a Sanity singleton document type.
 * Uses writeClient.fetch for server-side reads.
 *
 * Caching: 5-minute TTL with stale-while-revalidate.
 * Sanity changes propagate on next cache miss.
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  refreshing: boolean;
}

const cache = new Map<string, CacheEntry<unknown>>();

// Map config table names to Sanity document type names
const TABLE_TO_TYPE: Record<ConfigTable, string> = {
  pipeline_config: "pipelineConfig",
  remotion_config: "remotionConfig",
  content_config: "contentConfig",
  sponsor_config: "sponsorConfig",
  distribution_config: "distributionConfig",
  gcs_config: "gcsConfig",
};

async function refreshConfig<T extends ConfigTable>(
  table: T,
): Promise<ConfigTypeMap[T]> {
  const sanityType = TABLE_TO_TYPE[table];
  const data = await writeClient.fetch(
    `*[_type == $type][0]`,
    { type: sanityType } as Record<string, unknown>,
  );

  if (!data) {
    throw new Error(`Config not found for ${sanityType} — create the singleton document in Sanity Studio`);
  }

  cache.set(table, {
    data,
    fetchedAt: Date.now(),
    refreshing: false,
  });

  return data as ConfigTypeMap[T];
}

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

  // Stale cache — return stale, refresh in background
  if (cached && !cached.refreshing) {
    cached.refreshing = true;
    refreshConfig(table).catch((err) => {
      console.error(`[config] Background refresh failed for ${table}:`, err);
      const entry = cache.get(table) as CacheEntry<unknown> | undefined;
      if (entry) entry.refreshing = false;
    });
    return cached.data;
  }

  // No cache — must fetch synchronously
  return refreshConfig(table);
}

/**
 * Get a single config value with optional env var fallback.
 * Useful during migration period.
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
    // Use fallback when field is undefined/null (not yet set in Sanity)
    if (value === undefined || value === null) {
      if (fallback !== undefined) return fallback;
    }
    return value;
  } catch {
    if (fallback !== undefined) return fallback;
    throw new Error(`Config value ${String(key)} not found in ${table}`);
  }
}

/**
 * Force-clear cached config. Called when config is known to have changed.
 */
export function invalidateConfig(table?: ConfigTable) {
  if (table) {
    cache.delete(table);
  } else {
    cache.clear();
  }
}
