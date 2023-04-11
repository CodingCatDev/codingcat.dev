import { ccdValidateSessionCookie } from '$lib/server/firebase';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    const ccdsession = cookies.get('session');

    if (!ccdsession) {
        throw redirect(307, '/login');
    }

    const decodedClaims = await ccdValidateSessionCookie(ccdsession);

    if (!decodedClaims) {
        throw redirect(307, '/login');
    }

    return {
        user: decodedClaims
    };
}) satisfies LayoutServerLoad;