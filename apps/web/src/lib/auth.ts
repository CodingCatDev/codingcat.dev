import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { DrizzleD1Database } from "drizzle-orm/d1";

export function createAuth(db: DrizzleD1Database, envVars: Record<string, string>) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    secret: envVars.BETTER_AUTH_SECRET,
    baseURL: envVars.BETTER_AUTH_URL || "http://localhost:4321",
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: envVars.GOOGLE_CLIENT_ID!,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET!,
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
