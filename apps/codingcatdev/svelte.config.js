import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

// TODO: remove .svx and .md from production builds

/** @type {import('@sveltejs/kit').Config} */
console.log(`Using ${process.env.NODE_ENV} config`);
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleMissingId: 'warn'
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: [
		mdsvex({ extensions: ['.svx', '.md'] }),
		preprocess({
			postcss: true
		})
	]
};

export default config;
