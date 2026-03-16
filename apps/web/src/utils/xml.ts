/**
 * XML utility functions for RSS feeds and sitemaps.
 */

/**
 * Escape special XML characters in a string.
 * Use for any user-generated content in XML output.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
