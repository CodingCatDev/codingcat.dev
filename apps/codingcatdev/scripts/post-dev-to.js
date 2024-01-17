/*
 * You can test this using act
 * run act -s PRIVATE_DEVTO=yourapikey
 */

import { Glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';

const TYPE = 'post';
const BASE = `../src/routes/(content-single)/(non-course)/${TYPE}/`;
const g = new Glob(`${BASE}**/*.md`, {});

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));
const addArticle = async (data) => {
	return fetch('https://dev.to/api/articles/', {
		method: 'POST',
		headers: {
			'api-key': process.env.PRIVATE_DEVTO,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
};

for await (const file of g) {
	const mdFile = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
	const { data, content } = await matter(mdFile); // data has frontmatter, code is html
	const fm = data;
	if (!fm) continue;
	// TODO: We might need to add a check on cononical if this page is already in dev.to
	if (
		fm?.slug &&
		fm?.title &&
		fm?.cover &&
		fm?.published === 'published' &&
		new Date(fm?.start) < new Date() &&
		!fm?.devto
	) {
		console.log('Adding', { slug: fm?.slug, devto: fm?.devto });

		try {
			console.log('addArticle to devto');
			const response = await addArticle({
				article: {
					title: fm.title,
					published: true,
					tags: ['podcast', 'webdev', 'javascript', 'beginners'],
					main_image: fm.cover.replace('upload/', 'upload/b_rgb:5e1186,c_pad,w_1000,h_420/'),
					canonical_url: `https://codingcat.dev/${TYPE}/${fm.slug}`,
					description: fm?.excerpt || '',
					organization_id: '1009',
					body_markdown: content
				}
			});
			console.log('addArticle result:', response.status);

			// Get new devto url and update
			if (response.status === 201) {
				const json = await response.json();
				if (json?.url) {
					console.log('Updating', file, { devto: json.url });
					const newMdFile = matter.stringify(content, {
						...data,
						devto: json.url
					});
					fs.writeFileSync(file, newMdFile, { encoding: 'utf8' });
				}
			}
			// Avoid 429
			await delay(process.env?.SYNDICATE_DELAY ? Integer(process.env.SYNDICATE_DELAY) : 10000);
		} catch (error) {
			console.error(error);
		}
	}
}
