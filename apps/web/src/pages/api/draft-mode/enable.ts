/**
 * Enable draft mode for Sanity Visual Editing.
 *
 * Called by the Studio's Presentation Tool when loading the preview iframe.
 * Validates SANITY_PREVIEW_SECRET, sets a __sanity_preview cookie, and
 * redirects to the requested page.
 *
 * Usage: /api/draft-mode/enable?secret=<value>&slug=/post/my-post
 */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") || "/";

  // Fail-closed: require SANITY_PREVIEW_SECRET to be configured
  const expectedSecret = (env as Record<string, string>).SANITY_PREVIEW_SECRET;
  if (!expectedSecret) {
    return new Response("Draft mode not configured — SANITY_PREVIEW_SECRET is missing", {
      status: 503,
    });
  }

  // Validate the secret
  if (!secret || secret !== expectedSecret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  // Set the preview cookie — httpOnly so client JS can't tamper with it
  cookies.set("__sanity_preview", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    // 1 hour — long enough for an editing session
    maxAge: 60 * 60,
  });

  // Redirect to the requested page
  return redirect(slug, 307);
};
