import { posixify, escape_parens } from '$lib/utils.js';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import glob from 'tiny-glob';
import { transform } from './markdown.js';
import type { ChapterStub, FileStub, PartStub } from '$lib/types';

const text_files = new Set([
	'.svelte',
	'.txt',
	'.json',
	'.js',
	'.ts',
	'.css',
	'.svg',
	'.html',
	'.md',
	'.env'
]);

const excluded = new Set(['.DS_Store', '.gitkeep', '.svelte-kit', 'package-lock.json']);

/** @param {string} file */
async function json(file: string) {
	return JSON.parse(await readFile(file, 'utf-8'));
}

/** @param {string} dir */
function is_valid(dir: string) {
	return /^\d{2}-/.test(dir);
}

/**
 * @param {string} path
 */
async function exists(path: string) {
	try {
		await stat(path);
		return true;
	} catch {
		return false;
	}
}

/**
 * @param {string} part
 * @param {string} chapter
 * @param {string} dir
 */
async function exists_readme(part: string, chapter: string, dir: string) {
	return exists(`content/tutorial/${part}/${chapter}/${dir}/README.md`);
}

/**
 * @returns {Promise<import('$lib/types').PartStub[]>}
 */
export async function get_index(): Promise<import('$lib/types').PartStub[]> {
	const parts = (await readdir('content/tutorial')).filter(is_valid).map(posixify);

	/** @type {import('$lib/types').PartStub[]} */
	const final_data: import('$lib/types').PartStub[] = [];

	for (const part of parts) {
		const chapters = (await readdir(`content/tutorial/${part}`)).filter(is_valid).map(posixify);

		const obj: PartStub = {
			slug: part,
			title: (await json(`content/tutorial/${part}/meta.json`)).title,
			chapters: []
		};

		for (const chapter of chapters) {
			let exercises = await readdir(`content/tutorial/${part}/${chapter}`);
			for (const exercise of exercises) {
				if (!(is_valid(exercise) && (await exists_readme(part, chapter, exercise)))) {
					exercises = exercises.filter((e) => e !== exercise);
				}
			}
			exercises = exercises.map(posixify);

			const chapters_obj = {
				slug: chapter,
				title: (await json(`content/tutorial/${part}/${chapter}/meta.json`)).title,
				exercises: []
			} as ChapterStub;

			for (const exercise of exercises) {
				const dir = `content/tutorial/${part}/${chapter}/${exercise}`;

				const text = await readFile(`${dir}/README.md`, 'utf-8');
				const { frontmatter } = extract_frontmatter(text, dir);
				const { title } = frontmatter;

				chapters_obj.exercises.push({
					slug: exercise.slice(3),
					title
				});
			}

			obj.chapters.push(chapters_obj);
		}

		final_data.push(obj);
	}

	return final_data;
}

/**
 * @param {string} slug
 * @returns {Promise<import('$lib/types').Exercise | undefined>}
 */
export async function get_exercise(
	dir: string
): Promise<import('$lib/types').Exercise | undefined> {
	const a = await walk(`${dir}/app-a`);
	const b = await walk(`${dir}/app-b`);
	const has_solution = Object.keys(b).length > 0;

	// ensure no duplicate content
	for (const key in b) {
		if (!a[key]) continue;
		if (b[key].type !== 'file') continue;

		const a_ = a[key] as FileStub;
		const b_ = b[key] as FileStub;

		if (a_.contents === b_.contents) {
			throw new Error(`duplicate file: ${dir} ${key}`);
		}
	}

	const solution = { ...a };
	const all_files = { ...a, ...solution };
	const filenames = new Set(
		Object.keys(all_files).filter((filename) => all_files[filename].type === 'file')
	);

	return {
		path: '/',
		a,
		b: solution,
		has_solution
	};
}

/**
 * Get a list of all files in a directory
 * @param {string} cwd - the directory to walk
 * @param {{
 *   exclude?: string[]
 * }} options
 */
async function walk(
	cwd: string,
	options: {
		exclude?: string[];
	} = {}
) {
	/** @type {Record<string, import('$lib/types').FileStub | import('$lib/types').DirectoryStub>} */
	const result: Record<string, import('$lib/types').FileStub | import('$lib/types').DirectoryStub> =
		{};

	if (!(await exists(cwd))) return result;

	/**
	 * @param {string} dir
	 * @param {number} depth
	 */
	async function walk_dir(dir: string, depth: number) {
		const files = (await readdir(path.join(cwd, dir))).map(posixify);

		for (const basename of files) {
			if (excluded.has(basename)) continue;

			const name = dir + basename;

			if (options.exclude?.some((exclude) => posixify(name).endsWith(exclude))) continue;

			const resolved = path.join(cwd, name);
			const stats = await stat(resolved);

			if (stats.isDirectory()) {
				result[name] = {
					type: 'directory',
					name,
					basename
				};

				await walk_dir(name + '/', depth + 1);
			} else {
				const text = text_files.has(path.extname(name) || path.basename(name));
				const contents = await readFile(resolved, text ? 'utf-8' : 'base64');

				result[name] = {
					type: 'file',
					name,
					basename,
					text,
					contents
				};
			}
		}
	}

	return await walk_dir('/', 1), result;
}
