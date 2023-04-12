import { ccdValidateSessionCookie } from '$lib/server/firebase';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
    const ccdsession = cookies.get('session');

    if (!ccdsession) {
        throw redirect(307, `/login?redirectTo=${url.pathname}`);
    }

    const decodedClaims = await ccdValidateSessionCookie(ccdsession);

    if (!decodedClaims) {
        throw redirect(307, `/login?redirectTo=${url.pathname}`);
    }

    return {
        user: decodedClaims
    };
}) satisfies LayoutServerLoad;