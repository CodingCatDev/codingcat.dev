import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { codingCatDevTheme } from './theme';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts,md}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts,md}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [codingCatDevTheme]
			}
		})
	]
} satisfies Config;

export default config;
