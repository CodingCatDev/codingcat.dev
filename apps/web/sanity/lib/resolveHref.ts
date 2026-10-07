/**
 * Resolve href for document types (presentation tool).
 * Kept in a separate file so sanity.config.ts can import it without loading @sanity/image-url,
 * which fails when the Sanity CLI loads the config in a Node/CJS context.
 */
export function resolveHref(
	documentType?: string,
	slug?: string,
): string | undefined {
	switch (documentType) {
		case "post":
			return slug ? `/post/${slug}` : undefined;
		default:
			console.warn("Invalid document type:", documentType);
			return undefined;
	}
}
