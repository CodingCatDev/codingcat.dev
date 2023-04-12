import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Set within root layout, persists current SvelteKit $page.url.pathname
export const storeCurrentUrl: Writable<string | undefined> = writable(undefined);
export const overlayMenuActive = writable(false);

export interface User {
    email?: string;
    picture?: string;
    uid?: string;
}
export const storeUser: Writable<User | undefined> = writable(undefined);
