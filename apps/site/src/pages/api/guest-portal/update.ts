import type { APIRoute } from "astro";
import {
	ALLOWED_SOCIAL_KEYS,
	normalizeSocialInput,
	verifyGuestPortalToken,
} from "@/lib/guest-portal";
import { getSanityServerClient } from "@/lib/sanity/write-client";

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = (await request.json()) as {
			token?: string;
			title?: string;
			websiteUrl?: string;
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

		let guestId = verification.payload?.id;
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

			// Fallback: check if token is stored directly on a guest doc in Sanity with non-expired portalTokenExpiresAt
			const docByToken = await client.fetch<{
				_id: string;
				portalTokenExpiresAt?: string;
			} | null>(
				`*[_type == "guest" && portalToken == $token][0]{ _id, portalTokenExpiresAt }`,
				{ token: rawToken },
			);

			if (!docByToken) {
				return new Response(
					JSON.stringify({ error: "Invalid guest portal token." }),
					{ status: 403, headers: { "Content-Type": "application/json" } },
				);
			}
			if (
				docByToken.portalTokenExpiresAt &&
				new Date(docByToken.portalTokenExpiresAt).getTime() < Date.now()
			) {
				return new Response(
					JSON.stringify({
						error:
							"This magic link has expired. Please reply to Alex's email for a fresh link.",
					}),
					{ status: 403, headers: { "Content-Type": "application/json" } },
				);
			}
			guestId = docByToken._id;
		}

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

		if (canWrite) {
			await client.patch(existingGuest._id).set(patchSet).commit();
		}

		return new Response(
			JSON.stringify({
				ok: true,
				guestId: existingGuest._id,
				socials: mergedSocials,
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
