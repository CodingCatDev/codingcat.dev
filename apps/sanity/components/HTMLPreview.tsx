import React, { useEffect, useRef } from "react";

const STEGA_REGEX = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]|\uDB40[\uDC20-\uDC7F]/g;

interface HTMLPreviewProps {
	html?: string;
}

const HTMLPreview = (props: HTMLPreviewProps) => {
	const { html } = props;
	const containerRef = useRef<HTMLDivElement>(null);
	const cleanHtml = typeof html === "string" ? html.replace(STEGA_REGEX, "") : "";

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !cleanHtml) return;

		// Re-execute any inline <script> tags so interactive SVG/HTML widgets work inside Sanity Studio preview
		const scripts = Array.from(container.querySelectorAll("script"));
		for (const oldScript of scripts) {
			const newScript = document.createElement("script");
			for (const attr of Array.from(oldScript.attributes)) {
				newScript.setAttribute(attr.name, attr.value);
			}
			newScript.text = oldScript.textContent || "";
			oldScript.parentNode?.replaceChild(newScript, oldScript);
		}
	}, [cleanHtml]);

	if (!cleanHtml) {
		return <div>Add some HTML</div>;
	}
	return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

const preview = (props: HTMLPreviewProps) => <HTMLPreview {...props} />;
export default preview;
