import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { navigating } from "$app/stores";


// Set within root layout, persists current SvelteKit $page.url.pathname
export const storeCurrentUrl: Writable<string | undefined> = writable(undefined);
export const overlayMenuActive = writable(false);

export interface User {
    email?: string;
    picture?: string;
    uid?: string;
}
export const storeUser: Writable<User | undefined> = writable(undefined);

let navTimer: number | NodeJS.Timeout | null | undefined = null;
export const navigationIsDelayed = derived(navigating, (newValue, set) => {
    if (navTimer) { clearTimeout(navTimer); }
    if (newValue) {
        navTimer = setTimeout(() => set(true), 500);
    }
    set(false);
});