import * as fs from 'fs';
import { globSync } from 'glob';
import { fileURLToPath } from 'url';
import { compile } from 'mdsvex';

const _TYPE = 'sponsor';

const root = fileURLToPath(new URL(`../src/routes/(content-single)/(non-course)`, import.meta.url));
const newRoot = fileURLToPath(new URL(`../content/${_TYPE}`, import.meta.url));

const directory = `${root}/${_TYPE}/**/*.md`;
console.log('finding all files in ', directory);
const files = globSync(directory);

for (const f of files) {
	fs.readFile(f, async (err, file) => {
		const { data } = await compile(file.toString());
		const slug = data?.fm?.slug;

		console.log('writing', `${newRoot}/${slug}`);
		fs.writeFileSync(`${newRoot}/${slug}.md`, file);
	});
}
