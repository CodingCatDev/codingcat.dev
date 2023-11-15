import { WebContainer, type FileSystemTree, type DirectoryNode } from '@webcontainer/api';
import base64 from 'base64-js';
import AnsiToHtml from 'ansi-to-html';
import * as yootils from 'yootils';
import { escape_html, get_depth } from '$lib/utils';
import { ready } from '$lib/client/common';
import type { Writable } from 'svelte/store';
import type { CompilerWarning } from '../../../../routes/(content-single)/course/state';
import type { FileStub, Stub } from '$lib/types';

const converter = new AnsiToHtml({
	fg: 'var(--sk-text-3)'
});

let vm: WebContainer;
export async function create(
	base: Writable<string | null>,
	error: Writable<Error | null>,
	progress: Writable<{ value: number; text: string }>,
	logs: Writable<string[]>,
	warnings: Writable<Record<string, CompilerWarning[]>>
) {
	progress.set({ value: 0, text: 'loading files' });

	const q = yootils.queue(1);
	/** @type {Map<string, Array<import('$lib/types').FileStub>>} */
	const q_per_file = new Map();

	/** Paths and contents of the currently loaded file stubs */
	let current_stubs = stubs_to_map([]);

	progress.set({ value: 1 / 5, text: 'booting webcontainer' });
	vm = await WebContainer.boot();

	let $warnings: Record<string, CompilerWarning[]>;
	warnings.subscribe((value) => ($warnings = value));

	let timeout: any;

	function schedule_to_update_warning(msec: number) {
		clearTimeout(timeout);
		timeout = setTimeout(() => warnings.set($warnings), msec);
	}

	const log_stream = () =>
		new WritableStream({
			write(chunk) {
				if (chunk === '\x1B[1;1H') {
					// clear screen
					logs.set([]);
				} else if (chunk?.startsWith('svelte:warnings:')) {
					/** @type {CompilerWarning} */
					const warn = JSON.parse(chunk.slice(16));
					const current = $warnings[warn.filename];

					if (!current) {
						$warnings[warn.filename] = [warn];
						// the exact same warning may be given multiple times in a row
					} else if (!current.some((s) => s.code === warn.code && s.pos === warn.pos)) {
						current.push(warn);
					}

					schedule_to_update_warning(100);
				} else {
					const log = converter.toHtml(escape_html(chunk)).replace(/\n/g, '<br>');
					logs.update(($logs) => [...$logs, log]);
				}
			}
		});

	vm.on('server-ready', (_port, url) => {
		base.set(url);
	});

	vm.on('error', ({ message }) => {
		console.error(message);
		error.set(new Error(message));
	});

	let launched = false;

	async function launch() {
		if (launched) return;
		launched = true;

		progress.set({ value: 4 / 5, text: 'starting dev server' });

		await new Promise(async (fulfil, reject) => {
			const error_unsub = vm.on('error', (error) => {
				error_unsub();
				reject(new Error(error.message));
			});

			const ready_unsub = vm.on('server-ready', (_port, base) => {
				ready_unsub();
				progress.set({ value: 5 / 5, text: 'ready' });
				fulfil(base); // this will be the last thing that happens if everything goes well
			});

			await run_dev();

			async function run_dev() {
				const process = await vm.spawn('npm', ['run', 'dev']);

				// TODO differentiate between stdout and stderr (sets `vite_error` to `true`)
				// https://github.com/stackblitz/webcontainer-core/issues/971
				process.output.pipeTo(log_stream());

				// keep restarting dev server (can crash in case of illegal +files for example)
				await process.exit;
				run_dev();
			}
		});
	}

	return {
		reset: (stubs: Stub[]) => {
			return q.add(async () => {
				const to_write: Stub[] = [];

				const force_delete = [];

				for (const stub of stubs) {
					if (stub.name.endsWith('/__delete')) {
						force_delete.push(stub.name.slice(0, -9));
					} else if (stub.type === 'file') {
						if (stub.contents.startsWith('__delete')) {
							force_delete.push(stub.name);
							continue;
						}

						const current = current_stubs.get(stub.name) as FileStub;

						if (current?.contents !== stub.contents) {
							to_write.push(stub);
						}
					} else {
						// always add directories, otherwise convert_stubs_to_tree will fail
						to_write.push(stub);
					}

					current_stubs.delete(stub.name);
				}

				// Don't delete the node_modules folder when switching from one exercise to another
				// where, as this crashes the dev server.
				const to_delete = [
					...Array.from(current_stubs.keys()).filter((s) => !s.startsWith('/node_modules')),
					...force_delete
				];

				// initialize warnings of written files
				to_write
					.filter((stub) => stub.type === 'file' && $warnings[stub.name])
					.forEach((stub) => ($warnings[stub.name] = []));
				// remove warnings of deleted files
				to_delete
					.filter((stubname) => $warnings[stubname])
					.forEach((stubname) => delete $warnings[stubname]);

				warnings.set($warnings);

				current_stubs = stubs_to_map(stubs);

				// For some reason, server-ready is fired again when the vite dev server is restarted.
				// We need to wait for it to finish before we can continue, else we might
				// request files from Vite before it's ready, leading to a timeout.
				const will_restart =
					launched && (to_write.some(is_config) || to_delete.some(is_config_path));
				const promise = will_restart ? wait_for_restart_vite() : Promise.resolve();

				for (const file of to_delete) {
					await vm.fs.rm(file, { force: true, recursive: true });
				}

				await vm.mount(convert_stubs_to_tree(to_write));

				progress.set({ value: 3 / 5, text: 'installing packages' });
				const install = await vm.spawn('npm', ['install']);
				install.output.pipeTo(log_stream());
				const code = await install.exit;

				if (code !== 0) {
					throw new Error('Unable to run npm install');
				}

				await promise;
				await new Promise((f) => setTimeout(f, 200)); // wait for chokidar

				// Also trigger a reload of the iframe in case new files were added / old ones deleted,
				// because that can result in a broken UI state
				const should_reload = !launched || will_restart || to_delete.length > 0;

				await launch();

				return should_reload;
			});
		},
		update: (file: FileStub) => {
			let queue = q_per_file.get(file.name);
			if (queue) {
				queue.push(file);
				return Promise.resolve(false);
			}

			q_per_file.set(file.name, (queue = [file]));

			return q.add(async () => {
				const root: FileSystemTree = {};

				let tree = root;

				const path = file.name.split('/').slice(1);
				const basename = path.pop() as string;

				for (const part of path) {
					if (!tree[part]) {
						const directory = {};

						tree[part] = {
							directory
						};
					}
					// @ts-ignore
					// TODO: fix this types
					tree = tree[part].directory;
				}

				const will_restart = is_config(file);

				while (queue && queue.length > 0) {
					// if the file is updated many times rapidly, get the most recently updated one
					const file: FileStub = queue.pop();
					queue.length = 0;

					tree[basename] = to_file(file);

					// initialize warnings of this file
					$warnings[file.name] = [];
					schedule_to_update_warning(100);

					await vm.mount(root);

					if (will_restart) await wait_for_restart_vite();

					current_stubs.set(file.name, file);

					// we need to stagger sequential updates, just enough that the HMR
					// wires don't get crossed. 50ms seems to be enough of a delay
					// to avoid glitches without noticeably affecting update speed
					await new Promise((f) => setTimeout(f, 50));
				}

				q_per_file.delete(file.name);

				return will_restart;
			});
		}
	};
}

function is_config(file: Stub) {
	return file.type === 'file' && is_config_path(file.name);
}

function is_config_path(path: string) {
	return ['/vite.config.js', '/svelte.config.js', '/.env'].includes(path);
}

function wait_for_restart_vite() {
	return new Promise((fulfil, reject) => {
		const error_unsub = vm.on('error', (error) => {
			error_unsub();
			reject(new Error(error.message));
		});

		const ready_unsub = vm.on('server-ready', (port, base) => {
			ready_unsub();
			console.log(`server ready on port ${port} at ${performance.now()}: ${base}`);
			fulfil(undefined);
		});

		setTimeout(() => {
			reject(new Error('Timed out resetting WebContainer'));
		}, 10000);
	});
}

function convert_stubs_to_tree(stubs: Stub[], depth = 1): FileSystemTree {
	/** @type {import('@webcontainer/api').FileSystemTree} */
	const tree = {};

	for (const stub of stubs) {
		if (get_depth(stub.name) === depth) {
			if (stub.type === 'directory') {
				const children = stubs.filter((child) => child.name.startsWith(stub.name));

				// @ts-ignore
				// TODO: fix ignore
				tree[stub.basename] = {
					directory: convert_stubs_to_tree(children, depth + 1)
				};
			} else {
				// @ts-ignore
				// TODO: fix ignore
				tree[stub.basename] = to_file(stub);
			}
		}
	}

	return tree;
}

function to_file(file: FileStub) {
	// special case
	if (file.name === '/src/app.html' || file.name === '/src/error.html') {
		const contents = file.contents + '<script type="module" src="/src/__client.js"></script>';

		return {
			file: { contents }
		};
	}

	const contents = file.text ? file.contents : base64.toByteArray(file.contents);

	return {
		file: { contents }
	};
}

function stubs_to_map(files: Stub[], map = new Map()): Map<string, Stub> {
	for (const file of files) {
		map.set(file.name, file);
	}
	return map;
}
