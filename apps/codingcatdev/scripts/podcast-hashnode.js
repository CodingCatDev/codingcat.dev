/*
 * You can test this using act
 * run act -s PRIVATE_DEVTO=yourapikey
 */

import { Glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';

const TYPE = 'podcast';
const BASE = `../src/routes/(content-single)/(non-course)/${TYPE}/`;
const g = new Glob(`${BASE}**/*.md`, {});

const delay = async (ms) => new Promise((res) => setTimeout(res, ms));

const addArticle = async (input) => {
	return fetch('https://api.hashnode.com/', {
		method: 'POST',
		headers: {
			authorization: process.env.PRIVATE_HASHNODE,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			operationName: 'createPublication',
			query: `mutation createPublication($input: CreateStoryInput!) { 
				createPublicationStory(
				  publicationId: "60242f8180da6c44eadf775b"
				  input: $input
				) {
				message
				post {
				  _id
				  title
				  slug
				}
			  }
			}
			  `,
			variables: {
				input: {
					isPartOfPublication: {
						publicationId: '60242f8180da6c44eadf775b'
					},
					...input
				}
			}
		})
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
		fm?.spotify &&
		fm?.youtube &&
		fm?.published === 'published' &&
		new Date(fm?.start) < new Date() &&
		!fm?.hashnode
	) {
		console.log('Adding', { slug: fm?.slug, hashnode: fm?.hashnode });

		try {
			console.log('addArticle to hashnode');

			// const response = await addArticle(

			const finalContent = `
Original: https://codingcat.dev/${TYPE}/${fm.slug}

${fm?.spotify ? '%[' + fm.spotify + ']' : ''}

${fm?.youtube ? '%[' + fm.youtube + ']' : ''}

${content}`;
			const response = await addArticle({
				title: fm.title,
				subtitle: fm?.excerpt || '',
				slug: `${TYPE}-${fm.slug}`,
				contentMarkdown: finalContent,
				coverImageURL: fm.cover,
				isRepublished: {
					originalArticleURL: `https://codingcat.dev/${TYPE}/${fm.slug}`
				},
				tags: [
					{
						_id: '56744722958ef13879b950d3',
						name: 'podcast',
						slug: 'podcast'
					},
					{
						_id: '56744721958ef13879b94cad',
						name: 'JavaScript',
						slug: 'javascript'
					},
					{
						_id: '56744722958ef13879b94f1b',
						name: 'Web Development',
						slug: 'web-development'
					},
					{
						_id: '56744723958ef13879b955a9',
						name: 'Beginner Developers',
						slug: 'beginners'
					}
				]
			});

			console.log('addArticle result:', response.status);
			if (response?.error) console.error('error', response.error);
			// Get new devto url and update
			if (response.status === 200) {
				const json = await response.json();
				if (json?.errors?.length) {
					console.error(JSON.stringify(json.errors));
					continue;
				}
				console.log('hashnode url', json?.data?.createPublicationStory?.post?.slug);
				const hashnodeSlug = json?.data?.createPublicationStory?.post?.slug;

				if (!hashnodeSlug) {
					console.error('hashnode url missing');
					continue;
				}

				if (hashnodeSlug) {
					console.log('Updating', file, { hashnode: hashnodeSlug });
					const newMdFile = matter.stringify(content, {
						...data,
						hashnode: hashnodeSlug
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
