import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  const auth = (context.locals as any).auth;
  if (!auth) {
    return new Response(JSON.stringify({ error: "Auth not initialized" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  return auth.handler(context.request);
};
