import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/tutorials')) {
        throw redirect(301, '/posts');
    }

    if (event.url.pathname.startsWith('/tutorial')) {
        throw redirect(301, `/post/${event.url.pathname.split('/').at(-1)}`);
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle;