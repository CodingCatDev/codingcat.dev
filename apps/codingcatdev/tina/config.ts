import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
	process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';

export default defineConfig({
	branch,

	// Get this from tina.io
	clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
	// Get this from tina.io
	token: process.env.TINA_TOKEN,

	build: {
		outputFolder: 'admin',
		publicFolder: 'static'
	},
	media: {
		loadCustomStore: async () => {
			console.log('loading cloudinary...');
			const pack = await import('next-tinacms-cloudinary');
			return pack.TinaCloudCloudinaryMediaStore;
		}
	},
	// See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
	schema: {
		collections: [
			{
				label: 'Author',
				name: 'author',
				path: 'content/author',
				fields: [
					{
						label: 'Name',
						name: 'name',
						type: 'string'
					},
					{
						label: 'Avatar',
						name: 'cover',
						type: 'string'
					}
				]
			},
			{
				name: 'post',
				label: 'Blog',
				path: 'content/post',
				fields: [
					{
						type: 'string',
						name: 'type',
						label: 'Type',
						required: true
					},
					{
						type: 'string',
						name: 'title',
						label: 'Title',
						isTitle: true,
						required: true
					},
					{
						type: 'object',
						list: true,
						name: 'authors',
						label: 'Authors',
						fields: [
							{
								type: 'reference',
								label: 'Author',
								name: 'author',
								collections: ['author']
							}
						],
						ui: {
							itemProps: (item) => {
								return {
									label: item?.author?.replace('.md', '')?.split('/')?.at(-1)
								};
							}
						}
					},
					{
						type: 'rich-text',
						name: 'body',
						label: 'Body',
						isBody: true
					}
				]
			}
		]
	}
});
