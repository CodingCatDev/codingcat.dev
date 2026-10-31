import type { APIRoute } from "astro";
import {
	ALLOWED_SOCIAL_KEYS,
	normalizeSocialInput,
	sanitizePortableTextBlocks,
} from "@/lib/guest-portal";
import {
	extractPortalAllowedEmails,
	verifyPortalRequestAuth,
} from "@/lib/portal-security";
import {
	getSanityServerClient,
	uploadSanityImageDataUrl,
} from "@/lib/sanity/write-client";

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Content-Type": "application/json",
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: CORS_HEADERS });
};

function slugifyName(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 64);
}

/**
 * POST /api/portal/guest-profile
 * Self-serve Guest Speaker Profile, Headshot, Bio & 14 Socials editor inside `/portal/[token]`.
 * Automatically creates or updates `drafts.guest-<slug>` (and `guest-<slug>` if published)
 * so the guest and host can preview `/guest/<slug>?sanity-preview-perspective=drafts` immediately.
 */
export const POST: APIRoute = async ({ request, url }) => {
	try {
		const body = (await request.json()) as {
			token?: string;
			guestSlug?: string;
			title?: string;
			websiteUrl?: string;
			excerpt?: string;
			content?: unknown[];
			avatarDataUrl?: string;
			socials?: Record<string, string>;
		};

		const token = (body.token || "").trim();
		if (!token) {
			return new Response(
				JSON.stringify({ ok: false, error: "Missing Studio Portal token." }),
				{ status: 400, headers: CORS_HEADERS },
			);
		}

		const { client, canWrite } = getSanityServerClient();
		if (!canWrite) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "Sanity write token is not configured in this environment.",
				}),
				{ status: 503, headers: CORS_HEADERS },
			);
		}

		const targetDocs = await client.fetch<Array<Record<string, any>>>(
			`*[_type in ["booking", "sponsorLead"] && (
				portalToken == $token ||
				legacyPortalToken == $token ||
				_id == "private.sponsorLead-" + $token ||
				_id == "private.booking-" + $token
			)]{
				_id,
				_type,
				portalToken,
				legacyPortalToken,
				guestName,
				contactName,
				guestEmail,
				contactEmail,
				coordinatorEmail,
				coordinatorEmails,
				allowedEmails,
				company,
				companyName,
				guestSlug,
				guestDocId
			}`,
			{ token },
		);

		if (!targetDocs || targetDocs.length === 0) {
			return new Response(
				JSON.stringify({
					ok: false,
					error: "Matching Studio Portal not found.",
				}),
				{ status: 404, headers: CORS_HEADERS },
			);
		}

		const primaryDoc = targetDocs[0];
		const canonicalToken = primaryDoc?.portalToken || token;
		const auth = await verifyPortalRequestAuth({
			request,
			url: url ?? new URL(request.url),
			token: canonicalToken,
			allowedEmails: extractPortalAllowedEmails(...targetDocs),
		});

		if (!auth.authorized) {
			return new Response(
				JSON.stringify({
					ok: false,
					error:
						"Unauthorized: Please sign in via Better-Auth before updating your Guest Profile.",
				}),
				{ status: 403, headers: CORS_HEADERS },
			);
		}

		const resolvedTitle =
			(body.title || "").trim() ||
			primaryDoc?.guestName ||
			primaryDoc?.contactName ||
			"Podcast Guest";
		const resolvedSlug =
			(body.guestSlug || "").trim() ||
			primaryDoc?.guestSlug ||
			slugifyName(resolvedTitle) ||
			`guest-${canonicalToken.slice(0, 12)}`;

		const existingGuest = await client.fetch<{
			_id: string;
			_type: string;
			title?: string;
			slug?: { current?: string };
			coverImage?: Record<string, any>;
			excerpt?: string;
			content?: unknown[];
			socials?: Record<string, string>;
			websites?: Array<any>;
		} | null>(
			`*[_type in ["guest", "author"] && (
				slug.current == $slug ||
				_id in [$draftId, $pubId]
			)] | order(_id desc)[0]{
				_id,
				_type,
				title,
				slug,
				coverImage,
				excerpt,
				content,
				socials,
				websites
			}`,
			{
				slug: resolvedSlug,
				draftId: `drafts.guest-${resolvedSlug}`,
				pubId: `guest-${resolvedSlug}`,
			},
		);

		const mergedSocials: Record<string, string> = {
			...(existingGuest?.socials || {}),
		};

		if (body.socials && typeof body.socials === "object") {
			for (const key of ALLOWED_SOCIAL_KEYS) {
				if (key in body.socials) {
					const normalized = normalizeSocialInput(key, body.socials[key]);
					if (normalized) {
						mergedSocials[key] = normalized;
					} else {
						delete mergedSocials[key];
					}
				}
			}
		}

		let websites = existingGuest?.websites || [];
		if (typeof body.websiteUrl === "string") {
			const cleanSite = body.websiteUrl.trim();
			if (cleanSite) {
				const href = /^https?:\/\//i.test(cleanSite)
					? cleanSite
					: `https://${cleanSite}`;
				websites = [
					{
						_key: "primary-site",
						_type: "site",
						site: href,
						link: {
							blank: true,
							href,
						},
					},
					...websites.filter(
						(w: any) => w?._key !== "primary-site" && w?.link?.href !== href,
					),
				];
			}
		}

		const cleanExcerpt =
			typeof body.excerpt === "string" && body.excerpt.trim()
				? body.excerpt.trim()
				: existingGuest?.excerpt ||
					`${resolvedTitle} (${primaryDoc?.company || primaryDoc?.companyName || "Podcast Guest"})`;

		const sanitizedBlocks = Array.isArray(body.content)
			? sanitizePortableTextBlocks(body.content)
			: [];
		const contentBlocks =
			sanitizedBlocks.length > 0
				? sanitizedBlocks
				: existingGuest?.content || [
						{
							_key: "bio-0",
							_type: "block",
							style: "normal",
							markDefs: [],
							children: [
								{
									_key: "bio-span-0",
									_type: "span",
									marks: [],
									text: cleanExcerpt,
								},
							],
						},
					];

		let coverImage = existingGuest?.coverImage;
		let uploadedAvatarUrl: string | undefined;
		if (
			typeof body.avatarDataUrl === "string" &&
			body.avatarDataUrl.startsWith("data:image/")
		) {
			const uploadedAsset = await uploadSanityImageDataUrl(
				body.avatarDataUrl,
				resolvedSlug,
			);
			if (uploadedAsset) {
				coverImage = {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: uploadedAsset._id,
					},
				};
				uploadedAvatarUrl = uploadedAsset.url;
			}
		}

		const basePubId = existingGuest?._id
			? existingGuest._id.replace(/^drafts\./, "")
			: `guest-${resolvedSlug}`;
		const draftDocId = `drafts.${basePubId}`;

		const guestPayload: Record<string, any> = {
			_id: draftDocId,
			_type: existingGuest?._type || "guest",
			title: resolvedTitle,
			slug: {
				_type: "slug",
				current: existingGuest?.slug?.current || resolvedSlug,
			},
			excerpt: cleanExcerpt,
			content: contentBlocks,
			socials: mergedSocials,
			...(websites.length > 0 ? { websites } : {}),
			...(coverImage ? { coverImage } : {}),
		};

		// Always save to `drafts.<id>` so draft preview (`/guest/<slug>?sanity-preview-perspective=drafts`) works immediately
		await client.createOrReplace(guestPayload as any);

		// If a published guest doc already exists, keep it updated too
		if (existingGuest?._id && !existingGuest._id.startsWith("drafts.")) {
			await client
				.patch(existingGuest._id)
				.set({
					title: resolvedTitle,
					excerpt: cleanExcerpt,
					content: contentBlocks,
					socials: mergedSocials,
					...(websites.length > 0 ? { websites } : {}),
					...(coverImage ? { coverImage } : {}),
				})
				.commit()
				.catch(() => {});
		}

		// Sync guestSlug & guestDocId onto the booking / sponsorLead record(s)
		const finalSlug = existingGuest?.slug?.current || resolvedSlug;
		await Promise.all(
			targetDocs.map((d) =>
				client
					.patch(d._id)
					.set({
						guestSlug: finalSlug,
						guestDocId: draftDocId,
						...(d._type === "booking" ? { guestName: resolvedTitle } : {}),
					})
					.commit()
					.catch(() => {}),
			),
		);

		return new Response(
			JSON.stringify({
				ok: true,
				guestId: draftDocId,
				guestSlug: finalSlug,
				previewUrl: `/guest/${finalSlug}?sanity-preview-perspective=drafts`,
				socials: mergedSocials,
				avatarUrl: uploadedAvatarUrl,
			}),
			{ status: 200, headers: CORS_HEADERS },
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ ok: false, error: message }), {
			status: 500,
			headers: CORS_HEADERS,
		});
	}
};
