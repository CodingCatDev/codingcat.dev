/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
    auth?: import("./lib/auth").Auth;
    /** Cloudflare execution context — for waitUntil(), etc. */
    cfContext?: ExecutionContext;
  }
}

/**
 * Cloudflare Workers env bindings — accessed via `import { env } from 'cloudflare:workers'`
 * Type declarations for the `cloudflare:workers` module are provided by @astrojs/cloudflare.
 */
