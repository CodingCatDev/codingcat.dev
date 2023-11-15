import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const progress = writable({
	value: 0,
	text: 'initialising'
});

/** @type {import('svelte/store').Writable<string | null>} */
export const base: import('svelte/store').Writable<string | null> = writable(null);

/** @type {import('svelte/store').Writable<Error | null>} */
export const error: import('svelte/store').Writable<Error | null> = writable(null);

/** @type {import('svelte/store').Writable<string[]>} */
export const logs: import('svelte/store').Writable<string[]> = writable([]);

/** @type {import('svelte/store').Writable<Record<string, import('./state').CompilerWarning[]>>} */
export const warnings: import('svelte/store').Writable<
	Record<string, import('./state').CompilerWarning[]>
> = writable({});

/** @type {Promise<import('$lib/types').Adapter>} */
let ready: Promise<import('$lib/types').Adapter> = new Promise(() => {});

if (browser) {
	ready = new Promise(async (fulfil, reject) => {
		try {
			const module = await import('$lib/client/adapters/webcontainer/index.js');
			const adapter = await module.create(base, error, progress, logs, warnings);

			fulfil(adapter);
		} catch (error) {
			reject(error);
		}
	});
}

type EventName = 'reload';

/** @type {Map<EventName, Set<() => void>>} */
let subscriptions: Map<EventName, Set<() => void>> = new Map([['reload', new Set()]]);

/**
 *
 * @param {EventName} event
 * @param {() => void} callback
 */
export function subscribe(event: EventName, callback: () => void) {
	subscriptions.get(event)?.add(callback);

	return () => {
		subscriptions.get(event)?.delete(callback);
	};
}

/**
 * @param {EventName} event
 */
function publish(event: EventName) {
	subscriptions.get(event)?.forEach((fn) => fn());
}

/**
 * @param {import('$lib/types').Stub[]} files
 */
export async function reset(files: import('$lib/types').Stub[]) {
	try {
		const adapter = await ready;
		const should_reload = await adapter.reset(files);

		if (should_reload) {
			publish('reload');
		}

		error.set(null);
	} catch (e) {
		error.set(e as Error);
	}
}

/**
 * @param {import('$lib/types').FileStub} file
 */
export async function update(file: import('$lib/types').FileStub) {
	const adapter = await ready;
	const should_reload = await adapter.update(file);

	if (should_reload) {
		publish('reload');
	}
}
