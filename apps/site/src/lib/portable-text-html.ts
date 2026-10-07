import type { PortableTextHtmlComponents } from "@portabletext/to-html";
import { toHTML } from "@portabletext/to-html";
import { escapeXml } from "./xml";

/**
 * Serialises Portable Text to HTML for feed `content:encoded` bodies.
 *
 * The Next app called `toHTML` with no component map, so every custom block
 * and mark fell through to the library's placeholder output — internal links
 * rendered as `<span class="unknown__pt__mark__internalLink">` in the live
 * feed, and code, images and embeds were dropped or stubbed. This supplies the
 * map.
 *
 * Feeds are read in third-party clients that strip scripts and iframes, so
 * embeds degrade to links rather than attempting to render.
 *
 * Note `@portabletext/to-html` uses PLURAL keys (`types`, `marks`), unlike
 * astro-portabletext's singular ones.
 */

interface FeedHtmlOptions {
	/** Absolute origin, so relative internal links resolve inside a reader. */
	origin: string;
	/** Builds an absolute image URL from a Sanity image node. */
	imageUrl: (source: unknown) => string | undefined;
}

const linkTag = (href: string, text: string) =>
	`<a href="${escapeXml(href)}">${text}</a>`;

export function portableTextToHtml(
	value: unknown,
	{ origin, imageUrl }: FeedHtmlOptions,
): string {
	if (!Array.isArray(value) || value.length === 0) {
		return "";
	}

	const absolute = (href: string) =>
		href.startsWith("/") ? `${origin}${href}` : href;

	const components: Partial<PortableTextHtmlComponents> = {
		types: {
			image: ({ value: node }) => {
				const src = imageUrl(node);
				if (!src) {
					return "";
				}
				const alt = escapeXml(node?.alt ?? "");
				return `<figure><img src="${escapeXml(src)}" alt="${alt}" /></figure>`;
			},
			code: ({ value: node }) => {
				const code = node?.code ?? "";
				if (!code) {
					return "";
				}
				// Highlighting is not carried into feeds; readers restyle <pre>
				// anyway, and inline styles are commonly stripped.
				const language = node?.language
					? ` class="language-${escapeXml(node.language)}"`
					: "";
				return `<pre><code${language}>${escapeXml(code)}</code></pre>`;
			},
			youtube: ({ value: node }) =>
				node?.youtube
					? `<p>${linkTag(node.youtube, "Watch on YouTube")}</p>`
					: "",
			youtubeShorts: ({ value: node }) =>
				Array.isArray(node?.shorts)
					? node.shorts
							.filter((url: unknown): url is string => typeof url === "string")
							.map(
								(url: string) => `<p>${linkTag(url, "Watch on YouTube")}</p>`,
							)
							.join("")
					: "",
			codepen: ({ value: node }) =>
				node?.url ? `<p>${linkTag(node.url, "View on CodePen")}</p>` : "",
			codesandbox: ({ value: node }) =>
				node?.url ? `<p>${linkTag(node.url, "View on CodeSandbox")}</p>` : "",
			twitter: ({ value: node }) =>
				node?.id
					? `<p>${linkTag(`https://twitter.com/i/status/${node.id}`, "View post on X")}</p>`
					: "",
			// Author-written markup, already HTML — passed through as-is, the same
			// as on the site itself.
			htmlBlock: ({ value: node }) => node?.html ?? "",
			quote: ({ value: node }) => {
				const inner = portableTextToHtml(node?.content, { origin, imageUrl });
				if (!inner) {
					return "";
				}
				const cite = node?.url ? ` cite="${escapeXml(node.url)}"` : "";
				return `<blockquote${cite}>${inner}</blockquote>`;
			},
			table: ({ value: node }) => {
				const rows: Array<{ cells?: string[] }> = Array.isArray(node?.rows)
					? node.rows
					: [];
				if (rows.length === 0) {
					return "";
				}
				const [head, ...body] = rows;
				const cells = (row: { cells?: string[] }, tag: "th" | "td") =>
					(row.cells ?? [])
						.map((cell) => `<${tag}>${escapeXml(cell ?? "")}</${tag}>`)
						.join("");
				return `<table><thead><tr>${cells(head, "th")}</tr></thead><tbody>${body
					.map((row) => `<tr>${cells(row, "td")}</tr>`)
					.join("")}</tbody></table>`;
			},
		},
		marks: {
			link: ({ value: mark, children }) =>
				mark?.href ? linkTag(absolute(mark.href), children) : children,
			// Resolved to an href in GROQ; made absolute so it works off-site.
			internalLink: ({ value: mark, children }) =>
				mark?.href ? linkTag(absolute(mark.href), children) : children,
		},
	};

	return toHTML(value as Parameters<typeof toHTML>[0], { components });
}
