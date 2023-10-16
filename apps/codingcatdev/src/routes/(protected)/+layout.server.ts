import { allowLocal } from '$lib/server/content';
import { getStripeProducts } from '$lib/server/firebase';
import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = async ({ url, parent }) => {
	const data = await parent();
	if (!allowLocal && !data?.user?.uid) {
		throw redirect(307, `/login?redirectTo=${url.pathname}`);
	}
	if (data?.user?.stripeRole && url.searchParams.has('redirectTo')) {
		throw redirect(303, url.searchParams.get('redirectTo') || '/');
	}
	return {
		products: await getStripeProducts()
	};
};
