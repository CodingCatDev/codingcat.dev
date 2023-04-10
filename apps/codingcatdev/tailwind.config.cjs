/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@codingcatdev/blackcatui'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		// 3. Append the Skeleton plugin to the end of this list
		...require('@codingcatdev/blackcatui/dist/tailwind/blackcatui.cjs')()
	]
};
