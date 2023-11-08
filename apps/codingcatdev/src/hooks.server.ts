import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

Sentry.init({
    dsn: "https://518fe25472568a2e47252e6f29583c6b@o1029244.ingest.sentry.io/4506190917206016",
    tracesSampleRate: 1
})

export const handle = sequence(Sentry.sentryHandle(), (async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/tutorials')) {
        throw redirect(301, '/posts');
    }

    if (event.url.pathname.startsWith('/tutorial')) {
        throw redirect(301, `/post/${event.url.pathname.split('/').at(-1)}`);
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle);
export const handleError = Sentry.handleErrorWithSentry();