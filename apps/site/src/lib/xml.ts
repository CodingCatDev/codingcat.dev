/**
 * XML helpers for feeds and the sitemap.
 *
 * Hand-rolled rather than pulling an XML library: the `feed` package the Next
 * app used depends on Node built-ins that are awkward on workerd, and every
 * document these routes emit is a fixed shape.
 */

/** Escape the five XML predefined entities. Apply to any content-derived text. */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Wrap text in CDATA, neutralising any `]]>` it contains by splitting the
 * section. Without this an author could terminate the section early and
 * produce invalid XML — the Next app's feed library did the same.
 */
export function cdata(value: string): string {
	return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** RFC 822 date, the format RSS 2.0 requires for pubDate / lastBuildDate. */
export function rfc822(date: Date): string {
	return date.toUTCString();
}

/**
 * MIME type for an image enclosure, derived from the URL path extension.
 * Reproduces the `feed` library's behaviour exactly — including its use of
 * `image/jpg` rather than the correct `image/jpeg` — because changing an
 * existing enclosure type churns feed readers for no benefit.
 */
export function imageMimeType(url: string): string {
	const path = url.split("?")[0] ?? "";
	const extension = path.split(".").pop()?.toLowerCase();
	return extension ? `image/${extension}` : "image/jpeg";
}
