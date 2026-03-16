import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_APP_URL || "http://localhost:4321",
});

export const { signIn, signOut, useSession } = authClient;
