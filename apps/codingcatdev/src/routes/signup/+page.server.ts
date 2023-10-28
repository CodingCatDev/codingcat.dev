import { ccdCreateSessionCookie } from '$lib/server/firebase';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

//export const prerender = false;

export const actions = {
	signup: async ({ cookies, url }) => {
		const ccdLoginIdToken = cookies.get('__ccdlogin');

		if (!ccdLoginIdToken) {
			return fail(400, { missing: true });
		}

		const sessionCookie = await ccdCreateSessionCookie(ccdLoginIdToken);
		if (!sessionCookie) {
			return fail(400, { incorrect: true });
		}
		cookies.set(sessionCookie.name, sessionCookie.sessionCookie, sessionCookie.options);
		cookies.set('__ccdlogin', '', { expires: new Date(Date.now() - 3600) });

		if (url.searchParams.has('redirectTo')) {
			throw redirect(303, url.searchParams.get('redirectTo') || '/');
		}
		throw redirect(303, '/');
	}
} satisfies Actions;

export const load = async ({ parent, url }) => {
	const { user } = await parent();
	if (user) throw redirect(303, '/account');

	return {
		redirectTo: url.searchParams.get('redirectTo') || ''
	};
};
