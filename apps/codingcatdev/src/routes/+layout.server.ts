import { ccdValidateSessionCookie } from '$lib/server/firebase';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const ccdsession = cookies.get('session');
	if (!ccdsession) {
		return {};
	}
	const decodedClaims = await ccdValidateSessionCookie(ccdsession);
	return {
		user: decodedClaims
	};
}) satisfies LayoutServerLoad;
