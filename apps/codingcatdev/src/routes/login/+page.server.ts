import { ccdCreateSessionCookie } from '$lib/server/firebase';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit'

export const actions = {
    default: async ({ cookies, url }) => {
        const ccdLoginIdToken = cookies.get('__ccdlogin');

        if (!ccdLoginIdToken) {
            return fail(400, { missing: true });
        }

        const sessionCookie = await ccdCreateSessionCookie(ccdLoginIdToken);
        if (!sessionCookie) {
            return fail(400, { incorrect: true });
        }
        cookies.set(sessionCookie.name, sessionCookie.sessionCookie, sessionCookie.options);

        if (url.searchParams.has('redirectTo')) {
            throw redirect(303, url.searchParams.get('redirectTo') || '/');
        }
        throw redirect(303, '/');
    }
} satisfies Actions;