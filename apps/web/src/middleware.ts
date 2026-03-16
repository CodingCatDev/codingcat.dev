import { defineMiddleware } from "astro:middleware";
import { createAuth } from "./lib/auth";
import { createDb } from "./lib/db";

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip for prerendered pages
  if (context.isPrerendered) return next();

  // Get Cloudflare env — in Astro 6 with @astrojs/cloudflare,
  // bindings are available via Astro.locals.runtime.env
  const runtime = (context.locals as any).runtime;
  const d1 = runtime?.env?.DB;

  if (!d1) {
    // No D1 binding (dev without wrangler, or static page)
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const db = createDb(d1);
  const env = runtime.env;
  const auth = createAuth(db, env);

  // Store auth instance for API routes
  (context.locals as any).auth = auth;

  // Check session on every request
  try {
    const isAuthed = await auth.api.getSession({
      headers: context.request.headers,
    });

    if (isAuthed) {
      context.locals.user = isAuthed.user;
      context.locals.session = isAuthed.session;
    } else {
      context.locals.user = null;
      context.locals.session = null;
    }
  } catch {
    context.locals.user = null;
    context.locals.session = null;
  }

  // Protect dashboard routes
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/dashboard") && !context.locals.session) {
    return context.redirect("/login");
  }

  return next();
});
