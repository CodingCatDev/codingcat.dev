"use client";

import { CookiesProvider } from "react-cookie";

export default function CookiesProviderClient({ children }: { children: React.ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
