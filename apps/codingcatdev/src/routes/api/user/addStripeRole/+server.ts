import { json } from '@sveltejs/kit';
import {
	ccdValidateSessionCookie,
	isAdmin,
	setStripeRole,
	validateStripeRole
} from '$lib/server/firebase';
import { error } from 'console';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ cookies, url }) => {
	const ccdsession = cookies.get('session');
	if (!ccdsession) {
		throw error(401, {
			message: 'No User'
		});
	}
	const user = await ccdValidateSessionCookie(ccdsession);

	// Revalidate needed after stripe subsciption
	const stripeRole = await validateStripeRole(user.uid);

	// See if you are allowed to upgrade
	const admin = await isAdmin(user?.uid);

	if (admin) {
		const uid = url?.searchParams?.get('uid') || user?.uid;
		const remove = url?.searchParams?.get('remove') ? true : undefined;
		await setStripeRole(uid, remove);
	}

	return json({
		user: {
			...user,
			stripeRole
		}
	});
};
