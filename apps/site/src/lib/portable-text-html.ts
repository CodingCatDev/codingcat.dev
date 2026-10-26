import type { PortableTextHtmlComponents } from "@portabletext/to-html";
import { toHTML } from "@portabletext/to-html";
import { escapeXml } from "./xml";

/**
 * Serialises Portable Text to HTML for feed `content:encoded` bodies.
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

	const renderSocialFeedLink = (label: string) => ({ value: node }: { value?: { url?: string } }) =>
		node?.url ? `<p>${linkTag(node.url, label)}</p>` : "";

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
				const language = node?.language
					? ` class="language-${escapeXml(node.language)}"`
					: "";
				return `<pre><code${language}>${escapeXml(code)}</code></pre>`;
			},
			youtube: ({ value: node }) => {
				const ytUrl = node?.youtube ?? node?.url;
				return ytUrl ? `<p>${linkTag(ytUrl, "Watch on YouTube")}</p>` : "";
			},
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
			twitter: ({ value: node }) => {
				const raw = node?.url || node?.id || "";
				if (!raw) return "";
				const href = /^https?:\/\//i.test(raw)
					? raw
					: `https://x.com/i/status/${raw}`;
				return `<p>${linkTag(href, "View post on X")}</p>`;
			},
			socialEmbed: renderSocialFeedLink("View social post"),
			bluesky: renderSocialFeedLink("View post on Bluesky"),
			linkedin: renderSocialFeedLink("View post on LinkedIn"),
			reddit: renderSocialFeedLink("View discussion on Reddit"),
			tiktok: renderSocialFeedLink("Watch on TikTok"),
			instagram: renderSocialFeedLink("View on Instagram"),
			threads: renderSocialFeedLink("View on Threads"),
			mastodon: renderSocialFeedLink("View on Mastodon"),
			githubGist: renderSocialFeedLink("View GitHub Gist"),
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
			internalLink: ({ value: mark, children }) =>
				mark?.href ? linkTag(absolute(mark.href), children) : children,
		},
	};

	return toHTML(value as Parameters<typeof toHTML>[0], { components });
}
