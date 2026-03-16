/**
 * Sanity API config for the web app (standalone — no shared package).
 */

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-30";

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";
