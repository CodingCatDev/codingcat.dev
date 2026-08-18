/**
 * Sanity connection config.
 *
 * Resolved per-request rather than at module scope: on Workers the values in
 * `wrangler.jsonc` `vars` arrive through `locals.runtime.env`, and are NOT
 * visible to `import.meta.env` (which Vite bakes in at build time). The
 * `import.meta.env` fallback exists so `astro dev` works without a Worker.
 */

export interface SanityConfig {
	projectId: string;
	dataset: string;
	apiVersion: string;
	/**
	 * Absolute Studio URL used for stega edit-intent links.
	 *
	 * MUST include the workspace basePath. sanity.config.ts defines workspaces
	 * with basePath "/production" and "/dev"; without it every click-to-edit
	 * link lands on the workspace picker instead of the document.
	 */
	studioUrl: string;
}

type EnvLike = Record<string, string | undefined>;

/** apiVersion is pinned to match apps/sanity/sanity.config.ts exactly. */
const DEFAULTS = {
	projectId: "hfh83o0w",
	dataset: "production",
	apiVersion: "2025-09-30",
	studioUrl: "https://codingcat.dev.sanity.studio/production",
} as const;

function read(env: EnvLike | undefined, key: string): string | undefined {
	const fromRuntime = env?.[key];
	if (fromRuntime) {
		return fromRuntime;
	}
	const fromBuild = (import.meta.env as EnvLike)[key];
	return fromBuild || undefined;
}

export function resolveSanityConfig(env?: EnvLike): SanityConfig {
	return {
		projectId: read(env, "PUBLIC_SANITY_PROJECT_ID") ?? DEFAULTS.projectId,
		dataset: read(env, "PUBLIC_SANITY_DATASET") ?? DEFAULTS.dataset,
		apiVersion: read(env, "PUBLIC_SANITY_API_VERSION") ?? DEFAULTS.apiVersion,
		studioUrl: read(env, "PUBLIC_SANITY_STUDIO_URL") ?? DEFAULTS.studioUrl,
	};
}
