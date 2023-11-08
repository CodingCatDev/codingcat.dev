import { listContent, getContentTypeDirectory, allowLocal } from '$lib/server/content';
import { ccdValidateSessionCookie, validateStripeRole } from '$lib/server/firebase';
import { type Content, ContentType } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';
import { preview } from '$lib/server/content';

//export const prerender = false;
export const load = async ({ cookies }: { cookies: Cookies }) => {
	// Get latest podcast
	const podcasts = (
		await listContent<Content>({
			contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
			limit: 5
		})
	).content;
	try {
		const ccdsession = cookies.get('session');
		if (!ccdsession) {
			return {
				podcasts,
				preview
			};
		}
		const user = await ccdValidateSessionCookie(ccdsession);

		// Revalidate needed after stripe subsciption
		const stripeRole = await validateStripeRole(user.uid);

		return {
			user: {
				...user,
				stripeRole
			},
			podcasts,
			preview
		};
	} catch (error) {
		cookies.set('session', '', { expires: new Date(0) });

		console.error(error);
		return {
			podcasts,
			preview
		};
	}
};
