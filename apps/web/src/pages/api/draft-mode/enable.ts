/**
 * Enable draft mode for Sanity Visual Editing.
 *
 * Called by the Studio's Presentation Tool when loading the preview iframe.
 * Validates the request URL with @sanity/preview-url-secret (secrets live in
 * the Sanity dataset). Sets a __sanity_preview cookie and redirects.
 *
 * Requires SANITY_API_READ_TOKEN (viewer rights). No SANITY_PREVIEW_SECRET needed.
 * With Cloudflare: set in .dev.vars (local) or Wrangler secrets (production).
 * Astro v6: use only 'import { env } from "cloudflare:workers"' (locals.runtime.env was removed).
 */
import type { APIRoute } from "astro";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { env } from "cloudflare:workers";

export const prerender = false;

const PROJECT_ID = "hfh83o0w";
const DATASETS = ["production", "dev"] as const;

export const GET: APIRoute = async ({ url, cookies, redirect, request }) => {
  const token = (env as Record<string, string>).SANITY_API_READ_TOKEN;
  if (!token) {
    return new Response(
      "Draft mode not configured — SANITY_API_READ_TOKEN is missing",
      { status: 503 },
    );
  }

  const requestUrl = request.url;

  for (const dataset of DATASETS) {
    const client = createClient({
      projectId: (env as Record<string, string>).SANITY_PROJECT_ID || PROJECT_ID,
      dataset,
      apiVersion: "2026-03-17",
      useCdn: false,
      token,
    });

    const { isValid, redirectTo = "/" } = await validatePreviewUrl(
      client,
      requestUrl,
    );

    if (isValid) {
      const isLocal = url.hostname === "localhost";

      cookies.set("__sanity_preview", "1", {
        path: "/",
        httpOnly: true,
        sameSite: isLocal ? "lax" : "none",
        secure: !isLocal,
        maxAge: 60 * 60,
      });

      return redirect(redirectTo, 307);
    }
  }

  return new Response("Invalid preview secret", { status: 401 });
};
