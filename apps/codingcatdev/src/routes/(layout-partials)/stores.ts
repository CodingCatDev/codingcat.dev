import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// Set within root layout, persists current SvelteKit $page.url.pathname
export const storeCurrentUrl: Writable<string | undefined> = writable(undefined);
