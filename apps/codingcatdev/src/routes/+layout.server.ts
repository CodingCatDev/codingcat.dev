import { ccdValidateSessionCookie } from '$lib/server/firebase';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	try {

		const ccdsession = cookies.get('session');
		if (!ccdsession) {
			return {};
		}
		const decodedClaims = await ccdValidateSessionCookie(ccdsession);
		return {
			user: decodedClaims
		};
	} catch (error) {
		cookies.set('session', "", { expires: new Date(0) });

		console.error(error)
		return {
		};
	}
}) satisfies LayoutServerLoad;
