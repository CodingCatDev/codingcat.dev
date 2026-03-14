import { writeClient } from "@/lib/sanity-write-client";
import type { EngineConfig } from "@/lib/types/engine-config";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  data: EngineConfig;
  fetchedAt: number;
  refreshing: boolean;
}

let cache: CacheEntry | null = null;

async function refreshConfig(): Promise<EngineConfig> {
  const data = await writeClient.fetch<EngineConfig>(
    `*[_type == "engineConfig"][0]`
  );
  if (!data) {
    throw new Error(
      "engineConfig singleton not found — create it in Sanity Studio"
    );
  }
  cache = { data, fetchedAt: Date.now(), refreshing: false };
  return data;
}

export async function getEngineConfig(
  ttlMs = DEFAULT_TTL_MS
): Promise<EngineConfig> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < ttlMs) return cache.data;
  if (cache && !cache.refreshing) {
    cache.refreshing = true;
    refreshConfig().catch((err) => {
      console.error("[config] Background refresh failed:", err);
      if (cache) cache.refreshing = false;
    });
    return cache.data;
  }
  return refreshConfig();
}

export function getEngineConfigValue<K extends keyof EngineConfig>(
  config: EngineConfig,
  key: K,
  fallback?: EngineConfig[K]
): EngineConfig[K] {
  const value = config[key];
  if (value === undefined || value === null) {
    if (fallback !== undefined) return fallback;
  }
  return value;
}

export function invalidateEngineConfig() {
  cache = null;
}

// Backward compatibility — maps old table names to engineConfig fields
// This lets existing code using getConfig('pipeline_config') still work
// during migration. Remove after all callers are updated.
export { getEngineConfig as getConfig };
