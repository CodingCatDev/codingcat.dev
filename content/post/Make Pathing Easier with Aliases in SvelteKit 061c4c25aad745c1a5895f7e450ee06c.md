---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1636202538/main-codingcatdev-photo/make_pathing_easier_with_aliases_in_sveltekit.png
devto: https://dev.to/brittneypostma/make-pathing-easier-with-aliases-in-sveltekit-37l0
excerpt: Pathing can be a pain, make it easier by using aliases!
hashnode: https://hashnode.codingcat.dev/post-make-pathing-easier-with-aliases-in-sveltekit
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=make-pathing-easier-with-aliases-in-sveltekit&_id=061c4c25aad745c1a5895f7e450ee06c
published: published
slug: make-pathing-easier-with-aliases-in-sveltekit
start: November 5, 2021
title: Make Pathing Easier with Aliases in SvelteKit
---
If you haven't heard about SvelteKit yet, go checkout the beautiful site over at [kit.svelte.dev](https://codingcat.dev/post/kit.svelte.dev). SvelteKit is a component framework similar to React and Vue with one key difference, there is no virtual DOM. Svelte is a compiler that builds itself away into a sleek and fast end user experience. If you haven't tried Svelte or SvelteKit before, you can check out my quick intro [tutorial](https://www.youtube.com/watch?v=fOD_3iSiwTQ) where we build a blog in 30 minutes 🤯

Links:

TLDR: To setup an alias add the following lines to the `svelte.config.js`. For the code editor you are using to understand the alias, we also need to add to the `jsconfig.json` paths with the aliases you want to create.

```jsx
//svelte.config.js
import path from 'path'
const config = {
	kit: {
		target: '#svelte',
        // add from here, plus the import path from 'path'
		vite: {
			resolve: {
				alias: {
                    // these are the aliases and paths to them
					'@components': path.resolve('./src/lib/components'),
					'@lib': path.resolve('./src/lib'),
					'@utils': path.resolve('./src/lib/utils')
				}
			}
		}
	},
}
export default config

```

```json
// jsconfig.json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
             // name and path to aliases
			"@components": ["src/lib/components"],
			"@lib": ["src/lib"],
			"@utils": ["src/lib/utils"]
		}
	},
	"include": ["src/**/*.d.ts", "src/**/*.js", "src/**/*.svelte"]
}

```

## Default Starter

To start a new SvelteKit project run `npm init svelte@next app-name` into the terminal where you want the folder to live. Change directory into your new app, `cd app-name` and run `npm i` to install the dependencies. Out of the box SvelteKit provides a `$lib` alias setup for the `src/lib` folder and a number of modules are available from `$app` and `$service-worker`. Outside of those, it is up to us to set up our own aliases and preferences on how to use them. These all use the `$` syntax to use it, however, we are able to change the lib folder to `@` or other symbol if preferred.

## Change default alias

To update the default `$lib` alias to `@lib`, we need to tell vite that we want to use it by updating the `svelte.config.js` and the alias will work in our application. For the code editor to understand the alias, we need to edit the `jsconfig.json` file. Inside the `svelte.config.js` by default we see this setup.

```jsx
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
}

export default config

```

Inside of the kit property, we need to add a vite config for the aliases we are setting up. I prefer the `@` symbol and will show how to setup the `@lib`, `@components`, and `@utils` aliases. We need to import the included path module from node at the top and add the vite property under the kit property. The new `svelte.config.js` will look like this.

```jsx
//svelte.config.js
import path from 'path'
const config = {
	kit: {
		target: '#svelte',
        // add from here, plus the import path from 'path'
		vite: {
			resolve: {
				alias: {
                    // these are the aliases and paths to them
					'@components': path.resolve('./src/lib/components'),
					'@lib': path.resolve('./src/lib'),
					'@utils': path.resolve('./src/lib/utils')
				}
			}
		}
	},
}
export default config

```

Next, we also need to set them up inside the `jsconfig.json` file. By default that looks like this.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
  // here is the default $lib setup by SvelteKit
      "$lib/*": ["src/lib/*"]
    }
  },
  "include": ["src/**/*.d.ts", "src/**/*.js", "src/**/*.svelte"]
}

```

As you can see, the default `$lib` is added to this config already. We need to update that and add the paths for our other two aliases. The updated file will look like this.

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@components": ["src/lib/components"],
			"@lib": ["src/lib"],
			"@utils": ["src/lib/utils"]
		}
	},
	"include": ["src/**/*.d.ts", "src/**/*.js", "src/**/*.svelte"]
}

```

Under paths we have added the `@components`, updated the `$lib` to `@lib`, and added `@utils` with the corresponding paths.

## Using the aliases

Now we need to use the aliases inside of a file. The skeleton starter doesn't come with any folders outside of the routes folder for the routes of the application. If you chose this option, you can simply add the `lib` folder inside of the `src` folder to use the `@lib` alias. The other paths and aliases we setup are nested inside the lib folder. Add a `components` folder and `utils` folder inside of the lib folder. The folder structure should look like this.

```
src
  - lib
    - components
    - utils
  - routes
```

Now any files created inside of `lib`, `components`, or `utils` can be imported using the alias rather than having to type out the absolute path, like so.

And that's it 🥳 now you can use all of the aliases we created or create more of your own. I'm [@brittneypostma](https://twitter.com/BrittneyPostma) on Twitter if you have more questions or just want to chat about Svelte 😃 Cheers!