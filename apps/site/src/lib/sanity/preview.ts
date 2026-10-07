import type { ClientPerspective } from "@sanity/client";

/** Set by /api/draft-mode/enable, cleared by /api/draft-mode/disable. */
export const PREVIEW_COOKIE = "__sanity_preview";

/** Studio writes this when the editor switches perspective in Presentation. */
export const PERSPECTIVE_PARAM = "sanity-preview-perspective";

export type PreviewContext =
	| { enabled: false }
	| { enabled: true; token: string; perspective: ClientPerspective };

interface ResolvePreviewInput {
	env: Record<string, string | undefined> | undefined;
	hasPreviewCookie: boolean;
	perspectiveParam: string | null;
}

function parsePerspective(raw: string | null): ClientPerspective {
	if (!raw || raw === "drafts") {
		return "drafts";
	}
	if (raw === "published") {
		return "published";
	}
	// Otherwise it is one or more release IDs, which the client accepts as an array.
	const releases = raw
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
	return releases.length ? (releases as ClientPerspective) : "drafts";
}

/**
 * Decide whether this request renders drafts.
 *
 * The read token is taken from the runtime env, never `import.meta.env`: Vite
 * inlines non-PUBLIC_ vars into the server bundle, which would bake the token
 * into the deployed Worker script instead of leaving it a Cloudflare secret.
 *
 * Fails closed — a missing token disables preview rather than erroring the page.
 */
export function resolvePreview({
	env,
	hasPreviewCookie,
	perspectiveParam,
}: ResolvePreviewInput): PreviewContext {
	const siteWide = env?.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === "true";
	if (!siteWide && !hasPreviewCookie) {
		return { enabled: false };
	}

	const token = env?.SANITY_API_READ_TOKEN;
	if (!token) {
		return { enabled: false };
	}

	return {
		enabled: true,
		token,
		perspective: parsePerspective(perspectiveParam),
	};
}
