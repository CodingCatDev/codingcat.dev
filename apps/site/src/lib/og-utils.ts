/**
 * Shared OG image generation utilities.
 *
 * Uses React element objects (plain VDOM) instead of HTML strings.
 * workers-og's HTMLRewriter-based parseHtml corrupts HTML→VDOM on
 * Cloudflare Workers (text chunking, phantom child nodes). Passing
 * React element objects directly to ImageResponse bypasses parseHtml
 * entirely and works reliably.
 */

// Resolved by the rawFonts Vite plugin to a Uint8Array; see src/env.d.ts.
import InterBoldData from "../assets/fonts/Inter-Bold.ttf";
import InterRegularData from "../assets/fonts/Inter-Regular.ttf";
import { AJ_HEADPHONES_DATA_URI, AJ_ICON_DATA_URI } from "./og-mascots";

// ── Brand tokens ─────────────────────────────────────────────────────
// The violet primary matches --primary in src/styles/global.css. These are
// literal hex values because Satori has no CSS custom property support and
// oklch() is not among the colour formats it parses.
export const BRAND = {
	bg: "#000000",
	bgGradient: "linear-gradient(135deg, #090514 0%, #1a0b38 50%, #0b061a 100%)",
	cardGradient:
		"linear-gradient(145deg, rgba(30, 17, 62, 0.86) 0%, rgba(13, 8, 28, 0.94) 100%)",
	medallionGradient:
		"linear-gradient(145deg, #6d28d9 0%, #4c1d95 60%, #3b0764 100%)",
	primary: "#7c3aed",
	primaryLight: "#8b5cf6",
	primarySoft: "#c4b5fd",
	text: "#ffffff",
	textSecondary: "#cbd5e1",
	textTertiary: "#94a3b8",
	surface: "#1a1a1a",
	border: "rgba(139, 92, 246, 0.32)",
	typeBlog: "#3b82f6",
	typePodcast: "#f59e0b",
	typeCourse: "#10b981",
	typeVideo: "#ef4444",
	typePerson: "#ec4899",
} as const;

export const TYPE_COLORS: Record<string, string> = {
	Blog: BRAND.typeBlog,
	Podcast: BRAND.typePodcast,
	Course: BRAND.typeCourse,
	Video: BRAND.typeVideo,
	Author: BRAND.typePerson,
	Guest: BRAND.typePerson,
	Sponsor: BRAND.typePerson,
};

// ── Cache header value shared across all OG endpoints ────────────────
export const OG_CACHE_HEADER = "public, max-age=86400, s-maxage=604800";

// ── Font loading helper ──────────────────────────────────────────────
export function loadFonts() {
	const InterBold = (InterBoldData as any).buffer || InterBoldData;
	const InterRegular = (InterRegularData as any).buffer || InterRegularData;

	return [
		{
			name: "Inter",
			data: InterBold,
			style: "normal" as const,
			weight: 700,
		},
		{
			name: "Inter",
			data: InterRegular,
			style: "normal" as const,
			weight: 400,
		},
		{
			name: "Inter",
			data: InterRegular,
			style: "normal" as const,
			weight: 500,
		},
	];
}

// ── Adaptive title font size ─────────────────────────────────────────
export function titleFontSize(title: string): number {
	if (title.length > 60) {
		return 42;
	}
	if (title.length > 40) {
		return 48;
	}
	return 56;
}

// ── Text cleanup & clamping helpers ──────────────────────────────────
function stripSiteSuffix(raw: string): string {
	return raw.replace(/\s*[|—–-]\s*CodingCat\.dev\s*$/i, "").trim();
}

function clampText(
	raw: string | undefined,
	maxChars: number,
): string | undefined {
	if (!raw) {
		return undefined;
	}
	const clean = raw.replace(/\s+/g, " ").trim();
	if (!clean || clean.toLowerCase() === "fix me") {
		return undefined;
	}
	if (clean.length <= maxChars) {
		return clean;
	}
	const sliced = clean.slice(0, maxChars - 1);
	const lastSpace = sliced.lastIndexOf(" ");
	return `${(lastSpace > maxChars * 0.6 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

// ── React element helper (plain VDOM objects) ────────────────────────
// workers-og's ImageResponse accepts React.ReactNode. These plain objects
// match the { type, props: { style, children } } shape that Satori expects.

function h(type: string, props: Record<string, any>, ...children: any[]): any {
	const flatChildren = children.flat().filter((c) => c != null);
	return {
		type,
		props: {
			...props,
			children:
				flatChildren.length === 1
					? flatChildren[0]
					: flatChildren.length === 0
						? undefined
						: flatChildren,
		},
	};
}

// ── Author initials helper ───────────────────────────────────────────
export function authorInitials(author: string): string {
	return author
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

// ── Shared element builders ──────────────────────────────────────────

function logoElement() {
	return h(
		"div",
		{ style: { display: "flex", alignItems: "center", gap: "14px" } },
		h(
			"div",
			{
				style: {
					display: "flex",
					width: "52px",
					height: "52px",
					borderRadius: "14px",
					background: BRAND.medallionGradient,
					border: "1px solid rgba(196, 181, 253, 0.4)",
					alignItems: "center",
					justifyContent: "center",
				},
			},
			h("img", {
				src: AJ_ICON_DATA_URI,
				width: 40,
				height: 40,
				style: { width: "40px", height: "40px" },
			}),
		),
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
				},
			},
			h(
				"div",
				{
					style: {
						display: "flex",
						fontSize: "26px",
						fontWeight: 700,
						letterSpacing: "-0.02em",
						color: BRAND.text,
					},
				},
				h("span", { style: {} }, "CodingCat"),
				h("span", { style: { color: "#a78bfa" } }, ".dev"),
			),
			h(
				"div",
				{
					style: {
						display: "flex",
						fontSize: "13px",
						fontWeight: 500,
						color: BRAND.primarySoft,
						letterSpacing: "0.02em",
					},
				},
				"Purrfect Web Development",
			),
		),
	);
}

function badgeElement(type: string, typeColor: string, episodeNumber?: string) {
	const label = episodeNumber ? `${type} • Ep. ${episodeNumber}` : type;
	return h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				gap: "8px",
				padding: "8px 18px",
				borderRadius: "9999px",
				fontSize: "15px",
				fontWeight: 700,
				textTransform: "uppercase" as any,
				letterSpacing: "0.06em",
				color: "#ffffff",
				background: `${typeColor}33`,
				border: `1.5px solid ${typeColor}88`,
			},
		},
		h("div", {
			style: {
				display: "flex",
				width: "8px",
				height: "8px",
				borderRadius: "4px",
				background: typeColor,
			},
		}),
		label,
	);
}

function authorElement(author: string) {
	const isSiteAuthor = !author || author.toLowerCase() === "codingcat.dev";
	return h(
		"div",
		{ style: { display: "flex", alignItems: "center", gap: "12px" } },
		isSiteAuthor
			? h(
					"div",
					{
						style: {
							display: "flex",
							width: "42px",
							height: "42px",
							background: BRAND.medallionGradient,
							borderRadius: "21px",
							border: "1px solid rgba(196, 181, 253, 0.4)",
							alignItems: "center",
							justifyContent: "center",
						},
					},
					h("img", {
						src: AJ_ICON_DATA_URI,
						width: 30,
						height: 30,
						style: { width: "30px", height: "30px" },
					}),
				)
			: h(
					"div",
					{
						style: {
							display: "flex",
							width: "42px",
							height: "42px",
							background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
							borderRadius: "21px",
							border: "1px solid rgba(196, 181, 253, 0.4)",
							alignItems: "center",
							justifyContent: "center",
							fontWeight: 700,
							fontSize: "16px",
							color: "white",
						},
					},
					authorInitials(author),
				),
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
				},
			},
			h(
				"div",
				{
					style: {
						display: "flex",
						fontSize: "18px",
						fontWeight: 700,
						color: BRAND.text,
					},
				},
				isSiteAuthor ? "Alex Patterson & Team" : author,
			),
			h(
				"div",
				{
					style: {
						display: "flex",
						fontSize: "13px",
						fontWeight: 500,
						color: BRAND.textTertiary,
					},
				},
				"CodingCat.dev",
			),
		),
	);
}

function personRoleFooter(type: string) {
	const roleMap: Record<string, string> = {
		Author: "Author & Educator Profile",
		Guest: "Featured Podcast Guest",
		Sponsor: "Official Partner & Sponsor",
	};
	const roleLabel = roleMap[type] || "Community Profile";
	return h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				gap: "10px",
			},
		},
		h(
			"div",
			{
				style: {
					display: "flex",
					padding: "6px 14px",
					borderRadius: "8px",
					background: "rgba(124, 58, 237, 0.22)",
					border: "1px solid rgba(167, 139, 250, 0.3)",
					fontSize: "15px",
					fontWeight: 500,
					color: BRAND.primarySoft,
				},
			},
			roleLabel,
		),
	);
}

function urlElement() {
	return h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				padding: "8px 16px",
				borderRadius: "9999px",
				background: "rgba(255, 255, 255, 0.05)",
				border: "1px solid rgba(255, 255, 255, 0.1)",
				fontSize: "16px",
				fontWeight: 500,
				color: BRAND.primarySoft,
			},
		},
		"codingcat.dev",
	);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

/**
 * Safely fetches a Sanity CDN image and returns a base64 data URI
 * compatible with Satori (JPEG/PNG). Returns undefined if invalid or unreachable
 * so the OG card gracefully falls back to the AJ the Cat mascot.
 */
export async function resolveSanityImageDataUri(
	rawUrl: string | undefined | null,
	width = 640,
	height = 360,
): Promise<string | undefined> {
	if (!rawUrl) {
		return undefined;
	}
	try {
		const parsed = new URL(rawUrl);
		if (parsed.protocol !== "https:" || parsed.hostname !== "cdn.sanity.io") {
			return undefined;
		}
		parsed.searchParams.delete("auto");
		parsed.searchParams.set("fm", "jpg");
		parsed.searchParams.set("w", String(width));
		parsed.searchParams.set("h", String(height));
		parsed.searchParams.set("fit", "crop");

		const response = await fetch(parsed.toString(), {
			headers: { Accept: "image/jpeg,image/png" },
		});
		if (!response.ok) {
			return undefined;
		}
		const contentType = response.headers.get("content-type") || "image/jpeg";
		if (
			!contentType.startsWith("image/jpeg") &&
			!contentType.startsWith("image/png")
		) {
			return undefined;
		}
		const buf = await response.arrayBuffer();
		return `data:${contentType};base64,${arrayBufferToBase64(buf)}`;
	} catch {
		return undefined;
	}
}

export async function resolveAvatarDataUri(
	rawUrl: string | undefined | null,
): Promise<string | undefined> {
	return resolveSanityImageDataUri(rawUrl, 256, 256);
}

function coverShowcaseElement({
	imageUrl,
	accentColor,
}: {
	imageUrl: string;
	accentColor: string;
}) {
	return h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "10px",
				borderRadius: "22px",
				background: `linear-gradient(145deg, ${accentColor}38 0%, rgba(124, 58, 237, 0.18) 100%)`,
				border: "2px solid rgba(196, 181, 253, 0.42)",
				flexShrink: 0,
			},
		},
		h(
			"div",
			{
				style: {
					display: "flex",
					width: "400px",
					height: "225px",
					borderRadius: "14px",
					overflow: "hidden",
					background: "#090514",
				},
			},
			h("img", {
				src: imageUrl,
				width: 400,
				height: 225,
				style: {
					width: "400px",
					height: "225px",
					borderRadius: "14px",
					objectFit: "cover",
				},
			}),
		),
	);
}

function mascotShowcaseElement({
	mascotUri,
	accentColor,
	avatarUrl,
}: {
	mascotUri: string;
	accentColor: string;
	avatarUrl?: string;
}) {
	return h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "290px",
				height: "290px",
				borderRadius: "145px",
				background: `radial-gradient(circle, ${accentColor}30 0%, rgba(124, 58, 237, 0.12) 65%, rgba(0, 0, 0, 0) 100%)`,
				border: "1px solid rgba(167, 139, 250, 0.22)",
				flexShrink: 0,
			},
		},
		h(
			"div",
			{
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: "252px",
					height: "252px",
					borderRadius: "126px",
					background: BRAND.medallionGradient,
					border: "3px solid rgba(196, 181, 253, 0.45)",
					overflow: "hidden",
				},
			},
			avatarUrl
				? h("img", {
						src: avatarUrl,
						width: 252,
						height: 252,
						style: {
							width: "252px",
							height: "252px",
							borderRadius: "126px",
							objectFit: "cover",
						},
					})
				: h("img", {
						src: mascotUri,
						width: 216,
						height: 216,
						style: {
							width: "216px",
							height: "216px",
						},
					}),
		),
	);
}

function cardShell(
	accentBarGradient: string,
	leftContent: any,
	rightShowcase: any,
) {
	return h(
		"div",
		{
			style: {
				display: "flex",
				flexDirection: "column",
				width: "1200px",
				height: "630px",
				background: BRAND.bgGradient,
				fontFamily: "'Inter', sans-serif",
			},
		},
		// Top gradient accent bar
		h("div", {
			style: {
				display: "flex",
				width: "1200px",
				height: "8px",
				background: accentBarGradient,
			},
		}),
		// Outer padding wrapper
		h(
			"div",
			{
				style: {
					display: "flex",
					flex: 1,
					padding: "40px 48px 44px 48px",
				},
			},
			// Inner framed card
			h(
				"div",
				{
					style: {
						display: "flex",
						width: "100%",
						height: "100%",
						background: BRAND.cardGradient,
						border: `1.5px solid ${BRAND.border}`,
						borderRadius: "28px",
						padding: "42px 48px",
						justifyContent: "space-between",
						alignItems: "stretch",
					},
				},
				leftContent,
				rightShowcase,
			),
		),
	);
}

// ── Public element generators ────────────────────────────────────────

export interface OgElementOptions {
	title: string;
	subtitle?: string;
	author?: string;
	type?: string;
	episodeNumber?: string;
	avatar?: string;
	image?: string;
}

/**
 * Builds the full-featured OG element (blog, podcast, course, person).
 * Returns a React element object for ImageResponse.
 */
export function buildOgElement({
	title,
	subtitle,
	author = "CodingCat.dev",
	type = "Blog",
	episodeNumber,
	avatar,
	image,
}: OgElementOptions): any {
	const typeColor = TYPE_COLORS[type] || BRAND.typeBlog;
	const cleanTitle = stripSiteSuffix(title) || title;
	const displayTitle = clampText(cleanTitle, 95) || "CodingCat.dev";
	const baseFontSize = titleFontSize(displayTitle);
	const fontSize = image
		? displayTitle.length > 60
			? 36
			: displayTitle.length > 40
				? 42
				: 48
		: baseFontSize;
	const isPersonCard =
		type === "Author" || type === "Guest" || type === "Sponsor";

	const defaultPersonSubtitle =
		type === "Author"
			? `Read tutorials, articles, and guides by ${displayTitle} on CodingCat.dev.`
			: type === "Guest"
				? `Listen to podcast episodes and interviews featuring ${displayTitle} on CodingCat.dev.`
				: type === "Sponsor"
					? "Official sponsor supporting tutorials and podcasts on CodingCat.dev."
					: undefined;

	const cleanSubtitle =
		clampText(subtitle, image ? 110 : 130) ||
		(isPersonCard ? defaultPersonSubtitle : undefined);

	const mascotUri =
		type === "Podcast" || type === "Guest"
			? AJ_HEADPHONES_DATA_URI
			: AJ_ICON_DATA_URI;

	const middleChildren: any[] = [
		h(
			"div",
			{
				style: {
					fontSize: `${fontSize}px`,
					fontWeight: 700,
					lineHeight: 1.14,
					letterSpacing: "-0.02em",
					color: BRAND.text,
					maxWidth: "100%",
					overflow: "hidden",
				},
			},
			displayTitle,
		),
	];

	if (cleanSubtitle && displayTitle.length <= 75) {
		middleChildren.push(
			h(
				"div",
				{
					style: {
						fontSize: image ? "19px" : "21px",
						fontWeight: 400,
						color: BRAND.textSecondary,
						marginTop: "14px",
						lineHeight: 1.4,
					},
				},
				cleanSubtitle,
			),
		);
	}

	const leftColumn = h(
		"div",
		{
			style: {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				justifyContent: "space-between",
				paddingRight: "32px",
			},
		},
		// Top row: logo + badge
		h(
			"div",
			{
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				},
			},
			logoElement(),
			badgeElement(type, typeColor, episodeNumber),
		),
		// Middle: title + optional subtitle
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					flex: 1,
					justifyContent: "center",
					padding: "16px 0",
				},
			},
			...middleChildren,
		),
		// Bottom row: author / role + URL
		h(
			"div",
			{
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				},
			},
			isPersonCard ? personRoleFooter(type) : authorElement(author),
			urlElement(),
		),
	);

	const rightColumn = h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
		},
		image && !isPersonCard
			? coverShowcaseElement({
					imageUrl: image,
					accentColor: typeColor,
				})
			: mascotShowcaseElement({
					mascotUri,
					accentColor: typeColor,
					avatarUrl: avatar,
				}),
	);

	return cardShell(
		`linear-gradient(90deg, ${BRAND.primary} 0%, ${typeColor} 50%, ${BRAND.primaryLight} 100%)`,
		leftColumn,
		rightColumn,
	);
}

/**
 * Builds a rich branded OG element for default/generic pages and the homepage.
 * Returns a React element object for ImageResponse.
 */
export function buildDefaultOgElement({
	title,
	subtitle,
	image,
}: {
	title: string;
	subtitle?: string;
	image?: string;
}): any {
	const strippedTitle = stripSiteSuffix(title);
	const isHomeCard =
		!strippedTitle ||
		strippedTitle.toLowerCase() === "codingcat.dev" ||
		strippedTitle.toLowerCase() === "purrfect web development";

	const heroTitle = isHomeCard
		? "Purrfect Web Development"
		: clampText(strippedTitle, 90) || "CodingCat.dev";

	const heroSubtitle =
		clampText(
			subtitle &&
				subtitle.toLowerCase() !== "purrfect web development" &&
				subtitle.toLowerCase() !== "codingcat.dev — purrfect web tutorials"
				? subtitle
				: "Hands-on web development tutorials, deep-dive articles, and weekly podcast conversations with builders across tech.",
			image ? 115 : 145,
		) ?? "";

	const baseFontSize = titleFontSize(heroTitle);
	const fontSize = image
		? heroTitle.length > 60
			? 36
			: heroTitle.length > 40
				? 42
				: 48
		: baseFontSize;

	const featurePills = ["Podcasts", "Tutorials", "Video Guides", "AI & Web"];

	const middleChildren: any[] = [
		h(
			"div",
			{
				style: {
					fontSize: `${fontSize}px`,
					fontWeight: 700,
					lineHeight: 1.12,
					letterSpacing: "-0.02em",
					color: BRAND.text,
					maxWidth: "100%",
					overflow: "hidden",
				},
			},
			heroTitle,
		),
		h(
			"div",
			{
				style: {
					fontSize: image ? "20px" : "22px",
					fontWeight: 400,
					color: BRAND.textSecondary,
					marginTop: "16px",
					lineHeight: 1.42,
				},
			},
			heroSubtitle,
		),
	];

	if (isHomeCard) {
		middleChildren.push(
			h(
				"div",
				{
					style: {
						display: "flex",
						alignItems: "center",
						gap: "10px",
						marginTop: "22px",
					},
				},
				...featurePills.map((pill) =>
					h(
						"div",
						{
							style: {
								display: "flex",
								padding: "6px 14px",
								borderRadius: "9999px",
								background: "rgba(124, 58, 237, 0.2)",
								border: "1px solid rgba(167, 139, 250, 0.35)",
								fontSize: "14px",
								fontWeight: 500,
								color: BRAND.primarySoft,
							},
						},
						pill,
					),
				),
			),
		);
	}

	const leftColumn = h(
		"div",
		{
			style: {
				display: "flex",
				flexDirection: "column",
				flex: 1,
				justifyContent: "space-between",
				paddingRight: "32px",
			},
		},
		// Top row: logo
		h(
			"div",
			{
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				},
			},
			logoElement(),
		),
		// Middle: title + subtitle + pills
		h(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					flex: 1,
					justifyContent: "center",
					padding: "16px 0",
				},
			},
			...middleChildren,
		),
		// Bottom: Author & URL
		h(
			"div",
			{
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				},
			},
			authorElement("CodingCat.dev"),
			urlElement(),
		),
	);

	const rightColumn = h(
		"div",
		{
			style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			},
		},
		image
			? coverShowcaseElement({
					imageUrl: image,
					accentColor: BRAND.primaryLight,
				})
			: mascotShowcaseElement({
					mascotUri: AJ_HEADPHONES_DATA_URI,
					accentColor: BRAND.primaryLight,
				}),
	);

	return cardShell(
		`linear-gradient(90deg, ${BRAND.primary} 0%, #ec4899 50%, #f59e0b 100%)`,
		leftColumn,
		rightColumn,
	);
}
