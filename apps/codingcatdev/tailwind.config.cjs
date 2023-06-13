/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts,md}',
		require('path').join(
			require.resolve('@codingcatdev/blackcatui'),
			'../**/*.{html,js,svelte,ts,md}'
		)
	],
	theme: {
		extend: {}
	},
	plugins: [
		require('@tailwindcss/forms'),
		...require('@codingcatdev/blackcatui/dist/tailwind/blackcatui.cjs')()
	]
};
