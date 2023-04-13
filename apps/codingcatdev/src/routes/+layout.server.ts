import { ccdValidateSessionCookie, validateStripeRole } from '$lib/server/firebase';

export const load = (async ({ cookies }) => {
	try {

		const ccdsession = cookies.get('session');
		if (!ccdsession) {
			return {};
		}
		const user = await ccdValidateSessionCookie(ccdsession);

		// Revalidate needed after stripe subsciption
		const stripeRole = await validateStripeRole(user.uid);
		return {
			user: {
				...user,
				stripeRole
			}
		};
	} catch (error) {
		cookies.set('session', "", { expires: new Date(0) });

		console.error(error)
		return {
		};
	}
});
