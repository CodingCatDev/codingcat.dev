const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	daisyui: {
		themes: ['dark', 'synthwave']
	},

	plugins: [require('daisyui'), require('@tailwindcss/typography')]
};

module.exports = config;