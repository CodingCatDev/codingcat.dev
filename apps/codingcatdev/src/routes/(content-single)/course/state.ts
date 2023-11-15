import { derived, writable } from 'svelte/store';
import * as adapter from './adapter.js';
import type { FileStub, Stub } from '$lib/types';
import type { Writable } from 'svelte/store';

// TODO would be nice if svelte exported this type (maybe it does already?)
export type CompilerWarning = {
	code: string;
	start: { line: number; column: number; character: number };
	end: { line: number; column: number; character: number };
	pos: number;
	filename: string;
	frame: string;
	message: string;
};

export const files = writable<Stub[]>([]);

export const solution = writable<Record<string, Stub>>({});

export const creating: Writable<{ parent: string; type: 'file' | 'directory' } | null> =
	writable(null);

export const selected_name: Writable<string | null> = writable(null);

export const selected_file = derived([files, selected_name], ([$files, $selected_name]) => {
	return (
		$files.find((stub) => stub?.name === $selected_name) ??
		(null as unknown as FileStub | undefined)
	);
});

export function update_file(file: import('$lib/types').FileStub) {
	files.update(($files) => {
		return $files.map((old) => {
			if (old.name === file.name) {
				return file;
			}
			return old;
		});
	});

	adapter.update(file);
}

/** @param {import('$lib/types').Stub[]} new_files */
export function reset_files(new_files: import('$lib/types').Stub[]) {
	// if the selected file no longer exists, clear it
	selected_name.update(($selected_name) => {
		const file = new_files.find((file) => file.name === $selected_name);
		return file?.name ?? null;
	});

	files.set(new_files);
	adapter.reset(new_files);
}

/**
 * @param {string} name
 * @param {import('$lib/types').Stub[]} files
 */
export function create_directories(name: string, files: import('$lib/types').Stub[]) {
	const existing = new Set();

	for (const file of files) {
		if (file.type === 'directory') {
			existing.add(file.name);
		}
	}

	/** @type {import('$lib/types').DirectoryStub[]} */
	const directories: import('$lib/types').DirectoryStub[] = [];

	const parts = name.split('/');
	while (parts.length) {
		parts.pop();

		const dir = parts.join('/');
		if (existing.has(dir)) {
			break;
		}

		directories.push({
			type: 'directory',
			name: dir,
			basename: parts.at(-1) as string
		});
	}

	return directories;
}
