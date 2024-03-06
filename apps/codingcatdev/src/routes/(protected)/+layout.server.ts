import { allowLocal, getContentTypeDirectory, listContent } from '$lib/server/content';
import { getStripeProducts } from '$lib/server/firebase';
import { ContentType, type Content, type Course } from '$lib/types';
import { redirect } from '@sveltejs/kit';

//export const prerender = false;

export const load = async ({ url, parent }) => {
	const data = await parent();
	if (!allowLocal && !data?.user?.uid) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}
	if (data?.user?.stripeRole && url.searchParams.has('redirectTo')) {
		throw redirect(303, url.searchParams.get('redirectTo') || '/');
	}
	const contentList = await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(ContentType.course),
		limit: 10000,
		userPreview: true
	});

	return {
		products: await getStripeProducts(),
		courses: contentList?.content as unknown as Course[]
	};
};
