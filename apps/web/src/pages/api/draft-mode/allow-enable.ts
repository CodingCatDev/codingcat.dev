/**
 * One-time setup so the "Turn on draft mode" button can enable preview without Studio.
 * Visit /api/draft-mode/allow-enable?secret=YOUR_SANITY_PREVIEW_DEV_SECRET once per session.
 * Sets __sanity_allow_enable cookie; then links to enable with devSecret can work.
 */
import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const devSecret = (env as Record<string, string>).SANITY_PREVIEW_DEV_SECRET;
  const secret = url.searchParams.get("secret");

  if (!devSecret || secret !== devSecret) {
    return new Response("Invalid or missing secret", { status: 400 });
  }

  const isLocal = url.hostname === "localhost";
  cookies.set("__sanity_allow_enable", "1", {
    path: "/",
    httpOnly: true,
    sameSite: isLocal ? "lax" : "none",
    secure: !isLocal,
    maxAge: 60 * 60 * 24,
  });

  return redirect("/", 307);
};
