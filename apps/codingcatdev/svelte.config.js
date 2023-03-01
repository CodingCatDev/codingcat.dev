import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
let config;

if (process.env.NODE_ENV === 'development') {
	console.log(`Using ${process.env.NODE_ENV} config`);
	config = {
		kit: {
			adapter: adapter()
		},
		extensions: ['.svelte', '.svx', '.md'],
		preprocess: [
			mdsvex({ extensions: ['.svx', '.md'] }),
			preprocess({
				postcss: true
			})
		]
	};
} else {
	config = {
		kit: {
			adapter: adapter()
		},

		preprocess: [
			preprocess({
				postcss: true
			})
		]
	};
}

export default config;
