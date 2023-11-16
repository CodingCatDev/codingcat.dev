import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';

// TODO: remove .svx and .md from production builds

/** @type {import('@sveltejs/kit').Config} */
console.log(`Using ${process.env.NODE_ENV} config`);
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'warn',
			handleHttpError: ({ path, referrer, message }) => {
				// if nothing refers to it we don't care
				// most likely this is a draft in production
				// TODO: can we make this better?
				if (referrer === null) {
					console.debug('SKIPPING 404 ISSUE', path);
					return;
				}

				// otherwise fail the build
				throw new Error(message);
			}
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		mdsvex({ extensions: ['.svx', '.md'], rehypePlugins: [rehypeSlug] }),
		preprocess({
			postcss: true
		})
	]
};

export default config;
