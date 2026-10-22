import type { APIRoute } from "astro";
import {
	ALLOWED_SOCIAL_KEYS,
	normalizeSocialInput,
	sanitizePortableTextBlocks,
	verifyGuestPortalToken,
} from "@/lib/guest-portal";
import {
	getSanityServerClient,
	uploadSanityImageDataUrl,
} from "@/lib/sanity/write-client";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = (await request.json()) as {
			token?: string;
			title?: string;
			websiteUrl?: string;
			excerpt?: string;
			content?: unknown[];
			avatarDataUrl?: string;
			socials?: Record<string, string>;
		};

		const rawToken = body.token?.trim();
		if (!rawToken) {
			return new Response(
				JSON.stringify({ error: "Missing guest portal token." }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const { client, canWrite } = getSanityServerClient();
		const verification = await verifyGuestPortalToken(rawToken);

		if (!verification.valid) {
			if (verification.expired) {
				return new Response(
					JSON.stringify({
						error:
							"This magic link has expired. Please reply to Alex's email for a fresh link.",
					}),
					{ status: 403, headers: { "Content-Type": "application/json" } },
				);
			}
			return new Response(
				JSON.stringify({ error: "Invalid guest portal token." }),
				{ status: 403, headers: { "Content-Type": "application/json" } },
			);
		}

		const guestId = verification.payload?.id;
		if (!guestId) {
			return new Response(
				JSON.stringify({ error: "Could not resolve guest profile." }),
				{ status: 404, headers: { "Content-Type": "application/json" } },
			);
		}

		const existingGuest = await client.fetch<{
			_id: string;
			title?: string;
			socials?: Record<string, string>;
			websites?: Array<any>;
		} | null>(
			`*[_type == "guest" && _id == $id][0]{ _id, title, socials, websites }`,
			{ id: guestId },
		);

		if (!existingGuest) {
			return new Response(
				JSON.stringify({ error: "Guest profile not found in Sanity." }),
				{ status: 404, headers: { "Content-Type": "application/json" } },
			);
		}

		const mergedSocials: Record<string, string> = {
			...(existingGuest.socials || {}),
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

		const patchSet: Record<string, unknown> = {
			socials: mergedSocials,
		};

		if (body.title && body.title.trim().length >= 2) {
			patchSet.title = body.title.trim();
		}

		if (typeof body.websiteUrl === "string") {
			const cleanSite = body.websiteUrl.trim();
			if (cleanSite) {
				const href = /^https?:\/\//i.test(cleanSite)
					? cleanSite
					: `https://${cleanSite}`;
				patchSet.websites = [
					{
						_key: "primary-site",
						_type: "site",
						site: href,
						link: {
							blank: true,
							href,
						},
					},
				];
			}
		}

		if (typeof body.excerpt === "string") {
			const cleanExcerpt = body.excerpt.trim();
			if (cleanExcerpt) {
				patchSet.excerpt = cleanExcerpt;
			}
		}

		if (Array.isArray(body.content)) {
			const sanitizedBlocks = sanitizePortableTextBlocks(body.content);
			if (sanitizedBlocks.length > 0) {
				patchSet.content = sanitizedBlocks;
			}
		}

		let uploadedAvatarUrl: string | undefined;
		if (
			typeof body.avatarDataUrl === "string" &&
			body.avatarDataUrl.startsWith("data:image/")
		) {
			const uploadedAsset = await uploadSanityImageDataUrl(
				body.avatarDataUrl,
				verification.payload?.slug || existingGuest._id,
			);
			if (uploadedAsset) {
				patchSet.coverImage = {
					_type: "image",
					asset: {
						_type: "reference",
						_ref: uploadedAsset._id,
					},
				};
				uploadedAvatarUrl = uploadedAsset.url;
			}
		}

		if (canWrite) {
			await client.patch(existingGuest._id).set(patchSet).commit();
		}

		return new Response(
			JSON.stringify({
				ok: true,
				guestId: existingGuest._id,
				socials: mergedSocials,
				avatarUrl: uploadedAvatarUrl,
				persistedToSanity: canWrite,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
