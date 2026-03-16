/**
 * Disable draft mode for Sanity Visual Editing.
 *
 * Clears the preview cookie and redirects back to the page.
 *
 * Usage: /api/draft-mode/disable?slug=/post/my-post
 */
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const slug = url.searchParams.get("slug") || "/";

  // Delete the preview cookie
  cookies.delete("__sanity_preview", { path: "/" });

  // Redirect back to the page (now showing published content)
  return redirect(slug, 307);
};
