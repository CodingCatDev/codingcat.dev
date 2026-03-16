import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { createAuth } from "./lib/auth";
import { createDb } from "./lib/db";

/** Routes that require authentication infrastructure */
const PROTECTED_PREFIXES = ["/dashboard", "/api/auth"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip for prerendered pages
  if (context.isPrerendered) return next();

  const url = new URL(context.request.url);

  // Get D1 binding from Cloudflare Workers env (Astro v6 pattern)
  const d1 = (env as any).DB;

  // B1 fix: Block protected routes when D1 is unavailable
  if (!d1) {
    if (isProtectedRoute(url.pathname)) {
      return new Response("Service unavailable — auth database not configured", {
        status: 503,
      });
    }
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  // B2 fix: Validate required auth env vars before creating auth instance
  const cfEnv = env as Record<string, string>;
  const requiredVars = ["BETTER_AUTH_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] as const;
  const missingVars = requiredVars.filter((key) => !cfEnv[key]);

  if (missingVars.length > 0) {
    if (isProtectedRoute(url.pathname)) {
      console.error(`Auth misconfigured — missing env vars: ${missingVars.join(", ")}`);
      return new Response("Service unavailable — auth not configured", {
        status: 503,
      });
    }
    context.locals.user = null;
    context.locals.session = null;
    return next();
  }

  const db = createDb(d1);
  const auth = createAuth(db, cfEnv);

  // Store auth instance for API routes
  context.locals.auth = auth;

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

  // Protect dashboard routes — redirect unauthenticated users
  if (url.pathname.startsWith("/dashboard") && !context.locals.session) {
    return context.redirect("/login");
  }

  return next();
});
