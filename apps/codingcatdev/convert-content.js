import { readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync } from 'fs';
const CONTENT = './src/content/';
const NONCOURSEROUTES = './src/routes/(content-single)/(non-course)';
const COURSEROUTES = './src/routes/(content-single)';
const types = readdirSync(CONTENT);

for (const type of types) {
	console.log('EXECUTE', type);

	// Clean up directories
	if (type === 'course') {
		rmSync(`${COURSEROUTES}/${type}`, { recursive: true, force: true });
		mkdirSync(`${COURSEROUTES}/${type}`);
	} else {
		rmSync(`${NONCOURSEROUTES}/${type}`, { recursive: true, force: true });
		mkdirSync(`${NONCOURSEROUTES}/${type}`);
	}

	// Move file from md, to route
	if (type === 'course') {
		const courses = readdirSync(`${CONTENT}/${type}`);
		for (const course of courses) {
			// Read File
			const md = readFileSync(`${CONTENT}/${type}/${course}/index.md`, 'utf8');

			// add types
			const finalMd = md.replace('---', `---\ntype: ${type}`);

			// Create new directory
			const dirName = course.replace('.md', '');
			mkdirSync(`${COURSEROUTES}/${type}/${dirName}`);

			// Write +page as new file
			writeFileSync(`${COURSEROUTES}/${type}/${dirName}/+page.md`, finalMd);

			// Lessons
			const lessons = readdirSync(`${CONTENT}/${type}/${course}/lesson`);
			if (lessons) {
				mkdirSync(`${COURSEROUTES}/${type}/${course}/lesson`);
			}
			for (const lesson of lessons) {
				// Read File
				const md = readFileSync(`${CONTENT}/${type}/${course}/lesson/${lesson}`, 'utf8');

				// add types
				const finalMd = md.replace('---', `---\ntype: lesson`);

				// Create new directory
				const dirName = lesson.replace('.md', '');
				mkdirSync(`${COURSEROUTES}/${type}/${course}/lesson/${dirName}`);

				// Write +page as new file
				writeFileSync(`${COURSEROUTES}/${type}/${course}/lesson/${dirName}/+page.md`, finalMd);
			}
		}
	} else {
		const files = readdirSync(`${CONTENT}/${type}`);
		for (const file of files) {
			// Read File
			const md = readFileSync(`${CONTENT}/${type}/${file}`, 'utf8');

			// add types
			const finalMd = md.replace('---', `---\ntype: ${type}`);

			// Create new directory
			const dirName = file.replace('.md', '');
			mkdirSync(`${NONCOURSEROUTES}/${type}/${dirName}`);

			// Write +page as new file
			writeFileSync(`${NONCOURSEROUTES}/${type}/${dirName}/+page.md`, finalMd);
		}
	}
}
