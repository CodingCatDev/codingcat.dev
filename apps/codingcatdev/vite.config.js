import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "codingcatdev",
            project: "codingcatdev-main"
        }
    }), sveltekit()],

    test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

    ssr: {
		noExternal: ['gsap', '@gsap/shockingly', '@cloudinary/html']
	}
};

export default config;