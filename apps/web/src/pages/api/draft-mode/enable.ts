/**
 * Enable draft mode for Sanity Visual Editing.
 *
 * 1) From Studio: Presentation tool loads this URL with a signed secret;
 *    we validate with @sanity/preview-url-secret, set cookies, redirect to site (absolute URL).
 * 2) From site toggle: after visiting /api/draft-mode/allow-enable?secret=XXX once,
 *    enable?redirect=/path sets cookies and redirects (no signed URL needed).
 *
 * Requires SANITY_API_READ_TOKEN. Optional SANITY_PREVIEW_DEV_SECRET for (2).
 */
import type { APIRoute } from "astro";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { env } from "cloudflare:workers";

export const prerender = false;

const PROJECT_ID = "hfh83o0w";
const DATASETS = ["production", "dev"] as const;
const ENABLE_PATH = "/api/draft-mode/enable";
const DISABLE_PATH = "/api/draft-mode/disable";

function safeRedirectPath(raw: string | undefined, origin: string): string {
  const path = (raw || "/").trim() || "/";
  const full = new URL(path, origin).pathname;
  if (full.startsWith(ENABLE_PATH) || full.startsWith(DISABLE_PATH)) return "/";
  return full.startsWith("/") ? full : `/${full}`;
}

export const GET: APIRoute = async ({ url, cookies, request }) => {
  const token = (env as Record<string, string>).SANITY_API_READ_TOKEN;
  const allowCookie = cookies.get("__sanity_allow_enable")?.value === "1";

  const requestUrl = request.url;
  const origin = new URL(requestUrl).origin;

  const allowEnable = allowCookie;

  if (allowEnable) {
    const isLocal = url.hostname === "localhost";
    const redirectPath = safeRedirectPath(
      url.searchParams.get("redirect") ?? "/",
      origin,
    );
    const location = `${origin}${redirectPath}`;
    cookies.set("__sanity_preview", "1", {
      path: "/",
      httpOnly: true,
      sameSite: isLocal ? "lax" : "none",
      secure: !isLocal,
      maxAge: 60 * 60,
    });
    cookies.set("__sanity_preview_dataset", "dev", {
      path: "/",
      httpOnly: true,
      sameSite: isLocal ? "lax" : "none",
      secure: !isLocal,
      maxAge: 60 * 60,
    });
    return new Response(null, {
      status: 307,
      headers: { Location: location },
    });
  }

  for (const dataset of DATASETS) {
    const client = createClient({
      projectId: (env as Record<string, string>).SANITY_PROJECT_ID || PROJECT_ID,
      dataset,
      apiVersion: "2026-03-17",
      useCdn: false,
      token: token!,
    });

    const { isValid, redirectTo } = await validatePreviewUrl(
      client,
      requestUrl,
    );

    if (isValid) {
      const isLocal = url.hostname === "localhost";
      // redirectTo comes from validatePreviewUrl (sanity-preview-pathname param); fallback to param directly
      const pathFromParam = url.searchParams.get("sanity-preview-pathname") ?? undefined;
      const redirectPath = safeRedirectPath(redirectTo ?? pathFromParam ?? "/", origin);
      const location = `${origin}${redirectPath}`;

      cookies.set("__sanity_preview", "1", {
        path: "/",
        httpOnly: true,
        sameSite: isLocal ? "lax" : "none",
        secure: !isLocal,
        maxAge: 60 * 60,
      });

      cookies.set("__sanity_preview_dataset", dataset, {
        path: "/",
        httpOnly: true,
        sameSite: isLocal ? "lax" : "none",
        secure: !isLocal,
        maxAge: 60 * 60,
      });

      return new Response(null, {
        status: 307,
        headers: { Location: location },
      });
    }
  }

  if (!token) {
    return new Response(
      "Draft mode not configured — SANITY_API_READ_TOKEN is missing",
      { status: 503 },
    );
  }

  return new Response("Invalid preview secret", { status: 401 });
};
