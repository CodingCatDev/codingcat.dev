import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';

console.log('environment: ', process.env.NODE_ENV);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
