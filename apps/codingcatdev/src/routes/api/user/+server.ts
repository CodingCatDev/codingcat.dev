import { json } from '@sveltejs/kit';
import { ccdValidateSessionCookie, isAdmin, validateStripeRole } from '$lib/server/firebase';
import { error } from 'console';

export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ cookies }) => {
	const ccdsession = cookies.get('session');
	if (!ccdsession) {
		throw error(401, {
			message: 'No User'
		});
	}
	const user = await ccdValidateSessionCookie(ccdsession);

	// Revalidate needed after stripe subsciption
	const stripeRole = await validateStripeRole(user.uid);

	return json({
		user: {
			...user,
			stripeRole
		},
		isAdmin: await isAdmin(user?.uid)
	});
};
