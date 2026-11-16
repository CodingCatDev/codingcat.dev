export interface InlineSegment {
	text: string;
	strong?: boolean;
	em?: boolean;
	code?: boolean;
	href?: string;
}

/**
 * Safe recursive inline Markdown tokenizer for Portable Text table cells and
 * lightweight labels (`**bold**`, `` `code` ``, `*italic*`, `[label](https://...)`).
 * Avoids `set:html` so untrusted strings remain 100% XSS-safe in Astro JSX.
 */
export function parseInlineMarkdownSegments(
	text: string,
	inherited: Omit<InlineSegment, "text"> = {},
): InlineSegment[] {
	if (!text) {
		return [];
	}
	const segments: InlineSegment[] = [];
	const pattern =
		/(\*\*\[[^\]]+\]\([^)]+\)\*\*|\*\*(?:`[^`]+`|[^*])+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
	let lastIdx = 0;
	let match: RegExpExecArray | null = pattern.exec(text);
	while (match !== null) {
		if (match.index > lastIdx) {
			segments.push({
				...inherited,
				text: text.slice(lastIdx, match.index),
			});
		}
		const token = match[0];
		if (token.startsWith("**") && token.endsWith("**")) {
			const inner = token.slice(2, -2);
			const linkMatch = inner.match(
				/^\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)$/,
			);
			if (linkMatch) {
				segments.push(
					...parseInlineMarkdownSegments(linkMatch[1], {
						...inherited,
						strong: true,
						href: linkMatch[2],
					}),
				);
			} else {
				segments.push(
					...parseInlineMarkdownSegments(inner, {
						...inherited,
						strong: true,
					}),
				);
			}
		} else if (token.startsWith("`") && token.endsWith("`")) {
			segments.push({
				...inherited,
				text: token.slice(1, -1),
				code: true,
			});
		} else if (token.startsWith("[") && token.includes("](")) {
			const linkMatch = token.match(
				/^\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)$/,
			);
			if (linkMatch) {
				segments.push(
					...parseInlineMarkdownSegments(linkMatch[1], {
						...inherited,
						href: linkMatch[2],
					}),
				);
			} else {
				segments.push({ ...inherited, text: token });
			}
		} else if (token.startsWith("*") && token.endsWith("*")) {
			segments.push(
				...parseInlineMarkdownSegments(token.slice(1, -1), {
					...inherited,
					em: true,
				}),
			);
		} else {
			segments.push({ ...inherited, text: token });
		}
		lastIdx = pattern.lastIndex;
		match = pattern.exec(text);
	}
	if (lastIdx < text.length) {
		segments.push({ ...inherited, text: text.slice(lastIdx) });
	}
	return segments.length > 0 ? segments : [{ ...inherited, text }];
}
