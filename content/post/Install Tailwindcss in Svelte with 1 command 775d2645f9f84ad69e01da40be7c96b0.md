---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1669730327/main-codingcatdev-photo/Install_Tailwind_in_Svelte.png
devto: https://dev.to/codingcatdev/install-tailwindcss-in-svelte-with-1-command-2gnm
excerpt: Stop using the 5 step method and remember the npx command to install tailwind.
hashnode: https://hashnode.codingcat.dev/post-install-tailwindcss-in-svelte-with-1-command
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=install-tailwindcss-in-svelte-with-1-command&_id=775d2645f9f84ad69e01da40be7c96b0
published: published
slug: install-tailwindcss-in-svelte-with-1-command
start: November 28, 2022
title: Install Tailwindcss in Svelte with 1 command
---
Here is how to install Tailwindcss in Svelte

```bash
npx svelte-add tailwindcss
```

Yep thats it you don’t need anything else :D

Okay so what does this actually do?

![Untitled](https://media.codingcat.dev/image/upload/v1670411648/main-codingcatdev-photo/1b1852c1-dbaf-450e-b3bc-95c72e1cbc25.png)

## Update ./package.json

Includes the required development packages.

```jsx
"devDependencies": {
...
"postcss": "^8.4.14",
"postcss-load-config": "^4.0.1",
"svelte-preprocess": "^4.10.7",
"autoprefixer": "^10.4.7",
"tailwindcss": "^3.1.5"
}
```

## Add ./tailwind.config.json

Adds the correct configuration for Tailwind, which adds all of the necessary content file types.

```jsx
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: []
};

module.exports = config;
```

## Update ./svelte.config.js

Updates to add the preprocess requirement. 

```jsx
import preprocess from 'svelte-preprocess';

...
preprocess: [
		preprocess({
			postcss: true
		})
	]
...
```

## Add ./postcss.config.cjs

```jsx
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;
```

## Add ./src/app.postcss

Includes the global files

```css
/* Write your global styles here, in PostCSS syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Add ./src/routes/+layout.svelte

```jsx
<script>
	import '../app.postcss';
</script>

<slot />
```