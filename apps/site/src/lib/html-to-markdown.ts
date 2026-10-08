/**
 * High-performance, edge-compatible HTML to Markdown converter.
 * Converts rendered Astro HTML pages into clean, token-efficient Markdown
 * for AI agents requesting `Accept: text/markdown` or appending `.md`.
 */

export function htmlToMarkdown(html: string, pageUrl?: string): string {
	if (!html) {
		return "";
	}

	// 1. Extract page title if available before stripping head
	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	const pageTitle = titleMatch ? decodeEntities(titleMatch[1].trim()) : "";

	// 2. Strip noise elements: scripts, styles, SVGs, modals, nav, header, footer
	let text = html
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
		.replace(/<dialog\b[^<]*(?:(?!<\/dialog>)<[^<]*)*<\/dialog>/gi, "")
		.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
		.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
		.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");

	// 3. Focus on <main> or <article> if available
	const mainMatch = text.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
	if (mainMatch) {
		text = mainMatch[1];
	} else {
		const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
		if (articleMatch) {
			text = articleMatch[1];
		} else {
			const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
			if (bodyMatch) {
				text = bodyMatch[1];
			}
		}
	}

	// 4. Code blocks (<pre><code ...>...</code></pre>)
	text = text.replace(
		/<pre[^>]*><code[^>]*class=["'][^"']*language-([a-z0-9_-]+)[^"']*["'][^>]*>([\s\S]*?)<\/code><\/pre>/gi,
		(_match, lang, code) => {
			return `\n\n\`\`\`${lang}\n${decodeEntities(stripTags(code)).trim()}\n\`\`\`\n\n`;
		},
	);
	text = text.replace(
		/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
		(_match, code) => {
			return `\n\n\`\`\`\n${decodeEntities(stripTags(code)).trim()}\n\`\`\`\n\n`;
		},
	);
	text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_match, code) => {
		return `\`${decodeEntities(stripTags(code))}\``;
	});

	// 5. Headings
	text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n");
	text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
	text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
	text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");
	text = text.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n");
	text = text.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n");

	// 6. Blockquotes
	text = text.replace(
		/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
		(_match, quote) => {
			const lines = stripTags(quote)
				.trim()
				.split("\n")
				.map((l) => `> ${l.trim()}`)
				.join("\n");
			return `\n\n${lines}\n\n`;
		},
	);

	// 7. Bold, Italic, Strikethrough
	text = text.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");
	text = text.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
	text = text.replace(/<(s|del|strike)[^>]*>([\s\S]*?)<\/\1>/gi, "~~$2~~");

	// 8. Images
	text = text.replace(
		/<img\b[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
		"![$2]($1)",
	);
	text = text.replace(
		/<img\b[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*>/gi,
		"![$1]($2)",
	);
	text = text.replace(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi, "![]($1)");

	// 9. Links
	text = text.replace(
		/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
		(_match, href, label) => {
			const cleanLabel = stripTags(label).trim();
			if (!cleanLabel) {
				return "";
			}
			return `[${cleanLabel}](${href})`;
		},
	);

	// 10. Lists
	text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_match, item) => {
		return `\n- ${stripTags(item).trim()}`;
	});
	text = text.replace(/<\/(ul|ol)>/gi, "\n\n");

	// 11. Paragraphs, breaks, dividers
	text = text.replace(/<hr\s*[/]?>/gi, "\n\n---\n\n");
	text = text.replace(/<br\s*[/]?>/gi, "\n");
	text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");

	// 12. Strip remaining tags
	text = stripTags(text);

	// 13. Decode HTML entities
	text = decodeEntities(text);

	// 14. Clean up whitespace
	text = text
		.split("\n")
		.map((line) => line.trimEnd())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();

	// Add header prefix if page title exists and wasn't already in H1
	if (pageTitle && !text.startsWith("# ")) {
		text = `# ${pageTitle}\n\n${text}`;
	}

	if (pageUrl) {
		text = `> Canonical URL: ${pageUrl}\n\n${text}`;
	}

	return text;
}

function stripTags(str: string): string {
	return str.replace(/<[^>]+>/g, "");
}

function decodeEntities(str: string): string {
	return str
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, " ")
		.replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) =>
			String.fromCharCode(parseInt(hex, 16)),
		)
		.replace(/&#([0-9]+);/g, (_m, dec) =>
			String.fromCharCode(parseInt(dec, 10)),
		);
}
