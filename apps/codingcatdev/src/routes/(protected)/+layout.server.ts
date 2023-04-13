import { ccdValidateSessionCookie } from '$lib/server/firebase';
import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, url }) => {
    try {
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
    } catch (error) {
        cookies.set('session', "", { expires: new Date(0) });
        console.error(error);
        throw redirect(307, `/login?redirectTo=${url.pathname}`);
    }
}) satisfies LayoutServerLoad;