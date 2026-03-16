/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
    auth?: import("./lib/auth").Auth;
    runtime?: {
      env: {
        DB: D1Database;
        BETTER_AUTH_SECRET: string;
        BETTER_AUTH_URL: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        ASSETS: Fetcher;
        [key: string]: any;
      };
    };
  }
}
