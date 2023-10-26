import { listContent, getContentTypeDirectory } from '$lib/server/content';
import { ccdValidateSessionCookie, validateStripeRole } from '$lib/server/firebase';
import { type Content, ContentType } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

//export const prerender = false;
export const load = async ({ cookies }: { cookies: Cookies }) => {
	try {
		// Get latest podcast
		const podcasts = (
			await listContent<Content>({
				contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
				limit: 5
			})
		).content;

		const ccdsession = cookies.get('session');
		if (!ccdsession) {
			return {
				podcasts
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
			previewMode: env?.PREVIEW
		};
	} catch (error) {
		cookies.set('session', '', { expires: new Date(0) });

		console.error(error);
		return {
			previewMode: env?.PREVIEW
		};
	}
};
