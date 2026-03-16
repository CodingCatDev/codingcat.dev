/**
 * Sanity Studio API configuration
 * Uses SANITY_STUDIO_ prefixed env vars (auto-exposed by Sanity CLI)
 */

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "hfh83o0w";
export const dataset = process.env.SANITY_STUDIO_DATASET || "production";
export const apiVersion = process.env.SANITY_STUDIO_API_VERSION || "2025-09-30";
export const studioUrl = "/";
