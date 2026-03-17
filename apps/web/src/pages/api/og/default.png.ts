/**
 * Default OG image — debug: returns raw HTML to inspect what Satori receives.
 */
import type { APIRoute } from "astro";
import { generateDefaultOgHtml } from "../../../lib/og-utils";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const title = url.searchParams.get("title") || "CodingCat.dev";
  const subtitle = url.searchParams.get("subtitle") || undefined;
  const html = generateDefaultOgHtml({ title, subtitle });

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
};
