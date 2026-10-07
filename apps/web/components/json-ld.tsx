import type { Thing, WithContext } from "schema-dts";

/**
 * Renders JSON-LD structured data. Data must come from a trusted source (the
 * CMS); we do not render user-generated HTML here.
 */
export function JsonLd({ data }: { data: WithContext<Thing> }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script content from trusted CMS data
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
