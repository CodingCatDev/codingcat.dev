import { ccdValidateSessionCookie, getUser, updateUser } from '$lib/server/firebase';
import type { UserDoc } from '$lib/types/index.js';
import { fail } from '@sveltejs/kit';

export const prerender = false;

export const load = async ({ url, parent }) => {
	const data = await parent();
	return {
		...(await getUser(data?.user?.uid))
	};
};

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const ccdsession = cookies.get('session');
		if (!ccdsession) {
			return fail(401, { user: 'missing' });
		}
		const user = await ccdValidateSessionCookie(ccdsession);
		const settings: UserDoc['settings'] = { ...Object.fromEntries(data.entries()) };

		await updateUser(user?.uid, settings);
	}
};
