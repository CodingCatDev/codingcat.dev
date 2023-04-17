export function content() {
	return [
		{ breadcrumbs: ['Introduction'], href: '/docs/introduction', content: '' },
		{
			breadcrumbs: ['Introduction', 'Before we begin'],
			href: '/docs/introduction#before-we-begin',
			content:
				"If you're new to Svelte or SvelteKit we recommend checking out the interactive tutorial.\n\nIf you get stuck, reach out for help in the Discord chatroom."
		},
		{
			breadcrumbs: ['Introduction', 'What is SvelteKit?'],
			href: '/docs/introduction#what-is-sveltekit',
			content:
				"SvelteKit is a framework for rapidly developing robust, performant web applications using Svelte. If you're coming from React, SvelteKit is similar to Next. If you're coming from Vue, SvelteKit is similar to Nuxt."
		},
		{
			breadcrumbs: ['Introduction', 'What is Svelte?'],
			href: '/docs/introduction#what-is-svelte',
			content:
				"In short, Svelte is a way of writing user interface components — like a navigation bar, comment section, or contact form — that users see and interact with in their browsers. The Svelte compiler converts your components to JavaScript that can be run to render the HTML for the page and to CSS that styles the page. You don't need to know Svelte to understand the rest of this guide, but it will help. If you'd like to learn more, check out the Svelte tutorial."
		},
		{
			breadcrumbs: ['Introduction', 'What does SvelteKit provide on top of Svelte?'],
			href: '/docs/introduction#what-does-sveltekit-provide-on-top-of-svelte',
			content:
				'Svelte renders UI components. You can compose these components and render an entire page with just Svelte, but you need more than just Svelte to write an entire app.\n\nSvelteKit provides basic functionality like a router — which updates the UI when a link is clicked — and server-side rendering (SSR). But beyond that, building an app with all the modern best practices is fiendishly complicated. Those practices include build optimizations, so that you load only the minimal required code; offline support; preloading pages before the user initiates navigation; configurable rendering that allows you to render different parts of your app on the server with SSR, in the browser client-side rendering, or at build-time with prerendering; and many other things. SvelteKit does all the boring stuff for you so that you can get on with the creative part.\n\nIt reflects changes to your code in the browser instantly to provide a lightning-fast and feature-rich development experience by leveraging Vite with a Svelte plugin to do Hot Module Replacement (HMR).'
		},
		{
			breadcrumbs: ['Creating a project'],
			href: '/docs/creating-a-project',
			content:
				"The easiest way to start building a SvelteKit app is to run npm create:\n\nnpm create svelte@latest my-app\ncd my-app\nnpm install\nnpm run devThe first command will scaffold a new project in the my-app directory asking you if you'd like to set up some basic tooling such as TypeScript. See the FAQ for pointers on setting up additional tooling. The subsequent commands will then install its dependencies and start a server on localhost:5173.\n\nThere are two basic concepts:\n\nEach page of your app is a Svelte component\nYou create pages by adding files to the src/routes directory of your project. These will be server-rendered so that a user's first visit to your app is as fast as possible, then a client-side app takes over\n\nTry editing the files to get a feel for how everything works."
		},
		{
			breadcrumbs: ['Creating a project', 'Editor setup'],
			href: '/docs/creating-a-project#editor-setup',
			content:
				'We recommend using Visual Studio Code (aka VS Code) with the Svelte extension, but support also exists for numerous other editors.'
		},
		{
			breadcrumbs: ['Project structure'],
			href: '/docs/project-structure',
			content:
				"A typical SvelteKit project looks like this:\n\nmy-project/\n├ src/\n│ ├ lib/\n│ │ ├ server/\n│ │ │ └ [your server-only lib files]\n│ │ └ [your lib files]\n│ ├ params/\n│ │ └ [your param matchers]\n│ ├ routes/\n│ │ └ [your routes]\n│ ├ app.html\n│ ├ error.html\n│ ├ hooks.client.js\n│ └ hooks.server.js\n├ static/\n│ └ [your static assets]\n├ tests/\n│ └ [your tests]\n├ package.json\n├ svelte.config.js\n├ tsconfig.json\n└ vite.config.jsYou'll also find common files like .gitignore and .npmrc (and .prettierrc and .eslintrc.cjs and so on, if you chose those options when running npm create svelte@latest)."
		},
		{
			breadcrumbs: ['Project structure', 'Project files'],
			href: '/docs/project-structure#project-files',
			content: ''
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'src'],
			href: '/docs/project-structure#project-files-src',
			content:
				"The src directory contains the meat of your project. Everything except src/routes and src/app.html is optional.\n\nlib contains your library code (utilities and components), which can be imported via the $lib alias, or packaged up for distribution using svelte-packageserver contains your server-only library code. It can be imported by using the $lib/server alias. SvelteKit will prevent you from importing these in client code.\n\n\nparams contains any param matchers your app needs\nroutes contains the routes of your application. You can also colocate other components that are only used within a single route here\napp.html is your page template — an HTML document containing the following placeholders:%sveltekit.head% — <link> and <script> elements needed by the app, plus any <svelte:head> content\n%sveltekit.body% — the markup for a rendered page. This should live inside a <div> or other element, rather than directly inside <body>, to prevent bugs caused by browser extensions injecting elements that are then destroyed by the hydration process. SvelteKit will warn you in development if this is not the case\n%sveltekit.assets% — either paths.assets, if specified, or a relative path to paths.base\n%sveltekit.nonce% — a CSP nonce for manually included links and scripts, if used\n%sveltekit.env.[NAME]% - this will be replaced at render time with the [NAME] environment variable, which must begin with the publicPrefix (usually PUBLIC_). It will fallback to '' if not matched.\n\n\nerror.html is the page that is rendered when everything else fails. It can contain the following placeholders:%sveltekit.status% — the HTTP status\n%sveltekit.error.message% — the error message\n\n\nhooks.client.js contains your client hooks\nhooks.server.js contains your server hooks\nservice-worker.js contains your service worker\n\nYou can use .ts files instead of .js files, if using TypeScript.\n\nIf you added Vitest when you set up your project, your unit tests will live in the src directory with a .test.js (or .test.ts) extension."
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'static'],
			href: '/docs/project-structure#project-files-static',
			content:
				'Any static assets that should be served as-is, like robots.txt or favicon.png, go in here.'
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'tests'],
			href: '/docs/project-structure#project-files-tests',
			content:
				'If you added Playwright for browser testing when you set up your project, the tests will live in this directory.'
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'package.json'],
			href: '/docs/project-structure#project-files-package-json',
			content:
				"Your package.json file must include @sveltejs/kit, svelte and vite as devDependencies.\n\nWhen you create a project with npm create svelte@latest, you'll also notice that package.json includes &quot;type&quot;: &quot;module&quot;. This means that .js files are interpreted as native JavaScript modules with import and export keywords. Legacy CommonJS files need a .cjs file extension."
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'svelte.config.js'],
			href: '/docs/project-structure#project-files-svelte-config-js',
			content: 'This file contains your Svelte and SvelteKit configuration.'
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'tsconfig.json'],
			href: '/docs/project-structure#project-files-tsconfig-json',
			content:
				'This file (or jsconfig.json, if you prefer type-checked .js files over .ts files) configures TypeScript, if you added typechecking during npm create svelte@latest. Since SvelteKit relies on certain configuration being set a specific way, it generates its own .svelte-kit/tsconfig.json file which your own config extends.'
		},
		{
			breadcrumbs: ['Project structure', 'Project files', 'vite.config.js'],
			href: '/docs/project-structure#project-files-vite-config-js',
			content:
				'A SvelteKit project is really just a Vite project that uses the @sveltejs/kit/vite plugin, along with any other Vite configuration.'
		},
		{
			breadcrumbs: ['Project structure', 'Other files'],
			href: '/docs/project-structure#other-files',
			content: ''
		},
		{
			breadcrumbs: ['Project structure', 'Other files', '.svelte-kit'],
			href: '/docs/project-structure#other-files-svelte-kit',
			content:
				'As you develop and build your project, SvelteKit will generate files in a .svelte-kit directory (configurable as outDir). You can ignore its contents, and delete them at any time (they will be regenerated when you next dev or build).'
		},
		{
			breadcrumbs: ['Web standards'],
			href: '/docs/web-standards',
			content:
				"Throughout this documentation, you'll see references to the standard Web APIs that SvelteKit builds on top of. Rather than reinventing the wheel, we use the platform, which means your existing web development skills are applicable to SvelteKit. Conversely, time spent learning SvelteKit will help you be a better web developer elsewhere.\n\nThese APIs are available in all modern browsers and in many non-browser environments like Cloudflare Workers, Deno and Vercel Edge Functions. During development, and in adapters for Node-based environments (including AWS Lambda), they're made available via polyfills where necessary (for now, that is — Node is rapidly adding support for more web standards).\n\nIn particular, you'll get comfortable with the following:"
		},
		{
			breadcrumbs: ['Web standards', 'Fetch APIs'],
			href: '/docs/web-standards#fetch-apis',
			content:
				"SvelteKit uses fetch for getting data from the network. It's available in hooks and server routes as well as in the browser.\n\nA special version of fetch is available in load functions, server hooks and API routes for invoking endpoints directly during server-side rendering, without making an HTTP call, while preserving credentials. (To make credentialled fetches in server-side code outside load, you must explicitly pass cookie and/or authorization headers.) It also allows you to make relative requests, whereas server-side fetch normally requires a fully qualified URL.\n\n\nBesides fetch itself, the Fetch API includes the following interfaces:"
		},
		{
			breadcrumbs: ['Web standards', 'Fetch APIs', 'Request'],
			href: '/docs/web-standards#fetch-apis-request',
			content:
				'An instance of Request is accessible in hooks and server routes as event.request. It contains useful methods like request.json() and request.formData() for getting data that was posted to an endpoint.'
		},
		{
			breadcrumbs: ['Web standards', 'Fetch APIs', 'Response'],
			href: '/docs/web-standards#fetch-apis-response',
			content:
				'An instance of Response is returned from await fetch(...) and handlers in +server.js files. Fundamentally, a SvelteKit app is a machine for turning a Request into a Response.'
		},
		{
			breadcrumbs: ['Web standards', 'Fetch APIs', 'Headers'],
			href: '/docs/web-standards#fetch-apis-headers',
			content:
				"The Headers interface allows you to read incoming request.headers and set outgoing response.headers:\n\n// @errors: 2461\n/// file: src/routes/what-is-my-user-agent/+server.js\nimport { json } from '@sveltejs/kit';\n\n/** @type {import('./$types').RequestHandler} */\nexport function GET(event) {\n    // log all headers\n    console.log(...event.request.headers);\n\n    return json({\n        // retrieve a specific header\n        userAgent: event.request.headers.get('user-agent')\n    });\n}"
		},
		{
			breadcrumbs: ['Web standards', 'FormData'],
			href: '/docs/web-standards#formdata',
			content:
				"When dealing with HTML native form submissions you'll be working with FormData objects.\n\n// @errors: 2461\n/// file: src/routes/hello/+server.js\nimport { json } from '@sveltejs/kit';\n\n/** @type {import('./$types').RequestHandler} */\nexport async function POST(event) {\n    const body = await event.request.formData();\n\n    // log all fields\n    console.log([...body]);\n\n    return json({\n        // get a specific field's value\n        name: body.get('name') ?? 'world'\n    });\n}"
		},
		{
			breadcrumbs: ['Web standards', 'Stream APIs'],
			href: '/docs/web-standards#stream-apis',
			content:
				"Most of the time, your endpoints will return complete data, as in the userAgent example above. Sometimes, you may need to return a response that's too large to fit in memory in one go, or is delivered in chunks, and for this the platform provides streams — ReadableStream, WritableStream and TransformStream."
		},
		{
			breadcrumbs: ['Web standards', 'URL APIs'],
			href: '/docs/web-standards#url-apis',
			content:
				'URLs are represented by the URL interface, which includes useful properties like origin and pathname (and, in the browser, hash). This interface shows up in various places — event.url in hooks and server routes, $page.url in pages, from and to in beforeNavigate and afterNavigate and so on.'
		},
		{
			breadcrumbs: ['Web standards', 'URL APIs', 'URLSearchParams'],
			href: '/docs/web-standards#url-apis-urlsearchparams',
			content:
				"Wherever you encounter a URL, you can access query parameters via url.searchParams, which is an instance of URLSearchParams:\n\nconst foo = url.searchParams.get('foo');"
		},
		{
			breadcrumbs: ['Web standards', 'Web Crypto'],
			href: '/docs/web-standards#web-crypto',
			content:
				"The Web Crypto API is made available via the crypto global. It's used internally for Content Security Policy headers, but you can also use it for things like generating UUIDs:\n\nconst uuid = crypto.randomUUID();"
		},
		{
			breadcrumbs: ['Routing'],
			href: '/docs/routing',
			content:
				'At the heart of SvelteKit is a filesystem-based router. The routes of your app — i.e. the URL paths that users can access — are defined by the directories in your codebase:\n\nsrc/routes is the root route\nsrc/routes/about creates an /about route\nsrc/routes/blog/[slug] creates a route with a parameter, slug, that can be used to load data dynamically when a user requests a page like /blog/hello-world\n\nYou can change src/routes to a different directory by editing the project config.\n\n\nEach route directory contains one or more route files, which can be identified by their + prefix.'
		},
		{ breadcrumbs: ['Routing', '+page'], href: '/docs/routing#page', content: '' },
		{
			breadcrumbs: ['Routing', '+page', '+page.svelte'],
			href: '/docs/routing#page-page-svelte',
			content:
				'A +page.svelte component defines a page of your app. By default, pages are rendered both on the server (SSR) for the initial request and in the browser (CSR) for subsequent navigation.\n\n/// file: src/routes/+page.svelte\n<h1>Hello and welcome to my site!</h1>\n<a href="/about">About my site</a>/// file: src/routes/about/+page.svelte\n<h1>About this site</h1>\n<p>TODO...</p>\n<a href="/">Home</a>/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n    /** @type {import(\'./$types\').PageData} */\n    export let data;\n</script>\n\n<h1>{data.title}</h1>\n<div>{@html data.content}</div>Note that SvelteKit uses <a> elements to navigate between routes, rather than a framework-specific <Link> component.'
		},
		{
			breadcrumbs: ['Routing', '+page', '+page.js'],
			href: '/docs/routing#page-page-js',
			content:
				"Often, a page will need to load some data before it can be rendered. For this, we add a +page.js (or +page.ts, if you're TypeScript-inclined) module that exports a load function:\n\n/// file: src/routes/blog/[slug]/+page.js\nimport { error } from '@sveltejs/kit';\n\n/** @type {import('./$types').PageLoad} */\nexport function load({ params }) {\n    if (params.slug === 'hello-world') {\n        return {\n            title: 'Hello world!',\n            content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'\n        };\n    }\n\n    throw error(404, 'Not found');\n}This function runs alongside +page.svelte, which means it runs on the server during server-side rendering and in the browser during client-side navigation. See load for full details of the API.\n\nAs well as load, +page.js can export values that configure the page's behaviour:\n\nexport const prerender = true or false or 'auto'\nexport const ssr = true or false\nexport const csr = true or false\n\nYou can find more information about these in page options."
		},
		{
			breadcrumbs: ['Routing', '+page', '+page.server.js'],
			href: '/docs/routing#page-page-server-js',
			content:
				"If your load function can only run on the server — for example, if it needs to fetch data from a database or you need to access private environment variables like API keys — then you can rename +page.js to +page.server.js and change the PageLoad type to PageServerLoad.\n\nimport { error } from '@sveltejs/kit';\n\n/** @type {import('./$types').PageServerLoad} */\nexport async function load({ params }) {\n    const post = await getPostFromDatabase(params.slug);\n\n    if (post) {\n        return post;\n    }\n\n    throw error(404, 'Not found');\n}During client-side navigation, SvelteKit will load this data from the server, which means that the returned value must be serializable using devalue. See load for full details of the API.\n\nLike +page.js, +page.server.js can export page options — prerender, ssr and csr.\n\nA +page.server.js file can also export actions. If load lets you read data from the server, actions let you write data to the server using the <form> element. To learn how to use them, see the form actions section."
		},
		{
			breadcrumbs: ['Routing', '+error'],
			href: '/docs/routing#error',
			content:
				"If an error occurs during load, SvelteKit will render a default error page. You can customise this error page on a per-route basis by adding an +error.svelte file:\n\n/// file: src/routes/blog/[slug]/+error.svelte\n<script>\n    import { page } from '$app/stores';\n</script>\n\n<h1>{$page.status}: {$page.error.message}</h1>SvelteKit will 'walk up the tree' looking for the closest error boundary — if the file above didn't exist it would try src/routes/blog/+error.svelte and then src/routes/+error.svelte before rendering the default error page. If that fails (or if the error was thrown from the load function of the root +layout, which sits 'above' the root +error), SvelteKit will bail out and render a static fallback error page, which you can customise by creating a src/error.html file.\n\nIf the error occurs inside a load function in +layout(.server).js, the closest error boundary in the tree is an +error.svelte file above that layout (not next to it).\n\nIf no route can be found (404), src/routes/+error.svelte (or the default error page, if that file does not exist) will be used.\n\n+error.svelte is not used when an error occurs inside handle or a +server.js request handler.\n\n\nYou can read more about error handling here."
		},
		{
			breadcrumbs: ['Routing', '+layout'],
			href: '/docs/routing#layout',
			content:
				"So far, we've treated pages as entirely standalone components — upon navigation, the existing +page.svelte component will be destroyed, and a new one will take its place.\n\nBut in many apps, there are elements that should be visible on every page, such as top-level navigation or a footer. Instead of repeating them in every +page.svelte, we can put them in layouts."
		},
		{
			breadcrumbs: ['Routing', '+layout', '+layout.svelte'],
			href: '/docs/routing#layout-layout-svelte',
			content:
				'To create a layout that applies to every page, make a file called src/routes/+layout.svelte. The default layout (the one that SvelteKit uses if you don\'t bring your own) looks like this...\n\n<slot></slot>...but we can add whatever markup, styles and behaviour we want. The only requirement is that the component includes a <slot> for the page content. For example, let\'s add a nav bar:\n\n/// file: src/routes/+layout.svelte\n<nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n    <a href="/settings">Settings</a>\n</nav>\n\n<slot></slot>If we create pages for /, /about and /settings...\n\n/// file: src/routes/+page.svelte\n<h1>Home</h1>/// file: src/routes/about/+page.svelte\n<h1>About</h1>/// file: src/routes/settings/+page.svelte\n<h1>Settings</h1>...the nav will always be visible, and clicking between the three pages will only result in the <h1> being replaced.\n\nLayouts can be nested. Suppose we don\'t just have a single /settings page, but instead have nested pages like /settings/profile and /settings/notifications with a shared submenu (for a real-life example, see github.com/settings).\n\nWe can create a layout that only applies to pages below /settings (while inheriting the root layout with the top-level nav):\n\n/// file: src/routes/settings/+layout.svelte\n<script>\n    /** @type {import(\'./$types\').LayoutData} */\n    export let data;\n</script>\n\n<h1>Settings</h1>\n\n<div class="submenu">\n    {#each data.sections as section}\n        <a href="/settings/{section.slug}">{section.title}</a>\n    {/each}\n</div>\n\n<slot></slot>By default, each layout inherits the layout above it. Sometimes that isn\'t what you want - in this case, advanced layouts can help you.'
		},
		{
			breadcrumbs: ['Routing', '+layout', '+layout.js'],
			href: '/docs/routing#layout-layout-js',
			content:
				"Just like +page.svelte loading data from +page.js, your +layout.svelte component can get data from a load function in +layout.js.\n\n/// file: src/routes/settings/+layout.js\n/** @type {import('./$types').LayoutLoad} */\nexport function load() {\n    return {\n        sections: [\n            { slug: 'profile', title: 'Profile' },\n            { slug: 'notifications', title: 'Notifications' }\n        ]\n    };\n}If a +layout.js exports page options — prerender, ssr and csr — they will be used as defaults for child pages.\n\nData returned from a layout's load function is also available to all its child pages:\n\n/// file: src/routes/settings/profile/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n    console.log(data.sections); // [{ slug: 'profile', title: 'Profile' }, ...]\n</script>Often, layout data is unchanged when navigating between pages. SvelteKit will intelligently re-run load functions when necessary."
		},
		{
			breadcrumbs: ['Routing', '+layout', '+layout.server.js'],
			href: '/docs/routing#layout-layout-server-js',
			content:
				"To run your layout's load function on the server, move it to +layout.server.js, and change the LayoutLoad type to LayoutServerLoad.\n\nLike +layout.js, +layout.server.js can export page options — prerender, ssr and csr."
		},
		{
			breadcrumbs: ['Routing', '+server'],
			href: '/docs/routing#server',
			content:
				"As well as pages, you can define routes with a +server.js file (sometimes referred to as an 'API route' or an 'endpoint'), which gives you full control over the response. Your +server.js file (or +server.ts) exports functions corresponding to HTTP verbs like GET, POST, PATCH, PUT, DELETE, and OPTIONS that take a RequestEvent argument and return a Response object.\n\nFor example we could create an /api/random-number route with a GET handler:\n\n/// file: src/routes/api/random-number/+server.js\nimport { error } from '@sveltejs/kit';\n\n/** @type {import('./$types').RequestHandler} */\nexport function GET({ url }) {\n    const min = Number(url.searchParams.get('min') ?? '0');\n    const max = Number(url.searchParams.get('max') ?? '1');\n\n    const d = max - min;\n\n    if (isNaN(d) || d < 0) {\n        throw error(400, 'min and max must be numbers, and min must be less than max');\n    }\n\n    const random = min + Math.random() * d;\n\n    return new Response(String(random));\n}The first argument to Response can be a ReadableStream, making it possible to stream large amounts of data or create server-sent events (unless deploying to platforms that buffer responses, like AWS Lambda).\n\nYou can use the error, redirect and json methods from @sveltejs/kit for convenience (but you don't have to).\n\nIf an error is thrown (either throw error(...) or an unexpected error), the response will be a JSON representation of the error or a fallback error page — which can be customised via src/error.html — depending on the Accept header. The +error.svelte component will not be rendered in this case. You can read more about error handling here.\n\nWhen creating an OPTIONS handler, note that Vite will inject Access-Control-Allow-Origin and Access-Control-Allow-Methods headers — these will not be present in production unless you add them."
		},
		{
			breadcrumbs: ['Routing', '+server', 'Receiving data'],
			href: '/docs/routing#server-receiving-data',
			content:
				"By exporting POST/PUT/PATCH/DELETE/OPTIONS handlers, +server.js files can be used to create a complete API:\n\n/// file: src/routes/add/+page.svelte\n<script>\n    let a = 0;\n    let b = 0;\n    let total = 0;\n\n    async function add() {\n        const response = await fetch('/api/add', {\n            method: 'POST',\n            body: JSON.stringify({ a, b }),\n            headers: {\n                'content-type': 'application/json'\n            }\n        });\n\n        total = await response.json();\n    }\n</script>\n\n<input type=\"number\" bind:value={a}> +\n<input type=\"number\" bind:value={b}> =\n{total}\n\n<button on:click={add}>Calculate</button>/// file: src/routes/api/add/+server.js\nimport { json } from '@sveltejs/kit';\n\n/** @type {import('./$types').RequestHandler} */\nexport async function POST({ request }) {\n    const { a, b } = await request.json();\n    return json(a + b);\n}In general, form actions are a better way to submit data from the browser to the server."
		},
		{
			breadcrumbs: ['Routing', '+server', 'Content negotiation'],
			href: '/docs/routing#server-content-negotiation',
			content:
				"+server.js files can be placed in the same directory as +page files, allowing the same route to be either a page or an API endpoint. To determine which, SvelteKit applies the following rules:\n\nPUT/PATCH/DELETE/OPTIONS requests are always handled by +server.js since they do not apply to pages\nGET/POST requests are treated as page requests if the accept header prioritises text/html (in other words, it's a browser page request), else they are handled by +server.js"
		},
		{
			breadcrumbs: ['Routing', '$types'],
			href: '/docs/routing#$types',
			content:
				"Throughout the examples above, we've been importing types from a $types.d.ts file. This is a file SvelteKit creates for you in a hidden directory if you're using TypeScript (or JavaScript with JSDoc type annotations) to give you type safety when working with your root files.\n\nFor example, annotating export let data with PageData (or LayoutData, for a +layout.svelte file) tells TypeScript that the type of data is whatever was returned from load:\n\n/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n</script>In turn, annotating the load function with PageLoad, PageServerLoad, LayoutLoad or LayoutServerLoad (for +page.js, +page.server.js, +layout.js and +layout.server.js respectively) ensures that params and the return value are correctly typed.\n\nIf you're using VS Code or any IDE that supports the language server protocol and TypeScript plugins then you can omit these types entirely! Svelte's IDE tooling will insert the correct types for you, so you'll get type checking without writing them yourself. It also works with our command line tool svelte-check.\n\nYou can read more about omitting $types in our blog post about it."
		},
		{
			breadcrumbs: ['Routing', 'Other files'],
			href: '/docs/routing#other-files',
			content:
				"Any other files inside a route directory are ignored by SvelteKit. This means you can colocate components and utility modules with the routes that need them.\n\nIf components and modules are needed by multiple routes, it's a good idea to put them in $lib."
		},
		{
			breadcrumbs: ['Routing', 'Further reading'],
			href: '/docs/routing#further-reading',
			content: 'Tutorial: Routing\nTutorial: API routes\nDocs: Advanced routing'
		},
		{
			breadcrumbs: ['Loading data'],
			href: '/docs/load',
			content:
				'Before a +page.svelte component (and its containing +layout.svelte components) can be rendered, we often need to get some data. This is done by defining load functions.'
		},
		{
			breadcrumbs: ['Loading data', 'Page data'],
			href: '/docs/load#page-data',
			content:
				"A +page.svelte file can have a sibling +page.js (or +page.ts) that exports a load function, the return value of which is available to the page via the data prop:\n\n/// file: src/routes/blog/[slug]/+page.js\n/** @type {import('./$types').PageLoad} */\nexport function load({ params }) {\n    return {\n        post: {\n            title: `Title for ${params.slug} goes here`,\n            content: `Content for ${params.slug} goes here`\n        }\n    };\n}/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n</script>\n\n<h1>{data.post.title}</h1>\n<div>{@html data.post.content}</div>Thanks to the generated $types module, we get full type safety.\n\nA load function in a +page.js file runs both on the server and in the browser. If your load function should always run on the server (because it uses private environment variables, for example, or accesses a database) then it would go in a +page.server.js instead.\n\nA more realistic version of your blog post's load function, that only runs on the server and pulls data from a database, might look like this:\n\nimport * as db from '$lib/server/database';\n\n/** @type {import('./$types').PageServerLoad} */\nexport async function load({ params }) {\n    return {\n        post: await db.getPost(params.slug)\n    };\n}Notice that the type changed from PageLoad to PageServerLoad, because server load functions can access additional arguments. To understand when to use +page.js and when to use +page.server.js, see Universal vs server."
		},
		{
			breadcrumbs: ['Loading data', 'Layout data'],
			href: '/docs/load#layout-data',
			content:
				"Your +layout.svelte files can also load data, via +layout.js or +layout.server.js.\n\nimport * as db from '$lib/server/database';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport async function load() {\n    return {\n        posts: await db.getPostSummaries()\n    };\n}/// file: src/routes/blog/[slug]/+layout.svelte\n<script>\n    /** @type {import('./$types').LayoutData} */\n    export let data;\n</script>\n\n<main>\n    <!-- +page.svelte is rendered in this <slot> -->\n    <slot />\n</main>\n\n<aside>\n    <h2>More posts</h2>\n    <ul>\n        {#each data.posts as post}\n            <li>\n                <a href=\"/blog/{post.slug}\">\n                    {post.title}\n                </a>\n            </li>\n        {/each}\n    </ul>\n</aside>Data returned from layout load functions is available to child +layout.svelte components and the +page.svelte component as well as the layout that it 'belongs' to.\n\n/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n+\timport { page } from '$app/stores';\n\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n+\t// we can access `data.posts` because it's returned from\n+\t// the parent layout `load` function\n+\t$: index = data.posts.findIndex(post => post.slug === $page.params.slug);\n+\t$: next = data.posts[index - 1];\n</script>\n\n<h1>{data.post.title}</h1>\n<div>{@html data.post.content}</div>\n\n+{#if next}\n+\t<p>Next post: <a href=\"/blog/{next.slug}\">{next.title}</a></p>\n+{/if}If multiple load functions return data with the same key, the last one 'wins' — the result of a layout load returning { a: 1, b: 2 } and a page load returning { b: 3, c: 4 } would be { a: 1, b: 3, c: 4 }."
		},
		{
			breadcrumbs: ['Loading data', '$page.data'],
			href: '/docs/load#$page-data',
			content:
				"The +page.svelte component, and each +layout.svelte component above it, has access to its own data plus all the data from its parents.\n\nIn some cases, we might need the opposite — a parent layout might need to access page data or data from a child layout. For example, the root layout might want to access a title property returned from a load function in +page.js or +page.server.js. This can be done with $page.data:\n\n/// file: src/routes/+layout.svelte\n<script>\n    import { page } from '$app/stores';\n</script>\n\n<svelte:head>\n    <title>{$page.data.title}</title>\n</svelte:head>Type information for $page.data is provided by App.PageData."
		},
		{
			breadcrumbs: ['Loading data', 'Universal vs server'],
			href: '/docs/load#universal-vs-server',
			content:
				"As we've seen, there are two types of load function:\n\n+page.js and +layout.js files export universal load functions that run both on the server and in the browser\n+page.server.js and +layout.server.js files export server load functions that only run server-side\n\nConceptually, they're the same thing, but there are some important differences to be aware of."
		},
		{
			breadcrumbs: ['Loading data', 'Universal vs server', 'When does which load function run?'],
			href: '/docs/load#universal-vs-server-when-does-which-load-function-run',
			content:
				"Server load functions always run on the server.\n\nBy default, universal load functions run on the server during SSR when the user first visits your page. They will then run again during hydration, reusing any responses from fetch requests. All subsequent invocations of universal load functions happen in the browser. You can customize the behavior through page options. If you disable server side rendering, you'll get an SPA and universal load functions always run on the client.\n\nA load function is invoked at runtime, unless you prerender the page — in that case, it's invoked at build time."
		},
		{
			breadcrumbs: ['Loading data', 'Universal vs server', 'Input'],
			href: '/docs/load#universal-vs-server-input',
			content:
				"Both universal and server load functions have access to properties describing the request (params, route and url) and various functions (fetch, setHeaders, parent and depends). These are described in the following sections.\n\nServer load functions are called with a ServerLoadEvent, which inherits clientAddress, cookies, locals, platform and request from RequestEvent.\n\nUniversal load functions are called with a LoadEvent, which has a data property. If you have load functions in both +page.js and +page.server.js (or +layout.js and +layout.server.js), the return value of the server load function is the data property of the universal load function's argument."
		},
		{
			breadcrumbs: ['Loading data', 'Universal vs server', 'Output'],
			href: '/docs/load#universal-vs-server-output',
			content:
				'A universal load function can return an object containing any values, including things like custom classes and component constructors.\n\nA server load function must return data that can be serialized with devalue — anything that can be represented as JSON plus things like BigInt, Date, Map, Set and RegExp, or repeated/cyclical references — so that it can be transported over the network. Your data can include promises, in which case it will be streamed to browsers.'
		},
		{
			breadcrumbs: ['Loading data', 'Universal vs server', 'When to use which'],
			href: '/docs/load#universal-vs-server-when-to-use-which',
			content:
				"Server load functions are convenient when you need to access data directly from a database or filesystem, or need to use private environment variables.\n\nUniversal load functions are useful when you need to fetch data from an external API and don't need private credentials, since SvelteKit can get the data directly from the API rather than going via your server. They are also useful when you need to return something that can't be serialized, such as a Svelte component constructor.\n\nIn rare cases, you might need to use both together — for example, you might need to return an instance of a custom class that was initialised with data from your server."
		},
		{
			breadcrumbs: ['Loading data', 'Using URL data'],
			href: '/docs/load#using-url-data',
			content:
				'Often the load function depends on the URL in one way or another. For this, the load function provides you with url, route and params.'
		},
		{
			breadcrumbs: ['Loading data', 'Using URL data', 'url'],
			href: '/docs/load#using-url-data-url',
			content:
				"An instance of URL, containing properties like the origin, hostname, pathname and searchParams (which contains the parsed query string as a URLSearchParams object). url.hash cannot be accessed during load, since it is unavailable on the server.\n\nIn some environments this is derived from request headers during server-side rendering. If you're using adapter-node, for example, you may need to configure the adapter in order for the URL to be correct."
		},
		{
			breadcrumbs: ['Loading data', 'Using URL data', 'route'],
			href: '/docs/load#using-url-data-route',
			content:
				"Contains the name of the current route directory, relative to src/routes:\n\n/// file: src/routes/a/[b]/[...c]/+page.js\n/** @type {import('./$types').PageLoad} */\nexport function load({ route }) {\n    console.log(route.id); // '/a/[b]/[...c]'\n}"
		},
		{
			breadcrumbs: ['Loading data', 'Using URL data', 'params'],
			href: '/docs/load#using-url-data-params',
			content:
				'params is derived from url.pathname and route.id.\n\nGiven a route.id of /a/[b]/[...c] and a url.pathname of /a/x/y/z, the params object would look like this:\n\n{\n    "b": "x",\n    "c": "y/z"\n}'
		},
		{
			breadcrumbs: ['Loading data', 'Making fetch requests'],
			href: '/docs/load#making-fetch-requests',
			content:
				"To get data from an external API or a +server.js handler, you can use the provided fetch function, which behaves identically to the native fetch web API with a few additional features:\n\nit can be used to make credentialed requests on the server, as it inherits the cookie and authorization headers for the page request\nit can make relative requests on the server (ordinarily, fetch requires a URL with an origin when used in a server context)\ninternal requests (e.g. for +server.js routes) go direct to the handler function when running on the server, without the overhead of an HTTP call\nduring server-side rendering, the response will be captured and inlined into the rendered HTML by hooking into the text and json methods of the Response object. Note that headers will not be serialized, unless explicitly included via filterSerializedResponseHeaders. Then, during hydration, the response will be read from the HTML, guaranteeing consistency and preventing an additional network request - if you got a warning in your browser console when using the browser fetch instead of the load fetch, this is why.\n\n/// file: src/routes/items/[id]/+page.js\n/** @type {import('./$types').PageLoad} */\nexport async function load({ fetch, params }) {\n    const res = await fetch(`/api/items/${params.id}`);\n    const item = await res.json();\n\n    return { item };\n}Cookies will only be passed through if the target host is the same as the SvelteKit application or a more specific subdomain of it."
		},
		{
			breadcrumbs: ['Loading data', 'Cookies and headers'],
			href: '/docs/load#cookies-and-headers',
			content:
				"A server load function can get and set cookies.\n\nimport * as db from '$lib/server/database';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport async function load({ cookies }) {\n    const sessionid = cookies.get('sessionid');\n\n    return {\n        user: await db.getUser(sessionid)\n    };\n}When setting cookies, be aware of the path property. By default, the path of a cookie is the current pathname. If you for example set a cookie at page admin/user, the cookie will only be available within the admin pages by default. In most cases you likely want to set path to '/' to make the cookie available throughout your app.\n\n\nBoth server and universal load functions have access to a setHeaders function that, when running on the server, can set headers for the response. (When running in the browser, setHeaders has no effect.) This is useful if you want the page to be cached, for example:\n\n// @errors: 2322 1360\n/// file: src/routes/products/+page.js\n/** @type {import('./$types').PageLoad} */\nexport async function load({ fetch, setHeaders }) {\n    const url = `https://cms.example.com/products.json`;\n    const response = await fetch(url);\n\n    // cache the page for the same length of time\n    // as the underlying data\n    setHeaders({\n        age: response.headers.get('age'),\n        'cache-control': response.headers.get('cache-control')\n    });\n\n    return response.json();\n}Setting the same header multiple times (even in separate load functions) is an error — you can only set a given header once. You cannot add a set-cookie header with setHeaders — use cookies.set(name, value, options) instead."
		},
		{
			breadcrumbs: ['Loading data', 'Using parent data'],
			href: '/docs/load#using-parent-data',
			content:
				"Occasionally it's useful for a load function to access data from a parent load function, which can be done with await parent():\n\n/// file: src/routes/+layout.js\n/** @type {import('./$types').LayoutLoad} */\nexport function load() {\n    return { a: 1 };\n}/// file: src/routes/abc/+layout.js\n/** @type {import('./$types').LayoutLoad} */\nexport async function load({ parent }) {\n    const { a } = await parent();\n    return { b: a + 1 };\n}/// file: src/routes/abc/+page.js\n/** @type {import('./$types').PageLoad} */\nexport async function load({ parent }) {\n    const { a, b } = await parent();\n    return { c: a + b };\n}/// file: src/routes/abc/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n</script>\n\n<!-- renders `1 + 2 = 3` -->\n<p>{data.a} + {data.b} = {data.c}</p>Notice that the load function in +page.js receives the merged data from both layout load functions, not just the immediate parent.\n\n\nInside +page.server.js and +layout.server.js, parent returns data from parent +layout.server.js files.\n\nIn +page.js or +layout.js it will return data from parent +layout.js files. However, a missing +layout.js is treated as a ({ data }) => data function, meaning that it will also return data from parent +layout.server.js files that are not 'shadowed' by a +layout.js file\n\nTake care not to introduce waterfalls when using await parent(). Here, for example, getData(params) does not depend on the result of calling parent(), so we should call it first to avoid a delayed render.\n\n/// file: +page.js\n/** @type {import('./$types').PageLoad} */\nexport async function load({ params, parent }) {\n-\tconst parentData = await parent();\n    const data = await getData(params);\n+\tconst parentData = await parent();\n\n    return {\n        ...data\n        meta: { ...parentData.meta, ...data.meta }\n    };\n}"
		},
		{
			breadcrumbs: ['Loading data', 'Errors'],
			href: '/docs/load#errors',
			content:
				"If an error is thrown during load, the nearest +error.svelte will be rendered. For expected errors, use the error helper from @sveltejs/kit to specify the HTTP status code and an optional message:\n\nimport { error } from '@sveltejs/kit';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport function load({ locals }) {\n    if (!locals.user) {\n        throw error(401, 'not logged in');\n    }\n\n    if (!locals.user.isAdmin) {\n        throw error(403, 'not an admin');\n    }\n}If an unexpected error is thrown, SvelteKit will invoke handleError and treat it as a 500 Internal Error."
		},
		{
			breadcrumbs: ['Loading data', 'Redirects'],
			href: '/docs/load#redirects',
			content:
				"To redirect users, use the redirect helper from @sveltejs/kit to specify the location to which they should be redirected alongside a 3xx status code.\n\nimport { redirect } from '@sveltejs/kit';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport function load({ locals }) {\n    if (!locals.user) {\n        throw redirect(307, '/login');\n    }\n}Make sure you're not catching the thrown redirect, which would prevent SvelteKit from handling it.\n\n\nIn the browser, you can also navigate programmatically outside of a load function using goto from $app.navigation."
		},
		{
			breadcrumbs: ['Loading data', 'Streaming with promises'],
			href: '/docs/load#streaming-with-promises',
			content:
				"Promises at the top level of the returned object will be awaited, making it easy to return multiple promises without creating a waterfall. When using a server load, nested promises will be streamed to the browser as they resolve. This is useful if you have slow, non-essential data, since you can start rendering the page before all the data is available:\n\n/// file: src/routes/+page.server.js\n/** @type {import('./$types').PageServerLoad} */\nexport function load() {\n    return {\n        one: Promise.resolve(1),\n        two: Promise.resolve(2),\n        streamed: {\n            three: new Promise((fulfil) => {\n                setTimeout(() => {\n                    fulfil(3)\n                }, 1000);\n            })\n        }\n    };\n}This is useful for creating skeleton loading states, for example:\n\n/// file: src/routes/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n</script>\n\n<p>\n    one: {data.one}\n</p>\n<p>\n    two: {data.two}\n</p>\n<p>\n    three:\n    {#await data.streamed.three}\n        Loading...\n    {:then value}\n        {value}\n    {:catch error}\n        {error.message}\n    {/await}\n</p>On platforms that do not support streaming, such as AWS Lambda, responses will be buffered. This means the page will only render once all promises resolve.\n\nStreaming data will only work when JavaScript is enabled. You should avoid returning nested promises from a universal load function if the page is server rendered, as these are not streamed — instead, the promise is recreated when the function re-runs in the browser."
		},
		{
			breadcrumbs: ['Loading data', 'Parallel loading'],
			href: '/docs/load#parallel-loading',
			content:
				'When rendering (or navigating to) a page, SvelteKit runs all load functions concurrently, avoiding a waterfall of requests. During client-side navigation, the result of calling multiple server load functions are grouped into a single response. Once all load functions have returned, the page is rendered.'
		},
		{
			breadcrumbs: ['Loading data', 'Rerunning load functions'],
			href: '/docs/load#rerunning-load-functions',
			content:
				"SvelteKit tracks the dependencies of each load function to avoid re-running it unnecessarily during navigation.\n\nFor example, given a pair of load functions like these...\n\nimport * as db from '$lib/server/database';\n\n/** @type {import('./$types').PageServerLoad} */\nexport async function load({ params }) {\n    return {\n        post: await db.getPost(params.slug)\n    };\n}import * as db from '$lib/server/database';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport async function load() {\n    return {\n        posts: await db.getPostSummaries()\n    };\n}...the one in +page.server.js will re-run if we navigate from /blog/trying-the-raw-meat-diet to /blog/i-regret-my-choices because params.slug has changed. The one in +layout.server.js will not, because the data is still valid. In other words, we won't call db.getPostSummaries() a second time.\n\nA load function that calls await parent() will also re-run if a parent load function is re-run.\n\nDependency tracking does not apply after the load function has returned — for example, accessing params.x inside a nested promise will not cause the function to re-run when params.x changes. (Don't worry, you'll get a warning in development if you accidentally do this.) Instead, access the parameter in the main body of your load function."
		},
		{
			breadcrumbs: ['Loading data', 'Rerunning load functions', 'Manual invalidation'],
			href: '/docs/load#rerunning-load-functions-manual-invalidation',
			content:
				"You can also re-run load functions that apply to the current page using invalidate(url), which re-runs all load functions that depend on url, and invalidateAll(), which re-runs every load function.\n\nA load function depends on url if it calls fetch(url) or depends(url). Note that url can be a custom identifier that starts with [a-z]::\n\n/// file: src/routes/random-number/+page.js\n/** @type {import('./$types').PageLoad} */\nexport async function load({ fetch, depends }) {\n    // load reruns when `invalidate('https://api.example.com/random-number')` is called...\n    const response = await fetch('https://api.example.com/random-number');\n\n    // ...or when `invalidate('app:random')` is called\n    depends('app:random');\n\n    return {\n        number: await response.json()\n    };\n}/// file: src/routes/random-number/+page.svelte\n<script>\n    import { invalidate, invalidateAll } from '$app/navigation';\n\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n    function rerunLoadFunction() {\n        // any of these will cause the `load` function to re-run\n        invalidate('app:random');\n        invalidate('https://api.example.com/random-number');\n        invalidate(url => url.href.includes('random-number'));\n        invalidateAll();\n    }\n</script>\n\n<p>random number: {data.number}</p>\n<button on:click={rerunLoadFunction}>Update random number</button>To summarize, a load function will re-run in the following situations:\n\nIt references a property of params whose value has changed\nIt references a property of url (such as url.pathname or url.search) whose value has changed\nIt calls await parent() and a parent load function re-ran\nIt declared a dependency on a specific URL via fetch or depends, and that URL was marked invalid with invalidate(url)\nAll active load functions were forcibly re-run with invalidateAll()\n\nparams and url can change in response to a <a href=&quot;..&quot;> link click, a <form> interaction, a goto invocation, or a redirect.\n\nNote that re-running a load function will update the data prop inside the corresponding +layout.svelte or +page.svelte; it does not cause the component to be recreated. As a result, internal state is preserved. If this isn't what you want, you can reset whatever you need to reset inside an afterNavigate callback, and/or wrap your component in a {#key ...} block."
		},
		{
			breadcrumbs: ['Loading data', 'Further reading'],
			href: '/docs/load#further-reading',
			content: 'Tutorial: Loading data\nTutorial: Errors and redirects\nTutorial: Advanced loading'
		},
		{
			breadcrumbs: ['Form actions'],
			href: '/docs/form-actions',
			content:
				'A +page.server.js file can export actions, which allow you to POST data to the server using the <form> element.\n\nWhen using <form>, client-side JavaScript is optional, but you can easily progressively enhance your form interactions with JavaScript to provide the best user experience.'
		},
		{
			breadcrumbs: ['Form actions', 'Default actions'],
			href: '/docs/form-actions#default-actions',
			content:
				'In the simplest case, a page declares a default action:\n\n/// file: src/routes/login/+page.server.js\n/** @type {import(\'./$types\').Actions} */\nexport const actions = {\n    default: async (event) => {\n        // TODO log the user in\n    }\n};To invoke this action from the /login page, just add a <form> — no JavaScript needed:\n\n/// file: src/routes/login/+page.svelte\n<form method="POST">\n    <label>\n        Email\n        <input name="email" type="email">\n    </label>\n    <label>\n        Password\n        <input name="password" type="password">\n    </label>\n    <button>Log in</button>\n</form>If someone were to click the button, the browser would send the form data via POST request to the server, running the default action.\n\nActions always use POST requests, since GET requests should never have side-effects.\n\n\nWe can also invoke the action from other pages (for example if there\'s a login widget in the nav in the root layout) by adding the action attribute, pointing to the page:\n\n/// file: src/routes/+layout.svelte\n<form method="POST" action="/login">\n    <!-- content -->\n</form>'
		},
		{
			breadcrumbs: ['Form actions', 'Named actions'],
			href: '/docs/form-actions#named-actions',
			content:
				'Instead of one default action, a page can have as many named actions as it needs:\n\n/// file: src/routes/login/+page.server.js\n/** @type {import(\'./$types\').Actions} */\nexport const actions = {\n-\tdefault: async (event) => {\n+\tlogin: async (event) => {\n        // TODO log the user in\n    },\n+\tregister: async (event) => {\n+\t\t// TODO register the user\n+\t}\n};To invoke a named action, add a query parameter with the name prefixed by a / character:\n\n/// file: src/routes/login/+page.svelte\n<form method="POST" action="?/register">/// file: src/routes/+layout.svelte\n<form method="POST" action="/login?/register">As well as the action attribute, we can use the formaction attribute on a button to POST the same form data to a different action than the parent <form>:\n\n/// file: src/routes/login/+page.svelte\n-<form method="POST">\n+<form method="POST" action="?/login">\n    <label>\n        Email\n        <input name="email" type="email">\n    </label>\n    <label>\n        Password\n        <input name="password" type="password">\n    </label>\n    <button>Log in</button>\n+\t<button formaction="?/register">Register</button>\n</form>We can\'t have default actions next to named actions, because if you POST to a named action without a redirect, the query parameter is persisted in the URL, which means the next default POST would go through the named action from before.'
		},
		{
			breadcrumbs: ['Form actions', 'Anatomy of an action'],
			href: '/docs/form-actions#anatomy-of-an-action',
			content:
				"Each action receives a RequestEvent object, allowing you to read the data with request.formData(). After processing the request (for example, logging the user in by setting a cookie), the action can respond with data that will be available through the form property on the corresponding page and through $page.form app-wide until the next update.\n\n// @errors: 2304\n/// file: src/routes/login/+page.server.js\n/** @type {import('./$types').PageServerLoad} */\nexport async function load({ cookies }) {\n    const user = await db.getUserFromSession(cookies.get('sessionid'));\n    return { user };\n}\n\n/** @type {import('./$types').Actions} */\nexport const actions = {\n    login: async ({ cookies, request }) => {\n        const data = await request.formData();\n        const email = data.get('email');\n        const password = data.get('password');\n\n        const user = await db.getUser(email);\n        cookies.set('sessionid', await db.createSession(user));\n\n        return { success: true };\n    },\n    register: async (event) => {\n        // TODO register the user\n    }\n};/// file: src/routes/login/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n    /** @type {import('./$types').ActionData} */\n    export let form;\n</script>\n\n{#if form?.success}\n    <!-- this message is ephemeral; it exists because the page was rendered in\n           response to a form submission. it will vanish if the user reloads -->\n    <p>Successfully logged in! Welcome back, {data.user.name}</p>\n{/if}"
		},
		{
			breadcrumbs: ['Form actions', 'Anatomy of an action', 'Validation errors'],
			href: '/docs/form-actions#anatomy-of-an-action-validation-errors',
			content:
				'If the request couldn\'t be processed because of invalid data, you can return validation errors — along with the previously submitted form values — back to the user so that they can try again. The fail function lets you return an HTTP status code (typically 400 or 422, in the case of validation errors) along with the data. The status code is available through $page.status and the data through form:\n\n/// file: src/routes/login/+page.server.js\n+import { fail } from \'@sveltejs/kit\';\n\n/** @type {import(\'./$types\').Actions} */\nexport const actions = {\n    login: async ({ cookies, request }) => {\n        const data = await request.formData();\n        const email = data.get(\'email\');\n        const password = data.get(\'password\');\n\n+\t\tif (!email) {\n+\t\t\treturn fail(400, { email, missing: true });\n+\t\t}\n\n        const user = await db.getUser(email);\n\n+\t\tif (!user || user.password !== hash(password)) {\n+\t\t\treturn fail(400, { email, incorrect: true });\n+\t\t}\n\n        cookies.set(\'sessionid\', await db.createSession(user));\n\n        return { success: true };\n    },\n    register: async (event) => {\n        // TODO register the user\n    }\n};Note that as a precaution, we only return the email back to the page — not the password.\n\n\n/// file: src/routes/login/+page.svelte\n<form method="POST" action="?/login">\n+\t{#if form?.missing}<p class="error">The email field is required</p>{/if}\n+\t{#if form?.incorrect}<p class="error">Invalid credentials!</p>{/if}\n    <label>\n        Email\n-\t\t<input name="email" type="email">\n+\t\t<input name="email" type="email" value={form?.email ?? \'\'}>\n    </label>\n    <label>\n        Password\n        <input name="password" type="password">\n    </label>\n    <button>Log in</button>\n    <button formaction="?/register">Register</button>\n</form>The returned data must be serializable as JSON. Beyond that, the structure is entirely up to you. For example, if you had multiple forms on the page, you could distinguish which <form> the returned form data referred to with an id property or similar.'
		},
		{
			breadcrumbs: ['Form actions', 'Anatomy of an action', 'Redirects'],
			href: '/docs/form-actions#anatomy-of-an-action-redirects',
			content:
				"Redirects (and errors) work exactly the same as in load:\n\n/// file: src/routes/login/+page.server.js\n+import { fail, redirect } from '@sveltejs/kit';\n\n/** @type {import('./$types').Actions} */\nexport const actions = {\n+\tlogin: async ({ cookies, request, url }) => {\n        const data = await request.formData();\n        const email = data.get('email');\n        const password = data.get('password');\n\n        const user = await db.getUser(email);\n        if (!user) {\n            return fail(400, { email, missing: true });\n        }\n\n        if (user.password !== hash(password)) {\n            return fail(400, { email, incorrect: true });\n        }\n\n        cookies.set('sessionid', await db.createSession(user));\n\n+\t\tif (url.searchParams.has('redirectTo')) {\n+\t\t\tthrow redirect(303, url.searchParams.get('redirectTo'));\n+\t\t}\n\n        return { success: true };\n    },\n    register: async (event) => {\n        // TODO register the user\n    }\n};"
		},
		{
			breadcrumbs: ['Form actions', 'Loading data'],
			href: '/docs/form-actions#loading-data',
			content:
				"After an action runs, the page will be re-rendered (unless a redirect or an unexpected error occurs), with the action's return value available to the page as the form prop. This means that your page's load functions will run after the action completes.\n\nNote that handle runs before the action is invoked, and does not re-run before the load functions. This means that if, for example, you use handle to populate event.locals based on a cookie, you must update event.locals when you set or delete the cookie in an action:\n\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    event.locals.user = await getUser(event.cookies.get('sessionid'));\n    return resolve(event);\n}/** @type {import('./$types').PageServerLoad} */\nexport function load(event) {\n    return {\n        user: event.locals.user\n    };\n}\n\n/** @type {import('./$types').Actions} */\nexport const actions = {\n    logout: async (event) => {\n        event.cookies.delete('sessionid');\n        event.locals.user = null;\n    }\n};"
		},
		{
			breadcrumbs: ['Form actions', 'Progressive enhancement'],
			href: '/docs/form-actions#progressive-enhancement',
			content:
				"In the preceding sections we built a /login action that works without client-side JavaScript — not a fetch in sight. That's great, but when JavaScript is available we can progressively enhance our form interactions to provide a better user experience."
		},
		{
			breadcrumbs: ['Form actions', 'Progressive enhancement', 'use:enhance'],
			href: '/docs/form-actions#progressive-enhancement-use-enhance',
			content:
				"The easiest way to progressively enhance a form is to add the use:enhance action:\n\n/// file: src/routes/login/+page.svelte\n<script>\n+\timport { enhance } from '$app/forms';\n\n    /** @type {import('./$types').ActionData} */\n    export let form;\n</script>\n\n+<form method=\"POST\" use:enhance>Yes, it's a little confusing that the enhance action and <form action> are both called 'action'. These docs are action-packed. Sorry.\n\n\nWithout an argument, use:enhance will emulate the browser-native behaviour, just without the full-page reloads. It will:\n\nupdate the form property, $page.form and $page.status on a successful or invalid response, but only if the action is on the same page you're submitting from. So for example if your form looks like <form action=&quot;/somewhere/else&quot; ..>, form and $page will not be updated. This is because in the native form submission case you would be redirected to the page the action is on. If you want to have them updated either way, use applyAction\nreset the <form> element and invalidate all data using invalidateAll on a successful response\ncall goto on a redirect response\nrender the nearest +error boundary if an error occurs\nreset focus to the appropriate element\n\nTo customise the behaviour, you can provide a SubmitFunction that runs immediately before the form is submitted, and (optionally) returns a callback that runs with the ActionResult. Note that if you return a callback, the default behavior mentioned above is not triggered. To get it back, call update.\n\n<form\n    method=\"POST\"\n    use:enhance={({ form, data, action, cancel, submitter }) => {\n        // `form` is the `<form>` element\n        // `data` is its `FormData` object\n        // `action` is the URL to which the form is posted\n        // `cancel()` will prevent the submission\n        // `submitter` is the `HTMLElement` that caused the form to be submitted\n\n        return async ({ result, update }) => {\n            // `result` is an `ActionResult` object\n            // `update` is a function which triggers the logic that would be triggered if this callback wasn't set\n        };\n    }}\n>You can use these functions to show and hide loading UI, and so on."
		},
		{
			breadcrumbs: ['Form actions', 'Progressive enhancement', 'applyAction'],
			href: '/docs/form-actions#progressive-enhancement-applyaction',
			content:
				"If you provide your own callbacks, you may need to reproduce part of the default use:enhance behaviour, such as showing the nearest +error boundary. Most of the time, calling update passed to the callback is enough. If you need more customization you can do so with applyAction:\n\n/// file: src/routes/login/+page.svelte\n<script>\n+\timport { enhance, applyAction } from '$app/forms';\n\n    /** @type {import('./$types').ActionData} */\n    export let form;\n</script>\n\n<form\n    method=\"POST\"\n    use:enhance={({ form, data, action, cancel }) => {\n        // `form` is the `<form>` element\n        // `data` is its `FormData` object\n        // `action` is the URL to which the form is posted\n        // `cancel()` will prevent the submission\n\n        return async ({ result }) => {\n            // `result` is an `ActionResult` object\n+\t\t\tif (result.type === 'error') {\n+\t\t\t\tawait applyAction(result);\n+\t\t\t}\n        };\n    }}\n>The behaviour of applyAction(result) depends on result.type:\n\nsuccess, failure — sets $page.status to result.status and updates form and $page.form to result.data (regardless of where you are submitting from, in contrast to update from enhance)\nredirect — calls goto(result.location)\nerror — renders the nearest +error boundary with result.error\n\nIn all cases, focus will be reset."
		},
		{
			breadcrumbs: ['Form actions', 'Progressive enhancement', 'Custom event listener'],
			href: '/docs/form-actions#progressive-enhancement-custom-event-listener',
			content:
				"We can also implement progressive enhancement ourselves, without use:enhance, with a normal event listener on the <form>:\n\n/// file: src/routes/login/+page.svelte\n<script>\n    import { invalidateAll, goto } from '$app/navigation';\n    import { applyAction, deserialize } from '$app/forms';\n\n    /** @type {import('./$types').ActionData} */\n    export let form;\n\n    /** @type {any} */\n    let error;\n\n    async function handleSubmit(event) {\n        const data = new FormData(this);\n\n        const response = await fetch(this.action, {\n            method: 'POST',\n            body: data\n        });\n\n        /** @type {import('@sveltejs/kit').ActionResult} */\n        const result = deserialize(await response.text());\n\n        if (result.type === 'success') {\n            // re-run all `load` functions, following the successful update\n            await invalidateAll();\n        }\n\n        applyAction(result);\n    }\n</script>\n\n<form method=\"POST\" on:submit|preventDefault={handleSubmit}>\n    <!-- content -->\n</form>Note that you need to deserialize the response before processing it further using the corresponding method from $app/forms. JSON.parse() isn't enough because form actions - like load functions - also support returning Date or BigInt objects.\n\nIf you have a +server.js alongside your +page.server.js, fetch requests will be routed there by default. To POST to an action in +page.server.js instead, use the custom x-sveltekit-action header:\n\nconst response = await fetch(this.action, {\n    method: 'POST',\n    body: data,\n+\theaders: {\n+\t\t'x-sveltekit-action': 'true'\n+\t}\n});"
		},
		{
			breadcrumbs: ['Form actions', 'Alternatives'],
			href: '/docs/form-actions#alternatives',
			content:
				"Form actions are the preferred way to send data to the server, since they can be progressively enhanced, but you can also use +server.js files to expose (for example) a JSON API. Here's how such an interaction could look like:\n\n/// file: send-message/+page.svelte\n<script>\n    function rerun() {\n        fetch('/api/ci', {\n            method: 'POST'\n        });\n    }\n</script>\n\n<button on:click={rerun}>Rerun CI</button>// @errors: 2355 1360\n/// file: api/ci/+server.js\n\n/** @type {import('./$types').RequestHandler} */\nexport function POST() {\n    // do something\n}"
		},
		{
			breadcrumbs: ['Form actions', 'GET vs POST'],
			href: '/docs/form-actions#get-vs-post',
			content:
				'As we\'ve seen, to invoke a form action you must use method=&quot;POST&quot;.\n\nSome forms don\'t need to POST data to the server — search inputs, for example. For these you can use method=&quot;GET&quot; (or, equivalently, no method at all), and SvelteKit will treat them like <a> elements, using the client-side router instead of a full page navigation:\n\n<form action="/search">\n    <label>\n        Search\n        <input name="q">\n    </label>\n</form>Submitting this form will navigate to /search?q=... and invoke your load function but will not invoke an action. As with <a> elements, you can set the data-sveltekit-reload, data-sveltekit-replacestate, data-sveltekit-keepfocus and data-sveltekit-noscroll attributes on the <form> to control the router\'s behaviour.'
		},
		{
			breadcrumbs: ['Form actions', 'Further reading'],
			href: '/docs/form-actions#further-reading',
			content: 'Tutorial: Forms'
		},
		{
			breadcrumbs: ['Page options'],
			href: '/docs/page-options',
			content:
				'By default, SvelteKit will render (or prerender) any component first on the server and send it to the client as HTML. It will then render the component again in the browser to make it interactive in a process called hydration. For this reason, you need to ensure that components can run in both places. SvelteKit will then initialize a router that takes over subsequent navigations.\n\nYou can control each of these on a page-by-page basis by exporting options from +page.js or +page.server.js, or for groups of pages using a shared +layout.js or +layout.server.js. To define an option for the whole app, export it from the root layout. Child layouts and pages override values set in parent layouts, so — for example — you can enable prerendering for your entire app then disable it for pages that need to be dynamically rendered.\n\nYou can mix and match these options in different areas of your app. For example you could prerender your marketing page for maximum speed, server-render your dynamic pages for SEO and accessibility and turn your admin section into an SPA by rendering it on the client only. This makes SvelteKit very versatile.'
		},
		{
			breadcrumbs: ['Page options', 'prerender'],
			href: '/docs/page-options#prerender',
			content:
				"It's likely that at least some routes of your app can be represented as a simple HTML file generated at build time. These routes can be prerendered.\n\n/// file: +page.js/+page.server.js/+server.js\nexport const prerender = true;Alternatively, you can set export const prerender = true in your root +layout.js or +layout.server.js and prerender everything except pages that are explicitly marked as not prerenderable:\n\n/// file: +page.js/+page.server.js/+server.js\nexport const prerender = false;Routes with prerender = true will be excluded from manifests used for dynamic SSR, making your server (or serverless/edge functions) smaller. In some cases you might want to prerender a route but also include it in the manifest (for example, with a route like /blog/[slug] where you want to prerender your most recent/popular content but server-render the long tail) — for these cases, there's a third option, 'auto':\n\n/// file: +page.js/+page.server.js/+server.js\nexport const prerender = 'auto';If your entire app is suitable for prerendering, you can use adapter-static, which will output files suitable for use with any static webserver.\n\n\nThe prerenderer will start at the root of your app and generate files for any prerenderable pages or +server.js routes it finds. Each page is scanned for <a> elements that point to other pages that are candidates for prerendering — because of this, you generally don't need to specify which pages should be accessed. If you do need to specify which pages should be accessed by the prerenderer, you can do so with the entries option in the prerender configuration.\n\nWhile prerendering, the value of building imported from $app/environment will be true."
		},
		{
			breadcrumbs: ['Page options', 'prerender', 'Prerendering server routes'],
			href: '/docs/page-options#prerender-prerendering-server-routes',
			content:
				"Unlike the other page options, prerender also applies to +server.js files. These files are not affected from layouts, but will inherit default values from the pages that fetch data from them, if any. For example if a +page.js contains this load function...\n\n/// file: +page.js\nexport const prerender = true;\n\n/** @type {import('./$types').PageLoad} */\nexport async function load({ fetch }) {\n    const res = await fetch('/my-server-route.json');\n    return await res.json();\n}...then src/routes/my-server-route.json/+server.js will be treated as prerenderable if it doesn't contain its own export const prerender = false."
		},
		{
			breadcrumbs: ['Page options', 'prerender', 'When not to prerender'],
			href: '/docs/page-options#prerender-when-not-to-prerender',
			content:
				"The basic rule is this: for a page to be prerenderable, any two users hitting it directly must get the same content from the server.\n\nNot all pages are suitable for prerendering. Any content that is prerendered will be seen by all users. You can of course fetch personalized data in onMount in a prerendered page, but this may result in a poorer user experience since it will involve blank initial content or loading indicators.\n\n\nNote that you can still prerender pages that load data based on the page's parameters, such as a src/routes/blog/[slug]/+page.svelte route.\n\nAccessing url.searchParams during prerendering is forbidden. If you need to use it, ensure you are only doing so in the browser (for example in onMount).\n\nPages with actions cannot be prerendered, because a server must be able to handle the action POST requests."
		},
		{
			breadcrumbs: ['Page options', 'prerender', 'Prerender and ssr'],
			href: '/docs/page-options#prerender-prerender-and-ssr',
			content:
				'If you set the ssr option to false, each request will result in the same empty HTML shell. Since this would result in unnecessary work, SvelteKit defaults to prerendering any pages it finds where prerender is not explicitly set to false.'
		},
		{
			breadcrumbs: ['Page options', 'prerender', 'Route conflicts'],
			href: '/docs/page-options#prerender-route-conflicts',
			content:
				"Because prerendering writes to the filesystem, it isn't possible to have two endpoints that would cause a directory and a file to have the same name. For example, src/routes/foo/+server.js and src/routes/foo/bar/+server.js would try to create foo and foo/bar, which is impossible.\n\nFor that reason among others, it's recommended that you always include a file extension — src/routes/foo.json/+server.js and src/routes/foo/bar.json/+server.js would result in foo.json and foo/bar.json files living harmoniously side-by-side.\n\nFor pages, we skirt around this problem by writing foo/index.html instead of foo."
		},
		{
			breadcrumbs: ['Page options', 'prerender', 'Troubleshooting'],
			href: '/docs/page-options#prerender-troubleshooting',
			content:
				"If you encounter an error like 'The following routes were marked as prerenderable, but were not prerendered' it's because the route in question (or a parent layout, if it's a page) has export const prerender = true but the page wasn't actually prerendered, because it wasn't reached by the prerendering crawler.\n\nSince these routes cannot be dynamically server-rendered, this will cause errors when people try to access the route in question. There are two ways to fix it:\n\nEnsure that SvelteKit can find the route by following links from config.kit.prerender.entries. Add links to dynamic routes (i.e. pages with [parameters] ) to this option if they are not found through crawling the other entry points, else they are not prerendered because SvelteKit doesn't know what value the parameters should have. Pages not marked as prerenderable will be ignored and their links to other pages will not be crawled, even if some of them would be prerenderable.\nChange export const prerender = true to export const prerender = 'auto'. Routes with 'auto' can be dynamically server rendered"
		},
		{
			breadcrumbs: ['Page options', 'ssr'],
			href: '/docs/page-options#ssr',
			content:
				"Normally, SvelteKit renders your page on the server first and sends that HTML to the client where it's hydrated. If you set ssr to false, it renders an empty 'shell' page instead. This is useful if your page is unable to be rendered on the server (because you use browser-only globals like document for example), but in most situations it's not recommended (see appendix).\n\n/// file: +page.js\nexport const ssr = false;If you add export const ssr = false to your root +layout.js, your entire app will only be rendered on the client — which essentially means you turn your app into an SPA."
		},
		{
			breadcrumbs: ['Page options', 'csr'],
			href: '/docs/page-options#csr',
			content:
				"Ordinarily, SvelteKit hydrates your server-rendered HTML into an interactive client-side-rendered (CSR) page. Some pages don't require JavaScript at all — many blog posts and 'about' pages fall into this category. In these cases you can disable CSR:\n\n/// file: +page.js\nexport const csr = false;If both ssr and csr are false, nothing will be rendered!"
		},
		{
			breadcrumbs: ['Page options', 'trailingSlash'],
			href: '/docs/page-options#trailingslash',
			content:
				"By default, SvelteKit will remove trailing slashes from URLs — if you visit /about/, it will respond with a redirect to /about. You can change this behaviour with the trailingSlash option, which can be one of 'never' (the default), 'always', or 'ignore'.\n\nAs with other page options, you can export this value from a +layout.js or a +layout.server.js and it will apply to all child pages. You can also export the configuration from +server.js files.\n\n/// file: src/routes/+layout.js\nexport const trailingSlash = 'always';This option also affects prerendering. If trailingSlash is always, a route like /about will result in an about/index.html file, otherwise it will create about.html, mirroring static webserver conventions.\n\nIgnoring trailing slashes is not recommended — the semantics of relative paths differ between the two cases (./y from /x is /y, but from /x/ is /x/y), and /x and /x/ are treated as separate URLs which is harmful to SEO."
		},
		{
			breadcrumbs: ['Page options', 'config'],
			href: '/docs/page-options#config',
			content:
				"With the concept of adapters, SvelteKit is able to run on a variety of platforms. Each of these might have specific configuration to further tweak the deployment — for example on Vercel you could choose to deploy some parts of your app on the edge and others on serverless environments.\n\nconfig is an object with key-value pairs at the top level. Beyond that, the concrete shape is dependent on the adapter you're using. Every adapter should provide a Config interface to import for type safety. Consult the documentation of your adapter for more information.\n\n/// file: src/routes/+page.js\n/** @type {import('some-adapter').Config} */\nexport const config = {\n    runtime: 'edge'\n};config objects are merged at the top level (but not deeper levels). This means you don't need to repeat all the values in a +page.js if you want to only override some of the values in the upper +layout.js. For example this layout configuration...\n\n/// file: src/routes/+layout.js\nexport const config = {\n    runtime: 'edge',\n    regions: 'all',\n    foo: {\n        bar: true\n    }\n}...is overridden by this page configuration...\n\n/// file: src/routes/+page.js\nexport const config = {\n    regions: ['us1', 'us2'],\n    foo: {\n        baz: true\n    }\n}...which results in the config value { runtime: 'edge', regions: ['us1', 'us2'], foo: { baz: true } } for that page."
		},
		{
			breadcrumbs: ['Page options', 'Further reading'],
			href: '/docs/page-options#further-reading',
			content: 'Tutorial: Page options'
		},
		{
			breadcrumbs: ['State management'],
			href: '/docs/state-management',
			content:
				"If you're used to building client-only apps, state management in an app that spans server and client might seem intimidating. This section provides tips for avoiding some common gotchas."
		},
		{
			breadcrumbs: ['State management', 'Avoid shared state on the server'],
			href: '/docs/state-management#avoid-shared-state-on-the-server',
			content:
				"Browsers are stateful — state is stored in memory as the user interacts with the application. Servers, on the other hand, are stateless — the content of the response is determined entirely by the content of the request.\n\nConceptually, that is. In reality, servers are often long-lived and shared by multiple users. For that reason it's important not to store data in shared variables. For example, consider this code:\n\n// @errors: 7034 7005\n/// file: +page.server.js\nlet user;\n\n/** @type {import('./$types').PageServerLoad} */\nexport function load() {\n    return { user };\n}\n\n/** @type {import('./$types').Actions} */\nexport const actions = {\n    default: async ({ request }) => {\n        const data = await request.formData();\n\n        // NEVER DO THIS!\n        user = {\n            name: data.get('name'),\n            embarrassingSecret: data.get('secret')\n        };\n    }\n}The user variable is shared by everyone who connects to this server. If Alice submitted an embarrassing secret, and Bob visited the page after her, Bob would know Alice's secret. In addition, when Alice returns to the site later in the day, the server may have restarted, losing her data.\n\nInstead, you should authenticate the user using cookies and persist the data to a database."
		},
		{
			breadcrumbs: ['State management', 'No side-effects in load'],
			href: '/docs/state-management#no-side-effects-in-load',
			content:
				"For the same reason, your load functions should be pure — no side-effects (except maybe the occasional console.log(...)). For example, you might be tempted to write to a store inside a load function so that you can use the store value in your components:\n\nimport { user } from '$lib/user';\n\n/** @type {import('./$types').PageLoad} */\nexport async function load({ fetch }) {\n    const response = await fetch('/api/user');\n\n    // NEVER DO THIS!\n    user.set(await response.json());\n}As with the previous example, this puts one user's information in a place that is shared by all users. Instead, just return the data...\n\n/// file: +page.js\nexport async function load({ fetch }) {\n    const response = await fetch('/api/user');\n\n+\treturn {\n+\t\tuser: await response.json()\n+\t};\n}...and pass it around to the components that need it, or use $page.data.\n\nIf you're not using SSR, then there's no risk of accidentally exposing one user's data to another. But you should still avoid side-effects in your load functions — your application will be much easier to reason about without them."
		},
		{
			breadcrumbs: ['State management', 'Using stores with context'],
			href: '/docs/state-management#using-stores-with-context',
			content:
				"You might wonder how we're able to use $page.data and other app stores if we can't use our own stores. The answer is that app stores on the server use Svelte's context API — the store is attached to the component tree with setContext, and when you subscribe you retrieve it with getContext. We can do the same thing with our own stores:\n\n/// file: src/routes/+layout.svelte\n<script>\n    import { setContext } from 'svelte';\n    import { writable } from 'svelte/store';\n\n    /** @type {import('./$types').LayoutData} */\n    export let data;\n\n    // Create a store and update it when necessary...\n    const user = writable();\n    $: user.set(data.user);\n\n    // ...and add it to the context for child components to access\n    setContext('user', user);\n</script>/// file: src/routes/user/+page.svelte\n<script>\n    import { getContext } from 'svelte';\n\n    // Retrieve user store from context\n    const user = getContext('user');\n</script>\n\n<p>Welcome {$user.name}</p>If you're not using SSR (and can guarantee that you won't need to use SSR in future) then you can safely keep state in a shared module, without using the context API."
		},
		{
			breadcrumbs: ['State management', 'Component state is preserved'],
			href: '/docs/state-management#component-state-is-preserved',
			content:
				"When you navigate around your application, SvelteKit reuses existing layout and page components. For example, if you have a route like this...\n\n/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n    // THIS CODE IS BUGGY!\n    const wordCount = data.content.split(' ').length;\n    const estimatedReadingTime = wordCount / 250;\n</script>\n\n<header>\n    <h1>{data.title}</h1>\n    <p>Reading time: {Math.round(estimatedReadingTime)} minutes</p>\n</header>\n\n<div>{@html data.content}</div>...then navigating from /blog/my-short-post to /blog/my-long-post won't cause the component to be destroyed and recreated. The data prop (and by extension data.title and data.content) will change, but because the code isn't re-running, estimatedReadingTime won't be recalculated.\n\nInstead, we need to make the value reactive:\n\n/// file: src/routes/blog/[slug]/+page.svelte\n<script>\n    /** @type {import('./$types').PageData} */\n    export let data;\n\n+\t$: wordCount = data.content.split(' ').length;\n+\t$: estimatedReadingTime = wordCount / 250;\n</script>Reusing components like this means that things like sidebar scroll state are preserved, and you can easily animate between changing values. However, if you do need to completely destroy and remount a component on navigation, you can use this pattern:\n\n{#key $page.url.pathname}\n    <BlogPost title={data.title} content={data.title} />\n{/key}"
		},
		{
			breadcrumbs: ['State management', 'Storing state in the URL'],
			href: '/docs/state-management#storing-state-in-the-url',
			content:
				"If you have state that should survive a reload and/or affect SSR, such as filters or sorting rules on a table, URL search parameters (like ?sort=price&amp;order=ascending) are a good place to put them. You can put them in <a href=&quot;...&quot;> or <form action=&quot;...&quot;> attributes, or set them programmatically via goto('?key=value'). They can be accessed inside load functions via the url parameter, and inside components via $page.url.searchParams."
		},
		{
			breadcrumbs: ['State management', 'Storing ephemeral state in snapshots'],
			href: '/docs/state-management#storing-ephemeral-state-in-snapshots',
			content:
				"Some UI state, such as 'is the accordion open?', is disposable — if the user navigates away or refreshes the page, it doesn't matter if the state is lost. In some cases, you do want the data to persist if the user navigates to a different page and comes back, but storing the state in the URL or in a database would be overkill. For this, SvelteKit provides snapshots, which let you associate component state with a history entry."
		},
		{
			breadcrumbs: ['Building your app'],
			href: '/docs/building-your-app',
			content:
				'Building a SvelteKit app happens in two stages, which both happen when you run vite build (usually via npm run build).\n\nFirstly, Vite creates an optimized production build of your server code, your browser code, and your service worker (if you have one). Prerendering is executed at this stage, if appropriate.\n\nSecondly, an adapter takes this production build and tunes it for your target environment — more on this on the following pages.'
		},
		{
			breadcrumbs: ['Building your app', 'During the build'],
			href: '/docs/building-your-app#during-the-build',
			content:
				"SvelteKit will load your +page/layout(.server).js files (and all files they import) for analysis during the build. Any code that should not be executed at this stage must check that building from $app/environment is false:\n\n+import { building } from '$app/environment';\nimport { setupMyDatabase } from '$lib/server/database';\n\n+if (!building) {\n    setupMyDatabase();\n+}\n\nexport function load() {\n    // ...\n}"
		},
		{
			breadcrumbs: ['Building your app', 'Preview your app'],
			href: '/docs/building-your-app#preview-your-app',
			content:
				'After building, you can view your production build locally with vite preview (via npm run preview). Note that this will run the app in Node, and so is not a perfect reproduction of your deployed app — adapter-specific adjustments like the platform object do not apply to previews.'
		},
		{
			breadcrumbs: ['Adapters'],
			href: '/docs/adapters',
			content:
				'Before you can deploy your SvelteKit app, you need to adapt it for your deployment target. Adapters are small plugins that take the built app as input and generate output for deployment.\n\nOfficial adapters exist for a variety of platforms — these are documented on the following pages:\n\n@sveltejs/adapter-cloudflare for Cloudflare Pages\n@sveltejs/adapter-cloudflare-workers for Cloudflare Workers\n@sveltejs/adapter-netlify for Netlify\n@sveltejs/adapter-node for Node servers\n@sveltejs/adapter-static for static site generation (SSG)\n@sveltejs/adapter-vercel for Vercel\n\nAdditional community-provided adapters exist for other platforms.'
		},
		{
			breadcrumbs: ['Adapters', 'Using adapters'],
			href: '/docs/adapters#using-adapters',
			content:
				"Your adapter is specified in svelte.config.js:\n\nimport adapter from 'svelte-adapter-foo';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        adapter: adapter({\n            // adapter options go here\n        })\n    }\n};\n\nexport default config;"
		},
		{
			breadcrumbs: ['Adapters', 'Platform-specific context'],
			href: '/docs/adapters#platform-specific-context',
			content:
				"Some adapters may have access to additional information about the request. For example, Cloudflare Workers can access an env object containing KV namespaces etc. This can be passed to the RequestEvent used in hooks and server routes as the platform property — consult each adapter's documentation to learn more."
		},
		{
			breadcrumbs: ['Zero-config deployments'],
			href: '/docs/adapter-auto',
			content:
				"When you create a new SvelteKit project with npm create svelte@latest, it installs adapter-auto by default. This adapter automatically installs and uses the correct adapter for supported environments when you deploy:\n\n@sveltejs/adapter-cloudflare for Cloudflare Pages\n@sveltejs/adapter-netlify for Netlify\n@sveltejs/adapter-vercel for Vercel\nsvelte-adapter-azure-swa for Azure Static Web Apps\n\nIt's recommended to install the appropriate adapter to your devDependencies once you've settled on a target environment, since this will add the adapter to your lockfile and slightly improve install times on CI."
		},
		{
			breadcrumbs: ['Zero-config deployments', 'Environment-specific configuration'],
			href: '/docs/adapter-auto#environment-specific-configuration',
			content:
				'To add configuration options, such as { edge: true } in adapter-vercel and adapter-netlify, you must install the underlying adapter — adapter-auto does not take any options.'
		},
		{
			breadcrumbs: ['Zero-config deployments', 'Adding community adapters'],
			href: '/docs/adapter-auto#adding-community-adapters',
			content:
				'You can add zero-config support for additional adapters by editing adapters.js and opening a pull request.'
		},
		{
			breadcrumbs: ['Node servers'],
			href: '/docs/adapter-node',
			content: 'To generate a standalone Node server, use adapter-node.'
		},
		{
			breadcrumbs: ['Node servers', 'Usage'],
			href: '/docs/adapter-node#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-node, then add the adapter to your svelte.config.js:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-node';\n\nexport default {\n    kit: {\n        adapter: adapter()\n    }\n};"
		},
		{
			breadcrumbs: ['Node servers', 'Deploying'],
			href: '/docs/adapter-node#deploying',
			content:
				"First, build your app with npm run build. This will create the production server in the output directory specified in the adapter options, defaulting to build.\n\nYou will need the output directory, the project's package.json, and the production dependencies in node_modules to run the application. Production dependencies can be generated by copying the package.json and package-lock.json and then running npm ci --omit dev (you can skip this step if your app doesn't have any dependencies). You can then start your app with this command:\n\nnode buildDevelopment dependencies will be bundled into your app using Rollup. To control whether a given package is bundled or externalised, place it in devDependencies or dependencies respectively in your package.json."
		},
		{
			breadcrumbs: ['Node servers', 'Environment variables'],
			href: '/docs/adapter-node#environment-variables',
			content:
				'In dev and preview, SvelteKit will read environment variables from your .env file (or .env.local, or .env.[mode], as determined by Vite.)\n\nIn production, .env files are not automatically loaded. To do so, install dotenv in your project...\n\nnpm install dotenv...and invoke it before running the built app:\n\n-node build\n+node -r dotenv/config build'
		},
		{
			breadcrumbs: ['Node servers', 'Environment variables', '`PORT` and `HOST`'],
			href: '/docs/adapter-node#environment-variables-port-and-host',
			content:
				'By default, the server will accept connections on 0.0.0.0 using port 3000. These can be customised with the PORT and HOST environment variables:\n\nHOST=127.0.0.1 PORT=4000 node build'
		},
		{
			breadcrumbs: [
				'Node servers',
				'Environment variables',
				'`ORIGIN`, `PROTOCOL_HEADER` and `HOST_HEADER`'
			],
			href: '/docs/adapter-node#environment-variables-origin-protocol-header-and-host-header',
			content:
				"HTTP doesn't give SvelteKit a reliable way to know the URL that is currently being requested. The simplest way to tell SvelteKit where the app is being served is to set the ORIGIN environment variable:\n\nORIGIN=https://my.site node build\n\n# or e.g. for local previewing and testing\nORIGIN=http://localhost:3000 node buildWith this, a request for the /stuff pathname will correctly resolve to https://my.site/stuff. Alternatively, you can specify headers that tell SvelteKit about the request protocol and host, from which it can construct the origin URL:\n\nPROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node buildx-forwarded-proto and x-forwarded-host are de facto standard headers that forward the original protocol and host if you're using a reverse proxy (think load balancers and CDNs). You should only set these variables if your server is behind a trusted reverse proxy; otherwise, it'd be possible for clients to spoof these headers.\n\n\nIf adapter-node can't correctly determine the URL of your deployment, you may experience this error when using form actions:\n\nCross-site POST form submissions are forbidden"
		},
		{
			breadcrumbs: ['Node servers', 'Environment variables', '`ADDRESS_HEADER` and `XFF_DEPTH`'],
			href: '/docs/adapter-node#environment-variables-address-header-and-xff-depth',
			content:
				"The RequestEvent object passed to hooks and endpoints includes an event.getClientAddress() function that returns the client's IP address. By default this is the connecting remoteAddress. If your server is behind one or more proxies (such as a load balancer), this value will contain the innermost proxy's IP address rather than the client's, so we need to specify an ADDRESS_HEADER to read the address from:\n\nADDRESS_HEADER=True-Client-IP node buildHeaders can easily be spoofed. As with PROTOCOL_HEADER and HOST_HEADER, you should know what you're doing before setting these.\n\n\nIf the ADDRESS_HEADER is X-Forwarded-For, the header value will contain a comma-separated list of IP addresses. The XFF_DEPTH environment variable should specify how many trusted proxies sit in front of your server. E.g. if there are three trusted proxies, proxy 3 will forward the addresses of the original connection and the first two proxies:\n\n<client address>, <proxy 1 address>, <proxy 2 address>Some guides will tell you to read the left-most address, but this leaves you vulnerable to spoofing:\n\n<spoofed address>, <client address>, <proxy 1 address>, <proxy 2 address>We instead read from the right, accounting for the number of trusted proxies. In this case, we would use XFF_DEPTH=3.\n\nIf you need to read the left-most address instead (and don't care about spoofing) — for example, to offer a geolocation service, where it's more important for the IP address to be real than trusted, you can do so by inspecting the x-forwarded-for header within your app."
		},
		{
			breadcrumbs: ['Node servers', 'Environment variables', '`BODY_SIZE_LIMIT`'],
			href: '/docs/adapter-node#environment-variables-body-size-limit',
			content:
				'The maximum request body size to accept in bytes including while streaming. Defaults to 512kb. You can disable this option with a value of 0 and implement a custom check in handle if you need something more advanced.'
		},
		{
			breadcrumbs: ['Node servers', 'Options'],
			href: '/docs/adapter-node#options',
			content:
				"The adapter can be configured with various options:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-node';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            // default options are shown\n            out: 'build',\n            precompress: false,\n            envPrefix: '',\n            polyfill: true\n        })\n    }\n};"
		},
		{
			breadcrumbs: ['Node servers', 'Options', 'out'],
			href: '/docs/adapter-node#options-out',
			content:
				'The directory to build the server to. It defaults to build — i.e. node build would start the server locally after it has been created.'
		},
		{
			breadcrumbs: ['Node servers', 'Options', 'precompress'],
			href: '/docs/adapter-node#options-precompress',
			content:
				'Enables precompressing using gzip and brotli for assets and prerendered pages. It defaults to false.'
		},
		{
			breadcrumbs: ['Node servers', 'Options', 'envPrefix'],
			href: '/docs/adapter-node#options-envprefix',
			content:
				"If you need to change the name of the environment variables used to configure the deployment (for example, to deconflict with environment variables you don't control), you can specify a prefix:\n\nenvPrefix: 'MY_CUSTOM_';MY_CUSTOM_HOST=127.0.0.1 \\\nMY_CUSTOM_PORT=4000 \\\nMY_CUSTOM_ORIGIN=https://my.site \\\nnode build"
		},
		{
			breadcrumbs: ['Node servers', 'Options', 'polyfill'],
			href: '/docs/adapter-node#options-polyfill',
			content:
				'Controls whether your build will load polyfills for missing modules. It defaults to true, and should only be disabled when using Node 18.11 or greater.'
		},
		{
			breadcrumbs: ['Node servers', 'Custom server'],
			href: '/docs/adapter-node#custom-server',
			content:
				"The adapter creates two files in your build directory — index.js and handler.js. Running index.js — e.g. node build, if you use the default build directory — will start a server on the configured port.\n\nAlternatively, you can import the handler.js file, which exports a handler suitable for use with Express, Connect or Polka (or even just the built-in http.createServer) and set up your own server:\n\n// @errors: 2307 7006\n/// file: my-server.js\nimport { handler } from './build/handler.js';\nimport express from 'express';\n\nconst app = express();\n\n// add a route that lives separately from the SvelteKit app\napp.get('/healthcheck', (req, res) => {\n    res.end('ok');\n});\n\n// let SvelteKit handle everything else, including serving prerendered pages and static assets\napp.use(handler);\n\napp.listen(3000, () => {\n    console.log('listening on port 3000');\n});"
		},
		{
			breadcrumbs: ['Node servers', 'Troubleshooting'],
			href: '/docs/adapter-node#troubleshooting',
			content: ''
		},
		{
			breadcrumbs: [
				'Node servers',
				'Troubleshooting',
				'Is there a hook for cleaning up before the server exits?'
			],
			href: '/docs/adapter-node#troubleshooting-is-there-a-hook-for-cleaning-up-before-the-server-exits',
			content:
				"There's nothing built-in to SvelteKit for this, because such a cleanup hook depends highly on the execution environment you're on. For Node, you can use its built-in process.on(..) to implement a callback that runs before the server exits:\n\n// @errors: 2304 2580\nfunction shutdownGracefully() {\n    // anything you need to clean up manually goes in here\n    db.shutdown();\n}\n\nprocess.on('SIGINT', shutdownGracefully);\nprocess.on('SIGTERM', shutdownGracefully);"
		},
		{
			breadcrumbs: ['Static site generation'],
			href: '/docs/adapter-static',
			content:
				"To use SvelteKit as a static site generator (SSG), use adapter-static.\n\nThis will prerender your entire site as a collection of static files. If you'd like to prerender only some pages and dynamically server-render others, you will need to use a different adapter together with the prerender option."
		},
		{
			breadcrumbs: ['Static site generation', 'Usage'],
			href: '/docs/adapter-static#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-static, then add the adapter to your svelte.config.js:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-static';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            // default options are shown. On some platforms\n            // these options are set automatically — see below\n            pages: 'build',\n            assets: 'build',\n            fallback: null,\n            precompress: false,\n            strict: true\n        })\n    }\n};...and add the prerender option to your root layout:\n\n/// file: src/routes/+layout.js\n// This can be false if you're using a fallback (i.e. SPA mode)\nexport const prerender = true;You must ensure SvelteKit's trailingSlash option is set appropriately for your environment. If your host does not render /a.html upon receiving a request for /a then you will need to set trailingSlash: 'always' to create /a/index.html instead."
		},
		{
			breadcrumbs: ['Static site generation', 'Zero-config support'],
			href: '/docs/adapter-static#zero-config-support',
			content:
				'Some platforms have zero-config support (more to come in future):\n\nVercel\n\nOn these platforms, you should omit the adapter options so that adapter-static can provide the optimal configuration:\n\n/// file: svelte.config.js\nexport default {\n    kit: {\n-\t\tadapter: adapter({...})\n+\t\tadapter: adapter()\n    }\n};'
		},
		{
			breadcrumbs: ['Static site generation', 'Options'],
			href: '/docs/adapter-static#options',
			content: ''
		},
		{
			breadcrumbs: ['Static site generation', 'Options', 'pages'],
			href: '/docs/adapter-static#options-pages',
			content: 'The directory to write prerendered pages to. It defaults to build.'
		},
		{
			breadcrumbs: ['Static site generation', 'Options', 'assets'],
			href: '/docs/adapter-static#options-assets',
			content:
				'The directory to write static assets (the contents of static, plus client-side JS and CSS generated by SvelteKit) to. Ordinarily this should be the same as pages, and it will default to whatever the value of pages is, but in rare circumstances you might need to output pages and assets to separate locations.'
		},
		{
			breadcrumbs: ['Static site generation', 'Options', 'fallback'],
			href: '/docs/adapter-static#options-fallback',
			content: 'Specify a fallback page for SPA mode, e.g. index.html or 200.html or 404.html.'
		},
		{
			breadcrumbs: ['Static site generation', 'Options', 'precompress'],
			href: '/docs/adapter-static#options-precompress',
			content:
				'If true, precompresses files with brotli and gzip. This will generate .br and .gz files.'
		},
		{
			breadcrumbs: ['Static site generation', 'Options', 'strict'],
			href: '/docs/adapter-static#options-strict',
			content:
				'By default, adapter-static checks that either all pages and endpoints (if any) of your app were prerendered, or you have the fallback option set. This check exists to prevent you from accidentally publishing an app where some parts of it are not accessible, because they are not contained in the final output. If you know this is ok (for example when a certain page only exists conditionally), you can set strict to false to turn off this check.'
		},
		{
			breadcrumbs: ['Static site generation', 'GitHub Pages'],
			href: '/docs/adapter-static#github-pages',
			content:
				"When building for GitHub Pages, make sure to update paths.base to match your repo name, since the site will be served from https://your-username.github.io/your-repo-name rather than from the root.\n\nYou will have to prevent GitHub's provided Jekyll from managing your site by putting an empty .nojekyll file in your static folder.\n\nA config for GitHub Pages might look like the following:\n\n// @errors: 2307 2322\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-static';\n\nconst dev = process.argv.includes('dev');\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        adapter: adapter(),\n        paths: {\n            base: dev ? '' : process.env.BASE_PATH,\n        }\n    }\n};You can use GitHub actions to automatically deploy your site to GitHub Pages when you make a change. Here's an example workflow:\n\n/// file: .github/workflows/deploy.yml\nname: Deploy to GitHub Pages\n\non:\n  push:\n    branches: 'main'\n\njobs:\n  build_site:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v3\n\n      # If you're using pnpm, add this step then change the commands and cache key below to use `pnpm`\n      # - name: Install pnpm\n      #   uses: pnpm/action-setup@v2\n      #   with:\n      #     version: 8\n\n      - name: Install Node.js\n        uses: actions/setup-node@v3\n        with:\n          node-version: 18\n          cache: npm\n\n      - name: Install dependencies\n        run: npm install\n\n      - name: build\n        env:\n          BASE_PATH: '/your-repo-name'\n        run: |\n          npm run build\n          touch build/.nojekyll\n\n      - name: Upload Artifacts\n        uses: actions/upload-pages-artifact@v1\n        with:\n          # this should match the `pages` option in your adapter-static options\n          path: 'build/'\n\n  deploy:\n    needs: build_site\n    runs-on: ubuntu-latest\n\n    permissions:\n      pages: write\n      id-token: write\n\n    environment:\n      name: github-pages\n      url: ${{ steps.deployment.outputs.page_url }}\n    \n    steps:\n      - name: Deploy\n        id: deployment\n        uses: actions/deploy-pages@v1"
		},
		{
			breadcrumbs: ['Single-page apps'],
			href: '/docs/single-page-apps',
			content:
				"You can turn any SvelteKit app, using any adapter, into a fully client-rendered single-page app (SPA) by disabling SSR at the root layout:\n\n/// file: src/routes/+layout.js\nexport const ssr = false;In most situations this is not recommended: it harms SEO, tends to slow down perceived performance, and makes your app inaccessible to users if JavaScript fails or is disabled (which happens more often than you probably think).\n\n\nIf you don't have any server-side logic (i.e. +page.server.js, +layout.server.js or +server.js files) you can use adapter-static to create your SPA by adding a fallback page."
		},
		{
			breadcrumbs: ['Single-page apps', 'Usage'],
			href: '/docs/single-page-apps#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-static, then add the adapter to your svelte.config.js with the following options:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-static';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            fallback: '200.html' // may differ from host to host\n        })\n    }\n};The fallback page is an HTML page created by SvelteKit from your page template (e.g. app.html) that loads your app and navigates to the correct route. For example Surge, a static web host, lets you add a 200.html file that will handle any requests that don't correspond to static assets or prerendered pages.\n\nOn some hosts it may be index.html or something else entirely — consult your platform's documentation."
		},
		{
			breadcrumbs: ['Single-page apps', 'Apache'],
			href: '/docs/single-page-apps#apache',
			content:
				'To run an SPA on Apache, you should add a static/.htaccess file to route requests to the fallback page:\n\n<IfModule mod_rewrite.c>\n    RewriteEngine On\n    RewriteBase /\n    RewriteRule ^200\\.html$ - [L]\n    RewriteCond %{REQUEST_FILENAME} !-f\n    RewriteCond %{REQUEST_FILENAME} !-d\n    RewriteRule . /200.html [L]\n</IfModule>'
		},
		{
			breadcrumbs: ['Single-page apps', 'Prerendering individual pages'],
			href: '/docs/single-page-apps#prerendering-individual-pages',
			content:
				'If you want certain pages to be prerendered, you can re-enable ssr alongside prerender for just those parts of your app:\n\n/// file: src/routes/my-prerendered-page/+page.js\nexport const prerender = true;\nexport const ssr = true;'
		},
		{
			breadcrumbs: ['Cloudflare Pages'],
			href: '/docs/adapter-cloudflare',
			content:
				'To deploy to Cloudflare Pages, use adapter-cloudflare.\n\nThis adapter will be installed by default when you use adapter-auto, but adding it to your project is recommended so that event.platform is automatically typed.'
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Comparisons'],
			href: '/docs/adapter-cloudflare#comparisons',
			content:
				"adapter-cloudflare – supports all SvelteKit features; builds for Cloudflare Pages\nadapter-cloudflare-workers – supports all SvelteKit features; builds for Cloudflare Workers\nadapter-static – only produces client-side static assets; compatible with Cloudflare Pages\n\nUnless you have a specific reason to use adapter-cloudflare-workers, it's recommended that you use this adapter instead. Both adapters have equivalent functionality, but Cloudflare Pages offers features like GitHub integration with automatic builds and deploys, preview deployments, instant rollback and so on."
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Usage'],
			href: '/docs/adapter-cloudflare#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-cloudflare, then add the adapter to your svelte.config.js:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-cloudflare';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            // See below for an explanation of these options\n            routes: {\n                include: ['/*'],\n                exclude: ['<all>']\n            }\n        })\n    }\n};"
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Options'],
			href: '/docs/adapter-cloudflare#options',
			content:
				"The routes option allows you to customise the _routes.json file generated by adapter-cloudflare.\n\ninclude defines routes that will invoke a function, and defaults to ['/*']\nexclude defines routes that will not invoke a function — this is a faster and cheaper way to serve your app's static assets. This array can include the following special values:<build> contains your app's build artifacts (the files generated by Vite)\n<files> contains the contents of your static directory\n<prerendered> contains a list of prerendered pages\n<all> (the default) contains all of the above\n\n\n\nYou can have up to 100 include and exclude rules combined. Generally you can omit the routes options, but if (for example) your <prerendered> paths exceed that limit, you may find it helpful to manually create an exclude list that includes '/articles/*' instead of the auto-generated ['/articles/foo', '/articles/bar', '/articles/baz', ...]."
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Deployment'],
			href: '/docs/adapter-cloudflare#deployment',
			content:
				'Please follow the Get Started Guide for Cloudflare Pages to begin.\n\nWhen configuring your project settings, you must use the following settings:\n\nFramework preset – None\nBuild command – npm run build or vite build\nBuild output directory – .svelte-kit/cloudflare\nEnvironment variablesNODE_VERSION: 16\n\n\n\nYou need to add a NODE_VERSION environment variable to both the &quot;production&quot; and &quot;preview&quot; environments. You can add this during project setup or later in the Pages project settings. SvelteKit requires Node 16.14 or later, so you should use 16 as the NODE_VERSION value.'
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Environment variables'],
			href: '/docs/adapter-cloudflare#environment-variables',
			content:
				"The env object, containing KV/DO namespaces etc, is passed to SvelteKit via the platform property along with context and caches, meaning you can access it in hooks and endpoints:\n\n// @errors: 7031\nexport async function POST({ request, platform }) {\n    const x = platform.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');\n}To make these types available to your app, reference them in your src/app.d.ts:\n\n/// file: src/app.d.ts\ndeclare global {\n    namespace App {\n        interface Platform {\n+\t\t\tenv?: {\n+\t\t\t\tYOUR_KV_NAMESPACE: KVNamespace;\n+\t\t\t\tYOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;\n+\t\t\t};\n        }\n    }\n}\n\nexport {};platform.env is only available in the production build. Use wrangler to test it locally"
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Notes'],
			href: '/docs/adapter-cloudflare#notes',
			content:
				"Functions contained in the /functions directory at the project's root will not be included in the deployment, which is compiled to a single _worker.js file. Functions should be implemented as server endpoints in your SvelteKit app.\n\nThe _headers and _redirects files specific to Cloudflare Pages can be used for static asset responses (like images) by putting them into the /static folder.\n\nHowever, they will have no effect on responses dynamically rendered by SvelteKit, which should return custom headers or redirect responses from server endpoints or with the handle hook."
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Troubleshooting'],
			href: '/docs/adapter-cloudflare#troubleshooting',
			content: ''
		},
		{
			breadcrumbs: ['Cloudflare Pages', 'Troubleshooting', 'Accessing the file system'],
			href: '/docs/adapter-cloudflare#troubleshooting-accessing-the-file-system',
			content:
				"You can't access the file system through methods like fs.readFileSync in Serverless/Edge environments. If you need to access files that way, do that during building the app through prerendering. If you have a blog for example and don't want to manage your content through a CMS, then you need to prerender the content (or prerender the endpoint from which you get it) and redeploy your blog everytime you add new content."
		},
		{
			breadcrumbs: ['Cloudflare Workers'],
			href: '/docs/adapter-cloudflare-workers',
			content:
				'To deploy to Cloudflare Workers, use adapter-cloudflare-workers.\n\nUnless you have a specific reason to use this adapter, we recommend using adapter-cloudflare instead.\n\nRequires Wrangler v2.'
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Usage'],
			href: '/docs/adapter-cloudflare-workers#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-cloudflare-workers, then add the adapter to your svelte.config.js:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-cloudflare-workers';\n\nexport default {\n    kit: {\n        adapter: adapter()\n    }\n};"
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Basic Configuration'],
			href: '/docs/adapter-cloudflare-workers#basic-configuration',
			content:
				'This adapter expects to find a wrangler.toml file in the project root. It should look something like this:\n\n/// file: wrangler.toml\nname = "<your-service-name>"\naccount_id = "<your-account-id>"\n\nmain = "./.cloudflare/worker.js"\nsite.bucket = "./.cloudflare/public"\n\nbuild.command = "npm run build"\n\ncompatibility_date = "2021-11-12"\nworkers_dev = true<your-service-name> can be anything. <your-account-id> can be found by logging into your Cloudflare dashboard and grabbing it from the end of the URL:\n\nhttps://dash.cloudflare.com/<your-account-id>You should add the .cloudflare directory (or whichever directories you specified for main and site.bucket) to your .gitignore.\n\n\nYou will need to install wrangler and log in, if you haven\'t already:\n\nnpm i -g wrangler\nwrangler loginThen, you can build your app and deploy it:\n\nwrangler publish'
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Custom config'],
			href: '/docs/adapter-cloudflare-workers#custom-config',
			content:
				"If you would like to use a config file other than wrangler.toml, you can do like so:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-cloudflare-workers';\n\nexport default {\n    kit: {\n        adapter: adapter({ config: '<your-wrangler-name>.toml' })\n    }\n};"
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Environment variables'],
			href: '/docs/adapter-cloudflare-workers#environment-variables',
			content:
				"The env object, containing KV/DO namespaces etc, is passed to SvelteKit via the platform property along with context and caches, meaning you can access it in hooks and endpoints:\n\n// @errors: 7031\nexport async function POST({ request, platform }) {\n    const x = platform.env.YOUR_DURABLE_OBJECT_NAMESPACE.idFromName('x');\n}To make these types available to your app, reference them in your src/app.d.ts:\n\n/// file: src/app.d.ts\ndeclare global {\n    namespace App {\n        interface Platform {\n+\t\t\tenv?: {\n+\t\t\t\tYOUR_KV_NAMESPACE: KVNamespace;\n+\t\t\t\tYOUR_DURABLE_OBJECT_NAMESPACE: DurableObjectNamespace;\n+\t\t\t};\n        }\n    }\n}\n\nexport {};platform.env is only available in the production build. Use wrangler to test it locally"
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Troubleshooting'],
			href: '/docs/adapter-cloudflare-workers#troubleshooting',
			content: ''
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Troubleshooting', 'Worker size limits'],
			href: '/docs/adapter-cloudflare-workers#troubleshooting-worker-size-limits',
			content:
				"When deploying to workers, the server generated by SvelteKit is bundled into a single file. Wrangler will fail to publish your worker if it exceeds the size limits after minification. You're unlikely to hit this limit usually, but some large libraries can cause this to happen. In that case, you can try to reduce the size of your worker by only importing such libraries on the client side. See the FAQ for more information."
		},
		{
			breadcrumbs: ['Cloudflare Workers', 'Troubleshooting', 'Accessing the file system'],
			href: '/docs/adapter-cloudflare-workers#troubleshooting-accessing-the-file-system',
			content:
				"You can't access the file system through methods like fs.readFileSync in Serverless/Edge environments. If you need to access files that way, do that during building the app through prerendering. If you have a blog for example and don't want to manage your content through a CMS, then you need to prerender the content (or prerender the endpoint from which you get it) and redeploy your blog everytime you add new content."
		},
		{
			breadcrumbs: ['Netlify'],
			href: '/docs/adapter-netlify',
			content:
				'To deploy to Netlify, use adapter-netlify.\n\nThis adapter will be installed by default when you use adapter-auto, but adding it to your project allows you to specify Netlify-specific options.'
		},
		{
			breadcrumbs: ['Netlify', 'Usage'],
			href: '/docs/adapter-netlify#usage',
			content:
				'Install with npm i -D @sveltejs/adapter-netlify, then add the adapter to your svelte.config.js:\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from \'@sveltejs/adapter-netlify\';\n\nexport default {\n    kit: {\n        // default options are shown\n        adapter: adapter({\n            // if true, will create a Netlify Edge Function rather\n            // than using standard Node-based functions\n            edge: false,\n\n            // if true, will split your app into multiple functions\n            // instead of creating a single one for the entire app.\n            // if `edge` is true, this option cannot be used\n            split: false\n        })\n    }\n};Then, make sure you have a netlify.toml file in the project root. This will determine where to write static assets based on the build.publish settings, as per this sample configuration:\n\n[build]\n    command = "npm run build"\n    publish = "build"If the netlify.toml file or the build.publish value is missing, a default value of &quot;build&quot; will be used. Note that if you have set the publish directory in the Netlify UI to something else then you will need to set it in netlify.toml too, or use the default value of &quot;build&quot;.'
		},
		{
			breadcrumbs: ['Netlify', 'Usage', 'Node version'],
			href: '/docs/adapter-netlify#usage-node-version',
			content:
				"New projects will use Node 16 by default. However, if you're upgrading a project you created a while ago it may be stuck on an older version. See the Netlify docs for details on manually specifying Node 16 or newer."
		},
		{
			breadcrumbs: ['Netlify', 'Netlify Edge Functions (beta)'],
			href: '/docs/adapter-netlify#netlify-edge-functions-beta',
			content:
				"SvelteKit supports the beta release of Netlify Edge Functions. If you pass the option edge: true to the adapter function, server-side rendering will happen in a Deno-based edge function that's deployed close to the site visitor. If set to false (the default), the site will deploy to standard Node-based Netlify Functions.\n\n// @errors: 2307\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-netlify';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            // will create a Netlify Edge Function using Deno-based\n            // rather than using standard Node-based functions\n            edge: true\n        })\n    }\n};"
		},
		{
			breadcrumbs: ['Netlify', 'Netlify alternatives to SvelteKit functionality'],
			href: '/docs/adapter-netlify#netlify-alternatives-to-sveltekit-functionality',
			content:
				"You may build your app using functionality provided directly by SvelteKit without relying on any Netlify functionality. Using the SvelteKit versions of these features will allow them to be used in dev mode, tested with integration tests, and to work with other adapters should you ever decide to switch away from Netlify. However, in some scenarios you may find it beneficial to use the Netlify versions of these features. One example would be if you're migrating an app that's already hosted on Netlify to SvelteKit."
		},
		{
			breadcrumbs: ['Netlify', 'Netlify alternatives to SvelteKit functionality', 'Redirect rules'],
			href: '/docs/adapter-netlify#netlify-alternatives-to-sveltekit-functionality-redirect-rules',
			content:
				"During compilation, redirect rules are automatically appended to your _redirects file. (If it doesn't exist yet, it will be created.) That means:\n\n[[redirects]] in netlify.toml will never match as _redirects has a higher priority. So always put your rules in the _redirects file.\n_redirects shouldn't have any custom &quot;catch all&quot; rules such as /* /foobar/:splat. Otherwise the automatically appended rule will never be applied as Netlify is only processing the first matching rule."
		},
		{
			breadcrumbs: ['Netlify', 'Netlify alternatives to SvelteKit functionality', 'Netlify Forms'],
			href: '/docs/adapter-netlify#netlify-alternatives-to-sveltekit-functionality-netlify-forms',
			content:
				"Create your Netlify HTML form as described here, e.g. as /routes/contact/+page.svelte. (Don't forget to add the hidden form-name input element!)\nNetlify's build bot parses your HTML files at deploy time, which means your form must be prerendered as HTML. You can either add export const prerender = true to your contact.svelte to prerender just that page or set the kit.prerender.force: true option to prerender all pages.\nIf your Netlify form has a custom success message like <form netlify ... action=&quot;/success&quot;> then ensure the corresponding /routes/success/+page.svelte exists and is prerendered."
		},
		{
			breadcrumbs: [
				'Netlify',
				'Netlify alternatives to SvelteKit functionality',
				'Netlify Functions'
			],
			href: '/docs/adapter-netlify#netlify-alternatives-to-sveltekit-functionality-netlify-functions',
			content:
				'With this adapter, SvelteKit endpoints are hosted as Netlify Functions. Netlify function handlers have additional context, including Netlify Identity information. You can access this context via the event.platform.context field inside your hooks and +page.server or +layout.server endpoints. These are serverless functions when the edge property is false in the adapter config or edge functions when it is true.\n\n// @errors: 2705 7006\n/// file: +page.server.js\nexport const load = async (event) => {\n    const context = event.platform.context;\n    console.log(context); // shows up in your functions log in the Netlify app\n};Additionally, you can add your own Netlify functions by creating a directory for them and adding the configuration to your netlify.toml file. For example:\n\n[build]\n    command = "npm run build"\n    publish = "build"\n\n[functions]\n    directory = "functions"'
		},
		{
			breadcrumbs: ['Netlify', 'Troubleshooting'],
			href: '/docs/adapter-netlify#troubleshooting',
			content: ''
		},
		{
			breadcrumbs: ['Netlify', 'Troubleshooting', 'Accessing the file system'],
			href: '/docs/adapter-netlify#troubleshooting-accessing-the-file-system',
			content:
				"You can't access the file system through methods like fs.readFileSync in Serverless/Edge environments. If you need to access files that way, do that during building the app through prerendering. If you have a blog for example and don't want to manage your content through a CMS, then you need to prerender the content (or prerender the endpoint from which you get it) and redeploy your blog everytime you add new content."
		},
		{
			breadcrumbs: ['Vercel'],
			href: '/docs/adapter-vercel',
			content:
				'To deploy to Vercel, use adapter-vercel.\n\nThis adapter will be installed by default when you use adapter-auto, but adding it to your project allows you to specify Vercel-specific options.'
		},
		{
			breadcrumbs: ['Vercel', 'Usage'],
			href: '/docs/adapter-vercel#usage',
			content:
				"Install with npm i -D @sveltejs/adapter-vercel, then add the adapter to your svelte.config.js:\n\n// @errors: 2307 2345\n/// file: svelte.config.js\nimport adapter from '@sveltejs/adapter-vercel';\n\nexport default {\n    kit: {\n        adapter: adapter({\n            // see the 'Deployment configuration' section below\n        })\n    }\n};"
		},
		{
			breadcrumbs: ['Vercel', 'Deployment configuration'],
			href: '/docs/adapter-vercel#deployment-configuration',
			content:
				"To control how your routes are deployed to Vercel as functions, you can specify deployment configuration, either through the option shown above or with export const config inside +server.js, +page(.server).js and +layout(.server).js files.\n\nFor example you could deploy some parts of your app as Edge Functions...\n\n/// file: about/+page.js\n/** @type {import('@sveltejs/adapter-vercel').Config} */\nexport const config = {\n    runtime: 'edge'\n};...and others as Serverless Functions (note that by specifying config inside a layout, it applies to all child pages):\n\n/// file: admin/+layout.js\n/** @type {import('@sveltejs/adapter-vercel').Config} */\nexport const config = {\n    runtime: 'nodejs18.x'\n};The following options apply to all functions:\n\nruntime: 'edge', 'nodejs16.x' or 'nodejs18.x'. By default, the adapter will select 'nodejs16.x' or 'nodejs18.x' depending on the Node version your project is configured to use on the Vercel dashboard\nregions: an array of edge network regions (defaulting to [&quot;iad1&quot;] for serverless functions) or 'all' if runtime is edge (its default). Note that multiple regions for serverless functions are only supported on Enterprise plans\nsplit: if true, causes a route to be deployed as an individual function. If split is set to true at the adapter level, all routes will be deployed as individual functions\n\nAdditionally, the following options apply to edge functions:\n\nenvVarsInUse: an array of environment variables that should be accessible inside the edge function\nexternal: an array of dependencies that esbuild should treat as external when bundling functions. This should only be used to exclude optional dependencies that will not run outside Node\n\nAnd the following option apply to serverless functions:\n\nmemory: the amount of memory available to the function. Defaults to 1024 Mb, and can be decreased to 128 Mb or increased in 64Mb increments up to 3008 Mb on Pro or Enterprise accounts\nmaxDuration: maximum execution duration of the function. Defaults to 10 seconds for Hobby accounts, 60 for Pro and 900 for Enterprise\nisr: configuration Incremental Static Regeneration, described below\n\nIf your functions need to access data in a specific region, it's recommended that they be deployed in the same region (or close to it) for optimal performance."
		},
		{
			breadcrumbs: ['Vercel', 'Incremental Static Regeneration'],
			href: '/docs/adapter-vercel#incremental-static-regeneration',
			content:
				"Vercel supports Incremental Static Regeneration (ISR), which provides the performance and cost advantages of prerendered content with the flexibility of dynamically rendered content.\n\nTo add ISR to a route, include the isr property in your config object:\n\nimport { BYPASS_TOKEN } from '$env/static/private';\n\nexport const config = {\n    isr: {\n        // Expiration time (in seconds) before the cached asset will be re-generated by invoking the Serverless Function.\n        // Setting the value to `false` means it will never expire.\n        expiration: 60,\n\n        // Random token that can be provided in the URL to bypass the cached version of the asset, by requesting the asset\n        // with a __prerender_bypass=<token> cookie.\n        //\n        // Making a `GET` or `HEAD` request with `x-prerender-revalidate: <token>` will force the asset to be re-validated.\n        bypassToken: BYPASS_TOKEN,\n\n        // List of valid query parameters. Other parameters (such as utm tracking codes) will be ignored,\n        // ensuring that they do not result in content being regenerated unnecessarily\n        allowQuery: ['search']\n    }\n};The expiration property is required; all others are optional."
		},
		{
			breadcrumbs: ['Vercel', 'Environment variables'],
			href: '/docs/adapter-vercel#environment-variables',
			content:
				"Vercel makes a set of deployment-specific environment variables available. Like other environment variables, these are accessible from $env/static/private and $env/dynamic/private (sometimes — more on that later), and inaccessible from their public counterparts. To access one of these variables from the client:\n\n// @errors: 2305\n/// file: +layout.server.js\nimport { VERCEL_COMMIT_REF } from '$env/static/private';\n\n/** @type {import('./$types').LayoutServerLoad} */\nexport function load() {\n    return {\n        deploymentGitBranch: VERCEL_COMMIT_REF\n    };\n}/// file: +layout.svelte\n<script>\n    /** @type {import('./$types').LayoutServerData} */\n    export let data;\n</script>\n\n<p>This staging environment was deployed from {data.deploymentGitBranch}.</p>Since all of these variables are unchanged between build time and run time when building on Vercel, we recommend using $env/static/private — which will statically replace the variables, enabling optimisations like dead code elimination — rather than $env/dynamic/private. If you're deploying with edge: true you must either use $env/static/private or populate the envVarsInUse configuration."
		},
		{ breadcrumbs: ['Vercel', 'Notes'], href: '/docs/adapter-vercel#notes', content: '' },
		{
			breadcrumbs: ['Vercel', 'Notes', 'Vercel functions'],
			href: '/docs/adapter-vercel#notes-vercel-functions',
			content:
				"If you have Vercel functions contained in the api directory at the project's root, any requests for /api/* will not be handled by SvelteKit. You should implement these as API routes in your SvelteKit app instead, unless you need to use a non-JavaScript language in which case you will need to ensure that you don't have any /api/* routes in your SvelteKit app."
		},
		{
			breadcrumbs: ['Vercel', 'Notes', 'Node version'],
			href: '/docs/adapter-vercel#notes-node-version',
			content:
				'Projects created before a certain date will default to using Node 14, while SvelteKit requires Node 16 or later. You can change the Node version in your project settings.'
		},
		{
			breadcrumbs: ['Vercel', 'Troubleshooting'],
			href: '/docs/adapter-vercel#troubleshooting',
			content: ''
		},
		{
			breadcrumbs: ['Vercel', 'Troubleshooting', 'Accessing the file system'],
			href: '/docs/adapter-vercel#troubleshooting-accessing-the-file-system',
			content:
				"You can't access the file system through methods like fs.readFileSync in Serverless/Edge environments. If you need to access files that way, do that during building the app through prerendering. If you have a blog for example and don't want to manage your content through a CMS, then you need to prerender the content (or prerender the endpoint from which you get it) and redeploy your blog everytime you add new content."
		},
		{
			breadcrumbs: ['Writing adapters'],
			href: '/docs/writing-adapters',
			content:
				"If an adapter for your preferred environment doesn't yet exist, you can build your own. We recommend looking at the source for an adapter to a platform similar to yours and copying it as a starting point.\n\nAdapters packages must implement the following API, which creates an Adapter:\n\n/** @param {AdapterSpecificOptions} options */\nexport default function (options) {\n    /** @type {import('@sveltejs/kit').Adapter} */\n    const adapter = {\n        name: 'adapter-package-name',\n        async adapt(builder) {\n            // adapter implementation\n        }\n    };\n\n    return adapter;\n}The types for Adapter and its parameters are available in types/index.d.ts.\n\nWithin the adapt method, there are a number of things that an adapter should do:\n\nClear out the build directory\nWrite SvelteKit output with builder.writeClient, builder.writeServer, and builder.writePrerendered\nOutput code that:Imports Server from ${builder.getServerDirectory()}/index.js\nInstantiates the app with a manifest generated with builder.generateManifest({ relativePath })\nListens for requests from the platform, converts them to a standard Request if necessary, calls the server.respond(request, { getClientAddress }) function to generate a Response and responds with it\nexpose any platform-specific information to SvelteKit via the platform option passed to server.respond\nGlobally shims fetch to work on the target platform, if necessary. SvelteKit provides a @sveltejs/kit/install-fetch helper for platforms that can use node-fetch\n\n\nBundle the output to avoid needing to install dependencies on the target platform, if necessary\nPut the user's static files and the generated JS/CSS in the correct location for the target platform\n\nWhere possible, we recommend putting the adapter output under the build/ directory with any intermediate output placed under .svelte-kit/[adapter-name]."
		},
		{ breadcrumbs: ['Advanced routing'], href: '/docs/advanced-routing', content: '' },
		{
			breadcrumbs: ['Advanced routing', 'Rest parameters'],
			href: '/docs/advanced-routing#rest-parameters',
			content:
				"If the number of route segments is unknown, you can use rest syntax — for example you might implement GitHub's file viewer like so...\n\n/[org]/[repo]/tree/[branch]/[...file]...in which case a request for /sveltejs/kit/tree/master/documentation/docs/04-advanced-routing.md would result in the following parameters being available to the page:\n\n// @noErrors\n{\n    org: 'sveltejs',\n    repo: 'kit',\n    branch: 'master',\n    file: 'documentation/docs/04-advanced-routing.md'\n}src/routes/a/[...rest]/z/+page.svelte will match /a/z (i.e. there's no parameter at all) as well as /a/b/z and /a/b/c/z and so on. Make sure you check that the value of the rest parameter is valid, for example using a matcher."
		},
		{
			breadcrumbs: ['Advanced routing', 'Rest parameters', '404 pages'],
			href: '/docs/advanced-routing#rest-parameters-404-pages',
			content:
				"Rest parameters also allow you to render custom 404s. Given these routes...\n\nsrc/routes/\n├ marx-brothers/\n│ ├ chico/\n│ ├ harpo/\n│ ├ groucho/\n│ └ +error.svelte\n└ +error.svelte...the marx-brothers/+error.svelte file will not be rendered if you visit /marx-brothers/karl, because no route was matched. If you want to render the nested error page, you should create a route that matches any /marx-brothers/* request, and return a 404 from it:\n\nsrc/routes/\n├ marx-brothers/\n+| ├ [...path]/\n│ ├ chico/\n│ ├ harpo/\n│ ├ groucho/\n│ └ +error.svelte\n└ +error.svelte/// file: src/routes/marx-brothers/[...path]/+page.js\nimport { error } from '@sveltejs/kit';\n\n/** @type {import('./$types').PageLoad} */\nexport function load(event) {\n    throw error(404, 'Not Found');\n}If you don't handle 404 cases, they will appear in handleError"
		},
		{
			breadcrumbs: ['Advanced routing', 'Optional parameters'],
			href: '/docs/advanced-routing#optional-parameters',
			content:
				"A route like [lang]/home contains a parameter named lang which is required. Sometimes it's beneficial to make these parameters optional, so that in this example both home and en/home point to the same page. You can do that by wrapping the parameter in another bracket pair: [[lang]]/home\n\nNote that an optional route parameter cannot follow a rest parameter ([...rest]/[[optional]]), since parameters are matched 'greedily' and the optional parameter would always be unused."
		},
		{
			breadcrumbs: ['Advanced routing', 'Matching'],
			href: '/docs/advanced-routing#matching',
			content:
				"A route like src/routes/archive/[page] would match /archive/3, but it would also match /archive/potato. We don't want that. You can ensure that route parameters are well-formed by adding a matcher — which takes the parameter string (&quot;3&quot; or &quot;potato&quot;) and returns true if it is valid — to your params directory...\n\n/// file: src/params/integer.js\n/** @type {import('@sveltejs/kit').ParamMatcher} */\nexport function match(param) {\n    return /^\\d+$/.test(param);\n}...and augmenting your routes:\n\n-src/routes/archive/[page]\n+src/routes/archive/[page=integer]If the pathname doesn't match, SvelteKit will try to match other routes (using the sort order specified below), before eventually returning a 404.\n\nEach module in the params directory corresponds to a matcher, with the exception of *.test.js and *.spec.js files which may be used to unit test your matchers.\n\nMatchers run both on the server and in the browser."
		},
		{
			breadcrumbs: ['Advanced routing', 'Sorting'],
			href: '/docs/advanced-routing#sorting',
			content:
				"It's possible for multiple routes to match a given path. For example each of these routes would match /foo-abc:\n\nsrc/routes/[...catchall]/+page.svelte\nsrc/routes/[[a=x]]/+page.svelte\nsrc/routes/[b]/+page.svelte\nsrc/routes/foo-[c]/+page.svelte\nsrc/routes/foo-abc/+page.svelteSvelteKit needs to know which route is being requested. To do so, it sorts them according to the following rules...\n\nMore specific routes are higher priority (e.g. a route with no parameters is more specific than a route with one dynamic parameter, and so on)\nParameters with matchers ([name=type]) are higher priority than those without ([name])\n[[optional]] and [...rest] parameters are ignored unless they are the final part of the route, in which case they are treated with lowest priority. In other words x/[[y]]/z is treated equivalently to x/z for the purposes of sorting\nTies are resolved alphabetically\n\n...resulting in this ordering, meaning that /foo-abc will invoke src/routes/foo-abc/+page.svelte, and /foo-def will invoke src/routes/foo-[c]/+page.svelte rather than less specific routes:\n\nsrc/routes/foo-abc/+page.svelte\nsrc/routes/foo-[c]/+page.svelte\nsrc/routes/[[a=x]]/+page.svelte\nsrc/routes/[b]/+page.svelte\nsrc/routes/[...catchall]/+page.svelte"
		},
		{
			breadcrumbs: ['Advanced routing', 'Encoding'],
			href: '/docs/advanced-routing#encoding',
			content:
				"Some characters can't be used on the filesystem — / on Linux and Mac, \\ / : * ? &quot; < > | on Windows. The # and % characters have special meaning in URLs, and the [ ] ( ) characters have special meaning to SvelteKit, so these also can't be used directly as part of your route.\n\nTo use these characters in your routes, you can use hexadecimal escape sequences, which have the format [x+nn] where nn is a hexadecimal character code:\n\n\\ — [x+5c]\n/ — [x+2f]\n: — [x+3a]\n* — [x+2a]\n? — [x+3f]\n&quot; — [x+22]\n< — [x+3c]\n> — [x+3e]\n| — [x+7c]\n# — [x+23]\n% — [x+25]\n[ — [x+5b]\n] — [x+5d]\n( — [x+28]\n) — [x+29]\n\nFor example, to create a /smileys/:-) route, you would create a src/routes/smileys/[x+3a]-[x+29]/+page.svelte file.\n\nYou can determine the hexadecimal code for a character with JavaScript:\n\n':'.charCodeAt(0).toString(16); // '3a', hence '[x+3a]'You can also use Unicode escape sequences. Generally you won't need to as you can use the unencoded character directly, but if — for some reason — you can't have a filename with an emoji in it, for example, then you can use the escaped characters. In other words, these are equivalent:\n\nsrc/routes/[u+d83e][u+dd2a]/+page.svelte\nsrc/routes/🤪/+page.svelteThe format for a Unicode escape sequence is [u+nnnn] where nnnn is a valid value between 0000 and 10ffff. (Unlike JavaScript string escaping, there's no need to use surrogate pairs to represent code points above ffff.) To learn more about Unicode encodings, consult Programming with Unicode.\n\nSince TypeScript struggles with directories with a leading . character, you may find it useful to encode these characters when creating e.g. .well-known routes: src/routes/[x+2e]well-known/..."
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts'],
			href: '/docs/advanced-routing#advanced-layouts',
			content:
				'By default, the layout hierarchy mirrors the route hierarchy. In some cases, that might not be what you want.'
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts', '(group)'],
			href: '/docs/advanced-routing#advanced-layouts-group',
			content:
				"Perhaps you have some routes that are 'app' routes that should have one layout (e.g. /dashboard or /item), and others that are 'marketing' routes that should have a different layout (/blog or /testimonials). We can group these routes with a directory whose name is wrapped in parentheses — unlike normal directories, (app) and (marketing) do not affect the URL pathname of the routes inside them:\n\nsrc/routes/\n+│ (app)/\n│ ├ dashboard/\n│ ├ item/\n│ └ +layout.svelte\n+│ (marketing)/\n│ ├ about/\n│ ├ testimonials/\n│ └ +layout.svelte\n├ admin/\n└ +layout.svelteYou can also put a +page directly inside a (group), for example if / should be an (app) or a (marketing) page."
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts', 'Breaking out of layouts'],
			href: '/docs/advanced-routing#advanced-layouts-breaking-out-of-layouts',
			content:
				'The root layout applies to every page of your app — if omitted, it defaults to <slot />. If you want some pages to have a different layout hierarchy than the rest, then you can put your entire app inside one or more groups except the routes that should not inherit the common layouts.\n\nIn the example above, the /admin route does not inherit either the (app) or (marketing) layouts.'
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts', '+page@'],
			href: '/docs/advanced-routing#advanced-layouts-page',
			content:
				'Pages can break out of the current layout hierarchy on a route-by-route basis. Suppose we have an /item/[id]/embed route inside the (app) group from the previous example:\n\nsrc/routes/\n├ (app)/\n│ ├ item/\n│ │ ├ [id]/\n│ │ │ ├ embed/\n+│ │ │ │ └ +page.svelte\n│ │ │ └ +layout.svelte\n│ │ └ +layout.svelte\n│ └ +layout.svelte\n└ +layout.svelteOrdinarily, this would inherit the root layout, the (app) layout, the item layout and the [id] layout. We can reset to one of those layouts by appending @ followed by the segment name — or, for the root layout, the empty string. In this example, we can choose from the following options:\n\n+page@[id].svelte - inherits from src/routes/(app)/item/[id]/+layout.svelte\n+page@item.svelte - inherits from src/routes/(app)/item/+layout.svelte\n+page@(app).svelte - inherits from src/routes/(app)/+layout.svelte\n+page@.svelte - inherits from src/routes/+layout.svelte\n\nsrc/routes/\n├ (app)/\n│ ├ item/\n│ │ ├ [id]/\n│ │ │ ├ embed/\n+│ │ │ │ └ +page@(app).svelte\n│ │ │ └ +layout.svelte\n│ │ └ +layout.svelte\n│ └ +layout.svelte\n└ +layout.svelte'
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts', '+layout@'],
			href: '/docs/advanced-routing#advanced-layouts-layout',
			content:
				'Like pages, layouts can themselves break out of their parent layout hierarchy, using the same technique. For example, a +layout@.svelte component would reset the hierarchy for all its child routes.\n\nsrc/routes/\n├ (app)/\n│ ├ item/\n│ │ ├ [id]/\n│ │ │ ├ embed/\n│ │ │ │ └ +page.svelte  // uses (app)/item/[id]/+layout.svelte\n│ │ │ ├ +layout.svelte  // inherits from (app)/item/+layout@.svelte\n│ │ │ └ +page.svelte    // uses (app)/item/+layout@.svelte\n│ │ └ +layout@.svelte   // inherits from root layout, skipping (app)/+layout.svelte\n│ └ +layout.svelte\n└ +layout.svelte'
		},
		{
			breadcrumbs: ['Advanced routing', 'Advanced layouts', 'When to use layout groups'],
			href: '/docs/advanced-routing#advanced-layouts-when-to-use-layout-groups',
			content:
				"Not all use cases are suited for layout grouping, nor should you feel compelled to use them. It might be that your use case would result in complex (group) nesting, or that you don't want to introduce a (group) for a single outlier. It's perfectly fine to use other means such as composition (reusable load functions or Svelte components) or if-statements to achieve what you want. The following example shows a layout that rewinds to the root layout and reuses components and functions that other layouts can also use:\n\n/// file: src/routes/nested/route/+layout@.svelte\n<script>\n    import ReusableLayout from '$lib/ReusableLayout.svelte';\n    export let data;\n</script>\n\n<ReusableLayout {data}>\n    <slot />\n</ReusableLayout>import { reusableLoad } from '$lib/reusable-load-function';\n\n/** @type {import('./$types').PageLoad} */\nexport function load(event) {\n    // Add additional logic here, if needed\n    return reusableLoad(event);\n}"
		},
		{
			breadcrumbs: ['Advanced routing', 'Further reading'],
			href: '/docs/advanced-routing#further-reading',
			content: 'Tutorial: Advanced Routing'
		},
		{
			breadcrumbs: ['Hooks'],
			href: '/docs/hooks',
			content:
				"'Hooks' are app-wide functions you declare that SvelteKit will call in response to specific events, giving you fine-grained control over the framework's behaviour.\n\nThere are two hooks files, both optional:\n\nsrc/hooks.server.js — your app's server hooks\nsrc/hooks.client.js — your app's client hooks\n\nCode in these modules will run when the application starts up, making them useful for initializing database clients and so on.\n\nYou can configure the location of these files with config.kit.files.hooks."
		},
		{
			breadcrumbs: ['Hooks', 'Server hooks'],
			href: '/docs/hooks#server-hooks',
			content: 'The following hooks can be added to src/hooks.server.js:'
		},
		{
			breadcrumbs: ['Hooks', 'Server hooks', 'handle'],
			href: '/docs/hooks#server-hooks-handle',
			content:
				"This function runs every time the SvelteKit server receives a request — whether that happens while the app is running, or during prerendering — and determines the response. It receives an event object representing the request and a function called resolve, which renders the route and generates a Response. This allows you to modify response headers or bodies, or bypass SvelteKit entirely (for implementing routes programmatically, for example).\n\n/// file: src/hooks.server.js\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    if (event.url.pathname.startsWith('/custom')) {\n        return new Response('custom response');\n    }\n\n    const response = await resolve(event);\n    return response;\n}Requests for static assets — which includes pages that were already prerendered — are not handled by SvelteKit.\n\n\nIf unimplemented, defaults to ({ event, resolve }) => resolve(event). To add custom data to the request, which is passed to handlers in +server.js and server load functions, populate the event.locals object, as shown below.\n\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    event.locals.user = await getUserInformation(event.cookies.get('sessionid'));\n\n    const response = await resolve(event);\n    response.headers.set('x-custom-header', 'potato');\n\n    return response;\n}You can define multiple handle functions and execute them with the sequence helper function.\n\nresolve also supports a second, optional parameter that gives you more control over how the response will be rendered. That parameter is an object that can have the following fields:\n\ntransformPageChunk(opts: { html: string, done: boolean }): MaybePromise<string | undefined> — applies custom transforms to HTML. If done is true, it's the final chunk. Chunks are not guaranteed to be well-formed HTML (they could include an element's opening tag but not its closing tag, for example) but they will always be split at sensible boundaries such as %sveltekit.head% or layout/page components.\nfilterSerializedResponseHeaders(name: string, value: string): boolean — determines which headers should be included in serialized responses when a load function loads a resource with fetch. By default, none will be included.\npreload(input: { type: 'js' | 'css' | 'font' | 'asset', path: string }): boolean — determines what files should be added to the <head> tag to preload it. The method is called with each file that was found at build time while constructing the code chunks — so if you for example have import './styles.css in your +page.svelte, preload will be called with the resolved path to that CSS file when visiting that page. Note that in dev mode preload is not called, since it depends on analysis that happens at build time. Preloading can improve performance by downloading assets sooner, but it can also hurt if too much is downloaded unnecessarily. By default, js and css files will be preloaded. asset files are not preloaded at all currently, but we may add this later after evaluating feedback.\n\n/// file: src/hooks.server.js\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    const response = await resolve(event, {\n        transformPageChunk: ({ html }) => html.replace('old', 'new'),\n        filterSerializedResponseHeaders: (name) => name.startsWith('x-'),\n        preload: ({ type, path }) => type === 'js' || path.includes('/important/')\n    });\n\n    return response;\n}Note that resolve(...) will never throw an error, it will always return a Promise<Response> with the appropriate status code. If an error is thrown elsewhere during handle, it is treated as fatal, and SvelteKit will respond with a JSON representation of the error or a fallback error page — which can be customised via src/error.html — depending on the Accept header. You can read more about error handling here."
		},
		{
			breadcrumbs: ['Hooks', 'Server hooks', 'handleFetch'],
			href: '/docs/hooks#server-hooks-handlefetch',
			content:
				"This function allows you to modify (or replace) a fetch request that happens inside a load or action function that runs on the server (or during pre-rendering).\n\nFor example, your load function might make a request to a public URL like https://api.yourapp.com when the user performs a client-side navigation to the respective page, but during SSR it might make sense to hit the API directly (bypassing whatever proxies and load balancers sit between it and the public internet).\n\n/// file: src/hooks.server.js\n/** @type {import('@sveltejs/kit').HandleFetch} */\nexport async function handleFetch({ request, fetch }) {\n    if (request.url.startsWith('https://api.yourapp.com/')) {\n        // clone the original request, but change the URL\n        request = new Request(\n            request.url.replace('https://api.yourapp.com/', 'http://localhost:9999/'),\n            request\n        );\n    }\n\n    return fetch(request);\n}Credentials\n\nFor same-origin requests, SvelteKit's fetch implementation will forward cookie and authorization headers unless the credentials option is set to &quot;omit&quot;.\n\nFor cross-origin requests, cookie will be included if the request URL belongs to a subdomain of the app — for example if your app is on my-domain.com, and your API is on api.my-domain.com, cookies will be included in the request.\n\nIf your app and your API are on sibling subdomains — www.my-domain.com and api.my-domain.com for example — then a cookie belonging to a common parent domain like my-domain.com will not be included, because SvelteKit has no way to know which domain the cookie belongs to. In these cases you will need to manually include the cookie using handleFetch:\n\n/// file: src/hooks.server.js\n// @errors: 2345\n/** @type {import('@sveltejs/kit').HandleFetch} */\nexport async function handleFetch({ event, request, fetch }) {\n    if (request.url.startsWith('https://api.my-domain.com/')) {\n        request.headers.set('cookie', event.request.headers.get('cookie'));\n    }\n\n    return fetch(request);\n}"
		},
		{
			breadcrumbs: ['Hooks', 'Shared hooks'],
			href: '/docs/hooks#shared-hooks',
			content: 'The following can be added to src/hooks.server.js and src/hooks.client.js:'
		},
		{
			breadcrumbs: ['Hooks', 'Shared hooks', 'handleError'],
			href: '/docs/hooks#shared-hooks-handleerror',
			content:
				"If an unexpected error is thrown during loading or rendering, this function will be called with the error and the event. This allows for two things:\n\nyou can log the error\nyou can generate a custom representation of the error that is safe to show to users, omitting sensitive details like messages and stack traces. The returned value becomes the value of $page.error. It defaults to { message: 'Not Found' } in case of a 404 (you can detect them through event.route.id being null) and to { message: 'Internal Error' } for everything else. To make this type-safe, you can customize the expected shape by declaring an App.Error interface (which must include message: string, to guarantee sensible fallback behavior).\n\nThe following code shows an example of typing the error shape as { message: string; errorId: string } and returning it accordingly from the handleError functions:\n\n/// file: src/app.d.ts\ndeclare global {\n    namespace App {\n        interface Error {\n            message: string;\n            errorId: string;\n        }\n    }\n}\n\nexport {};import * as Sentry from '@sentry/node';\nimport crypto from 'crypto';\n\nSentry.init({/*...*/})\n\n/** @type {import('@sveltejs/kit').HandleServerError} */\nexport async function handleError({ error, event }) {\n    const errorId = crypto.randomUUID();\n    // example integration with https://sentry.io/\n    Sentry.captureException(error, { event, errorId });\n\n    return {\n        message: 'Whoops!',\n        errorId\n    };\n}import * as Sentry from '@sentry/svelte';\n\nSentry.init({/*...*/})\n\n/** @type {import('@sveltejs/kit').HandleClientError} */\nexport async function handleError({ error, event }) {\n    const errorId = crypto.randomUUID();\n    // example integration with https://sentry.io/\n    Sentry.captureException(error, { event, errorId });\n\n    return {\n        message: 'Whoops!',\n        errorId\n    };\n}In src/hooks.client.js, the type of handleError is HandleClientError instead of HandleServerError, and event is a NavigationEvent rather than a RequestEvent.\n\n\nThis function is not called for expected errors (those thrown with the error function imported from @sveltejs/kit).\n\nDuring development, if an error occurs because of a syntax error in your Svelte code, the passed in error has a frame property appended highlighting the location of the error.\n\nMake sure that handleError never throws an error"
		},
		{
			breadcrumbs: ['Hooks', 'Further reading'],
			href: '/docs/hooks#further-reading',
			content: 'Tutorial: Hooks'
		},
		{
			breadcrumbs: ['Errors'],
			href: '/docs/errors',
			content:
				'Errors are an inevitable fact of software development. SvelteKit handles errors differently depending on where they occur, what kind of errors they are, and the nature of the incoming request.'
		},
		{
			breadcrumbs: ['Errors', 'Error objects'],
			href: '/docs/errors#error-objects',
			content:
				'SvelteKit distinguishes between expected and unexpected errors, both of which are represented as simple { message: string } objects by default.\n\nYou can add additional properties, like a code or a tracking id, as shown in the examples below. (When using TypeScript this requires you to redefine the Error type as described in  type safety).'
		},
		{
			breadcrumbs: ['Errors', 'Expected errors'],
			href: '/docs/errors#expected-errors',
			content:
				"An expected error is one created with the error helper imported from @sveltejs/kit:\n\nimport { error } from '@sveltejs/kit';\nimport * as db from '$lib/server/database';\n\n/** @type {import('./$types').PageServerLoad} */\nexport async function load({ params }) {\n    const post = await db.getPost(params.slug);\n\n    if (!post) {\n        throw error(404, {\n            message: 'Not found'\n        });\n    }\n\n    return { post };\n}This tells SvelteKit to set the response status code to 404 and render an +error.svelte component, where $page.error is the object provided as the second argument to error(...).\n\n/// file: src/routes/+error.svelte\n<script>\n    import { page } from '$app/stores';\n</script>\n\n<h1>{$page.error.message}</h1>You can add extra properties to the error object if needed...\n\nthrow error(404, {\n    message: 'Not found',\n+\tcode: 'NOT_FOUND'\n});...otherwise, for convenience, you can pass a string as the second argument:\n\n-throw error(404, { message: 'Not found' });\n+throw error(404, 'Not found');"
		},
		{
			breadcrumbs: ['Errors', 'Unexpected errors'],
			href: '/docs/errors#unexpected-errors',
			content:
				"An unexpected error is any other exception that occurs while handling a request. Since these can contain sensitive information, unexpected error messages and stack traces are not exposed to users.\n\nBy default, unexpected errors are printed to the console (or, in production, your server logs), while the error that is exposed to the user has a generic shape:\n\n{ \"message\": \"Internal Error\" }Unexpected errors will go through the handleError hook, where you can add your own error handling — for example, sending errors to a reporting service, or returning a custom error object.\n\nimport * as Sentry from '@sentry/node';\n\nSentry.init({/*...*/})\n\n/** @type {import('@sveltejs/kit').HandleServerError} */\nexport function handleError({ error, event }) {\n    // example integration with https://sentry.io/\n    Sentry.captureException(error, { event });\n\n    return {\n        message: 'Whoops!',\n        code: error?.code ?? 'UNKNOWN'\n    };\n}Make sure that handleError never throws an error"
		},
		{
			breadcrumbs: ['Errors', 'Responses'],
			href: '/docs/errors#responses',
			content:
				'If an error occurs inside handle or inside a +server.js request handler, SvelteKit will respond with either a fallback error page or a JSON representation of the error object, depending on the request\'s Accept headers.\n\nYou can customise the fallback error page by adding a src/error.html file:\n\n<!DOCTYPE html>\n<html lang="en">\n    <head>\n        <meta charset="utf-8" />\n        <title>%sveltekit.error.message%</title>\n    </head>\n    <body>\n        <h1>My custom error page</h1>\n        <p>Status: %sveltekit.status%</p>\n        <p>Message: %sveltekit.error.message%</p>\n    </body>\n</html>SvelteKit will replace %sveltekit.status% and %sveltekit.error.message% with their corresponding values.\n\nIf the error instead occurs inside a load function while rendering a page, SvelteKit will render the +error.svelte component nearest to where the error occurred. If the error occurs inside a load function in +layout(.server).js, the closest error boundary in the tree is an +error.svelte file above that layout (not next to it).\n\nThe exception is when the error occurs inside the root +layout.js or +layout.server.js, since the root layout would ordinarily contain the +error.svelte component. In this case, SvelteKit uses the fallback error page.'
		},
		{
			breadcrumbs: ['Errors', 'Type safety'],
			href: '/docs/errors#type-safety',
			content:
				"If you're using TypeScript and need to customize the shape of errors, you can do so by declaring an App.Error interface in your app (by convention, in src/app.d.ts, though it can live anywhere that TypeScript can 'see'):\n\n/// file: src/app.d.ts\ndeclare global {\n    namespace App {\n        interface Error {\n+\t\t\tcode: string;\n+\t\t\tid: string;\n        }\n    }\n}\n\nexport {};This interface always includes a message: string property."
		},
		{
			breadcrumbs: ['Errors', 'Further reading'],
			href: '/docs/errors#further-reading',
			content: 'Tutorial: Errors and redirects\nTutorial: Hooks'
		},
		{
			breadcrumbs: ['Link options'],
			href: '/docs/link-options',
			content:
				"In SvelteKit, <a> elements (rather than framework-specific <Link> components) are used to navigate between the routes of your app. If the user clicks on a link whose href is 'owned' by the app (as opposed to, say, a link to an external site) then SvelteKit will navigate to the new page by importing its code and then calling any load functions it needs to fetch data.\n\nYou can customise the behaviour of links with data-sveltekit-* attributes. These can be applied to the <a> itself, or to a parent element.\n\nThese options also apply to <form> elements with method=&quot;GET&quot;."
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-preload-data'],
			href: '/docs/link-options#data-sveltekit-preload-data',
			content:
				'Before the browser registers that the user has clicked on a link, we can detect that they\'ve hovered the mouse over it (on desktop) or that a touchstart or mousedown event was triggered. In both cases, we can make an educated guess that a click event is coming.\n\nSvelteKit can use this information to get a head start on importing the code and fetching the page\'s data, which can give us an extra couple of hundred milliseconds — the difference between a user interface that feels laggy and one that feels snappy.\n\nWe can control this behaviour with the data-sveltekit-preload-data attribute, which can have one of two values:\n\n&quot;hover&quot; means that preloading will start if the mouse comes to a rest over a link. On mobile, preloading begins on touchstart\n&quot;tap&quot; means that preloading will start as soon as a touchstart or mousedown event is registered\n\nThe default project template has a data-sveltekit-preload-data=&quot;hover&quot; attribute applied to the <body> element in src/app.html, meaning that every link is preloaded on hover by default:\n\n<body data-sveltekit-preload-data="hover">\n    <div style="display: contents">%sveltekit.body%</div>\n</body>Sometimes, calling load when the user hovers over a link might be undesirable, either because it\'s likely to result in false positives (a click needn\'t follow a hover) or because data is updating very quickly and a delay could mean staleness.\n\nIn these cases, you can specify the &quot;tap&quot; value, which causes SvelteKit to call load only when the user taps or clicks on a link:\n\n<a data-sveltekit-preload-data="tap" href="/stonks">\n    Get current stonk values\n</a>You can also programmatically invoke preloadData from $app/navigation.\n\n\nData will never be preloaded if the user has chosen reduced data usage, meaning navigator.connection.saveData is true.'
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-preload-code'],
			href: '/docs/link-options#data-sveltekit-preload-code',
			content:
				"Even in cases where you don't want to preload data for a link, it can be beneficial to preload the code. The data-sveltekit-preload-code attribute works similarly to data-sveltekit-preload-data, except that it can take one of four values, in decreasing 'eagerness':\n\n&quot;eager&quot; means that links will be preloaded straight away\n&quot;viewport&quot; means that links will be preloaded once they enter the viewport\n&quot;hover&quot; - as above, except that only code is preloaded\n&quot;tap&quot; - as above, except that only code is preloaded\n\nNote that viewport and eager only apply to links that are present in the DOM immediately following navigation — if a link is added later (in an {#if ...} block, for example) it will not be preloaded until triggered by hover or tap. This is to avoid performance pitfalls resulting from aggressively observing the DOM for changes.\n\nSince preloading code is a prerequisite for preloading data, this attribute will only have an effect if it specifies a more eager value than any data-sveltekit-preload-data attribute that is present.\n\n\nAs with data-sveltekit-preload-data, this attribute will be ignored if the user has chosen reduced data usage."
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-reload'],
			href: '/docs/link-options#data-sveltekit-reload',
			content:
				'Occasionally, we need to tell SvelteKit not to handle a link, but allow the browser to handle it. Adding a data-sveltekit-reload attribute to a link...\n\n<a data-sveltekit-reload href="/path">Path</a>...will cause a full-page navigation when the link is clicked.\n\nLinks with a rel=&quot;external&quot; attribute will receive the same treatment. In addition, they will be ignored during prerendering.'
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-replacestate'],
			href: '/docs/link-options#data-sveltekit-replacestate',
			content:
				'Sometimes you don\'t want navigation to create a new entry in the browser\'s session history. Adding a data-sveltekit-replacestate attribute to a link...\n\n<a data-sveltekit-replacestate href="/path">Path</a>...will replace the current history entry rather than creating a new one with pushState when the link is clicked.'
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-keepfocus'],
			href: '/docs/link-options#data-sveltekit-keepfocus',
			content:
				'Sometimes you don\'t want focus to be reset after navigation. For example, maybe you have a search form that submits as the user is typing, and you want to keep focus on the text input.  Adding a data-sveltekit-keepfocus attribute to it...\n\n<form data-sveltekit-keepfocus>\n    <input type="text" name="query">\n</form>...will cause the currently focused element to retain focus after navigation. In general, avoid using this attribute on links, since the focused element would be the <a> tag (and not a previously focused element) and screen reader and other assistive technology users often expect focus to be moved after a navigation. You should also only use this attribute on elements that still exist after navigation. If the element no longer exists, the user\'s focus will be lost, making for a confusing experience for assistive technology users.'
		},
		{
			breadcrumbs: ['Link options', 'data-sveltekit-noscroll'],
			href: '/docs/link-options#data-sveltekit-noscroll',
			content:
				'When navigating to internal links, SvelteKit mirrors the browser\'s default navigation behaviour: it will change the scroll position to 0,0 so that the user is at the very top left of the page (unless the link includes a #hash, in which case it will scroll to the element with a matching ID).\n\nIn certain cases, you may wish to disable this behaviour. Adding a data-sveltekit-noscroll attribute to a link...\n\n<a href="path" data-sveltekit-noscroll>Path</a>...will prevent scrolling after the link is clicked.'
		},
		{
			breadcrumbs: ['Link options', 'Disabling options'],
			href: '/docs/link-options#disabling-options',
			content:
				'To disable any of these options inside an element where they have been enabled, use the &quot;off&quot; value:\n\n<div data-sveltekit-preload-data>\n    <!-- these links will be preloaded -->\n    <a href="/a">a</a>\n    <a href="/b">b</a>\n    <a href="/c">c</a>\n\n    <div data-sveltekit-preload-data="off">\n        <!-- these links will NOT be preloaded -->\n        <a href="/d">d</a>\n        <a href="/e">e</a>\n        <a href="/f">f</a>\n    </div>\n</div>To apply an attribute to an element conditionally, do this:\n\n<div data-sveltekit-reload={shouldReload ? \'\' : \'off\'}>This works because in HTML, <element attribute> is equivalent to <element attribute=&quot;&quot;>'
		},
		{
			breadcrumbs: ['Service workers'],
			href: '/docs/service-workers',
			content:
				"Service workers act as proxy servers that handle network requests inside your app. This makes it possible to make your app work offline, but even if you don't need offline support (or can't realistically implement it because of the type of app you're building), it's often worth using service workers to speed up navigation by precaching your built JS and CSS.\n\nIn SvelteKit, if you have a src/service-worker.js file (or src/service-worker.ts, src/service-worker/index.js, etc) it will be bundled and automatically registered. You can change the location of your service worker if you need to.\n\nYou can disable automatic registration if you need to register the service worker with your own logic or use another solution. The default registration looks something like this:\n\nif ('serviceWorker' in navigator) {\n    addEventListener('load', function () {\n        navigator.serviceWorker.register('./path/to/service-worker.js');\n    });\n}"
		},
		{
			breadcrumbs: ['Service workers', 'Inside the service worker'],
			href: '/docs/service-workers#inside-the-service-worker',
			content:
				"Inside the service worker you have access to the $service-worker module, which provides you with the paths to all static assets, build files and prerendered pages. You're also provided with an app version string, which you can use for creating a unique cache name, and the deployment's base path. If your Vite config specifies define (used for global variable replacements), this will be applied to service workers as well as your server/client builds.\n\nThe following example caches the built app and any files in static eagerly, and caches all other requests as they happen. This would make each page work offline once visited.\n\n// @errors: 2339\n/// <reference types=\"@sveltejs/kit\" />\nimport { build, files, version } from '$service-worker';\n\n// Create a unique cache name for this deployment\nconst CACHE = `cache-${version}`;\n\nconst ASSETS = [\n    ...build, // the app itself\n    ...files  // everything in `static`\n];\n\nself.addEventListener('install', (event) => {\n    // Create a new cache and add all files to it\n    async function addFilesToCache() {\n        const cache = await caches.open(CACHE);\n        await cache.addAll(ASSETS);\n    }\n\n    event.waitUntil(addFilesToCache());\n});\n\nself.addEventListener('activate', (event) => {\n    // Remove previous cached data from disk\n    async function deleteOldCaches() {\n        for (const key of await caches.keys()) {\n            if (key !== CACHE) await caches.delete(key);\n        }\n    }\n\n    event.waitUntil(deleteOldCaches());\n});\n\nself.addEventListener('fetch', (event) => {\n    // ignore POST requests etc\n    if (event.request.method !== 'GET') return;\n\n    async function respond() {\n        const url = new URL(event.request.url);\n        const cache = await caches.open(CACHE);\n\n        // `build`/`files` can always be served from the cache\n        if (ASSETS.includes(url.pathname)) {\n            return cache.match(event.request);\n        }\n\n        // for everything else, try the network first, but\n        // fall back to the cache if we're offline\n        try {\n            const response = await fetch(event.request);\n\n            if (response.status === 200) {\n                cache.put(event.request, response.clone());\n            }\n\n            return response;\n        } catch {\n            return cache.match(event.request);\n        }\n    }\n\n    event.respondWith(respond());\n});Be careful when caching! In some cases, stale data might be worse than data that's unavailable while offline. Since browsers will empty caches if they get too full, you should also be careful about caching large assets like video files."
		},
		{
			breadcrumbs: ['Service workers', 'During development'],
			href: '/docs/service-workers#during-development',
			content:
				"The service worker is bundled for production, but not during development. For that reason, only browsers that support modules in service workers will be able to use them at dev time. If you are manually registering your service worker, you will need to pass the { type: 'module' } option in development:\n\nimport { dev } from '$app/environment';\n\nnavigator.serviceWorker.register('/service-worker.js', {\n    type: dev ? 'module' : 'classic'\n});build and prerendered are empty arrays during development"
		},
		{
			breadcrumbs: ['Service workers', 'Type safety'],
			href: '/docs/service-workers#type-safety',
			content:
				'Setting up proper types for service workers requires some manual setup. Inside your service-worker.js, add the following to the top of your file:\n\n/// <reference types="@sveltejs/kit" />\n/// <reference no-default-lib="true"/>\n/// <reference lib="esnext" />\n/// <reference lib="webworker" />\n\nconst sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));/// <reference types="@sveltejs/kit" />\n/// <reference no-default-lib="true"/>\n/// <reference lib="esnext" />\n/// <reference lib="webworker" />\n\nconst sw = self as unknown as ServiceWorkerGlobalScope;This disables access to DOM typings like HTMLElement which are not available inside a service worker and instantiates the correct globals. The reassignment of self to sw allows you to type cast it in the process (there are a couple of ways to do this, but the easiest that requires no additional files). Use sw instead of self in the rest of the file. The reference to the SvelteKit types ensures that the $service-worker import has proper type definitions.'
		},
		{
			breadcrumbs: ['Service workers', 'Other solutions'],
			href: '/docs/service-workers#other-solutions',
			content:
				"SvelteKit's service worker implementation is deliberately low-level. If you need a more full-flegded but also more opinionated solution, we recommend looking at solutions like Vite PWA plugin, which uses Workbox. For more general information on service workers, we recommend the MDN web docs."
		},
		{
			breadcrumbs: ['Server-only modules'],
			href: '/docs/server-only-modules',
			content:
				'Like a good friend, SvelteKit keeps your secrets. When writing your backend and frontend in the same repository, it can be easy to accidentally import sensitive data into your front-end code (environment variables containing API keys, for example). SvelteKit provides a way to prevent this entirely: server-only modules.'
		},
		{
			breadcrumbs: ['Server-only modules', 'Private environment variables'],
			href: '/docs/server-only-modules#private-environment-variables',
			content:
				'The $env/static/private and $env/dynamic/private modules, which are covered in the modules section, can only be imported into modules that only run on the server, such as hooks.server.js or +page.server.js.'
		},
		{
			breadcrumbs: ['Server-only modules', 'Your modules'],
			href: '/docs/server-only-modules#your-modules',
			content:
				'You can make your own modules server-only in two ways:\n\nadding .server to the filename, e.g. secrets.server.js\nplacing them in $lib/server, e.g. $lib/server/secrets.js'
		},
		{
			breadcrumbs: ['Server-only modules', 'How it works'],
			href: '/docs/server-only-modules#how-it-works',
			content:
				"Any time you have public-facing code that imports server-only code (whether directly or indirectly)...\n\n// @errors: 7005\n/// file: $lib/server/secrets.js\nexport const atlantisCoordinates = [/* redacted */];// @errors: 2307 7006 7005\n/// file: src/routes/utils.js\nexport { atlantisCoordinates } from '$lib/server/secrets.js';\n\nexport const add = (a, b) => a + b;/// file: src/routes/+page.svelte\n<script>\n    import { add } from './utils.js';\n</script>...SvelteKit will error:\n\nCannot import $lib/server/secrets.js into public-facing code:\n- src/routes/+page.svelte\n    - src/routes/utils.js\n        - $lib/server/secrets.jsEven though the public-facing code — src/routes/+page.svelte — only uses the add export and not the secret atlantisCoordinates export, the secret code could end up in JavaScript that the browser downloads, and so the import chain is considered unsafe.\n\nThis feature also works with dynamic imports, even interpolated ones like await import(`./${foo}.js`), with one small caveat: during development, if there are two or more dynamic imports between the public-facing code and the server-only module, the illegal import will not be detected the first time the code is loaded.\n\nUnit testing frameworks like Vitest do not distinguish between server-only and public-facing code. For this reason, illegal import detection is disabled when running tests, as determined by process.env.TEST === 'true'."
		},
		{
			breadcrumbs: ['Server-only modules', 'Further reading'],
			href: '/docs/server-only-modules#further-reading',
			content: 'Tutorial: Environment variables'
		},
		{ breadcrumbs: ['Asset handling'], href: '/docs/assets', content: '' },
		{
			breadcrumbs: ['Asset handling', 'Caching and inlining'],
			href: '/docs/assets#caching-and-inlining',
			content:
				'Vite will automatically process imported assets for improved performance. Hashes will be added to the filenames so that they can be cached and assets smaller than assetsInlineLimit will be inlined.\n\n<script>\n    import logo from \'$lib/assets/logo.png\';\n</script>\n\n<img alt="The project logo" src={logo} />If you prefer to reference assets directly in the markup, you can use a preprocessor such as svelte-preprocess-import-assets.\n\nFor assets included via the CSS url() function, you may find vitePreprocess useful.'
		},
		{
			breadcrumbs: ['Asset handling', 'Transforming'],
			href: '/docs/assets#transforming',
			content:
				'You may wish to transform your images to output compressed image formats such as .webp or .avif, responsive images with different sizes for different devices, or images with the EXIF data stripped for privacy. For images that are included statically, you may use a Vite plugin such as vite-imagetools. You may also consider a CDN, which can serve the appropriate transformed image based on the Accept HTTP header and query string parameters.'
		},
		{
			breadcrumbs: ['Snapshots'],
			href: '/docs/snapshots',
			content:
				"Ephemeral DOM state — like scroll positions on sidebars, the content of <input> elements and so on — is discarded when you navigate from one page to another.\n\nFor example, if the user fills out a form but clicks a link before submitting, then hits the browser's back button, the values they filled in will be lost. In cases where it's valuable to preserve that input, you can take a snapshot of DOM state, which can then be restored if the user navigates back.\n\nTo do this, export a snapshot object with capture and restore methods from a +page.svelte or +layout.svelte:\n\n/// file: +page.svelte\n<script>\n    let comment = '';\n\n    /** @type {import('./$types').Snapshot<string>} */\n    export const snapshot = {\n        capture: () => comment,\n        restore: (value) => comment = value\n    };\n</script>\n\n<form method=\"POST\">\n    <label for=\"comment\">Comment</label>\n    <textarea id=\"comment\" bind:value={comment} />\n    <button>Post comment</button>\n</form>When you navigate away from this page, the capture function is called immediately before the page updates, and the returned value is associated with the current entry in the browser's history stack. If you navigate back, the restore function is called with the stored value as soon as the page is updated.\n\nThe data must be serializable as JSON so that it can be persisted to sessionStorage. This allows the state to be restored when the page is reloaded, or when the user navigates back from a different site.\n\nAvoid returning very large objects from capture — once captured, objects will be retained in memory for the duration of the session, and in extreme cases may be too large to persist to sessionStorage."
		},
		{
			breadcrumbs: ['Packaging'],
			href: '/docs/packaging',
			content:
				"You can use SvelteKit to build apps as well as component libraries, using the @sveltejs/package package (npm create svelte has an option to set this up for you).\n\nWhen you're creating an app, the contents of src/routes is the public-facing stuff; src/lib contains your app's internal library.\n\nA component library has the exact same structure as a SvelteKit app, except that src/lib is the public-facing bit, and your root package.json is used to publish the package. src/routes might be a documentation or demo site that accompanies the library, or it might just be a sandbox you use during development.\n\nRunning the svelte-package command from @sveltejs/package will take the contents of src/lib and generate a dist directory (which can be configured) containing the following:\n\nAll the files in src/lib. Svelte components will be preprocessed, TypeScript files will be transpiled to JavaScript.\nType definitions (d.ts files) which are generated for Svelte, JavaScript and TypeScript files. You need to install typescript >= 4.0.0 for this. Type definitions are placed next to their implementation, hand-written d.ts files are copied over as is. You can disable generation, but we strongly recommend against it — people using your library might use TypeScript, for which they require these type definition files.\n\n@sveltejs/package version 1 generated a package.json. This is no longer the case and it will now use the package.json from your project and validate that it is correct instead. If you're still on version 1, see this PR for migration instructions."
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json'],
			href: '/docs/packaging#anatomy-of-a-package-json',
			content:
				"Since you're now building a library for public use, the contents of your package.json will become more important. Through it, you configure the entry points of your package, which files are published to npm, and which dependencies your library has. Let's go through the most important fields one by one."
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json', 'name'],
			href: '/docs/packaging#anatomy-of-a-package-json-name',
			content:
				'This is the name of your package. It will be available for others to install using that name, and visible on https://npmjs.com/package/<name>.\n\n{\n    "name": "your-library"\n}Read more about it here.'
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json', 'license'],
			href: '/docs/packaging#anatomy-of-a-package-json-license',
			content:
				'Every package should have a license field so people know how they are allowed to use it. A very popular license which is also very permissive in terms of distribution and reuse without warranty is MIT.\n\n{\n    "license": "MIT"\n}Read more about it here. Note that you should also include a LICENSE file in your package.'
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json', 'files'],
			href: '/docs/packaging#anatomy-of-a-package-json-files',
			content:
				'This tells npm which files it will pack up and upload to npm. It should contain your output folder (dist by default). Your package.json and README and LICENSE will always be included, so you don\'t need to specify them.\n\n{\n    "files": ["dist"]\n}To exclude unnecessary files (such as unit tests, or modules that are only imported from src/routes etc) you can add them to an .npmignore file. This will result in smaller packages that are faster to install.\n\nRead more about it here.'
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json', 'exports'],
			href: '/docs/packaging#anatomy-of-a-package-json-exports',
			content:
				'The &quot;exports&quot; field contains the package\'s entry points. If you set up a new library project through npm create svelte@latest, it\'s set to a single export, the package root:\n\n{\n    "exports": {\n        ".": {\n            "types": "./dist/index.d.ts",\n            "svelte": "./dist/index.js"\n        }\n    }\n}This tells bundlers and tooling that your package only has one entry point, the root, and everything should be imported through that, like this:\n\n// @errors: 2307\nimport { Something } from \'your-library\';The types and svelte keys are export conditions. They tell tooling what file to import when they look up the your-library import:\n\nTypeScript sees the types condition and looks up the type definition file. If you don\'t publish type definitions, omit this condition.\nSvelte-aware tooling sees the svelte condition and knows this is a Svelte component library. If you publish a library that does not export any Svelte components and that could also work in non-Svelte projects (for example a Svelte store library), you can replace this condition with default.\n\nPrevious versions of @sveltejs/package also added a package.json export. This is no longer part of the template because all tooling can now deal with a package.json not being explicitly exported.\n\n\nYou can adjust exports to your liking and provide more entry points. For example, if instead of a src/lib/index.js file that re-exported components you wanted to expose a src/lib/Foo.svelte component directly, you could create the following export map...\n\n{\n    "exports": {\n        "./Foo.svelte": {\n            "types": "./dist/Foo.svelte.d.ts",\n            "svelte": "./dist/Foo.svelte"\n        }\n    }\n}...and a consumer of your library could import the component like so:\n\nimport Foo from \'your-library/Foo.svelte\';Beware that doing this will need additional care if you provide type definitions. Read more about the caveat here\n\n\nIn general, each key of the exports map is the path the user will have to use to import something from your package, and the value is the path to the file that will be imported or a map of export conditions which in turn contains these file paths.\n\nRead more about exports here.'
		},
		{
			breadcrumbs: ['Packaging', 'Anatomy of a package.json', 'svelte'],
			href: '/docs/packaging#anatomy-of-a-package-json-svelte',
			content:
				'This is a legacy field that enabled tooling to recognise Svelte component libraries. It\'s no longer necessary when using the svelte export condition, but for backwards compatibility with outdated tooling that doesn\'t yet know about export conditions it\'s good to keep it around. It should point towards your root entry point.\n\n{\n    "svelte": "./dist/index.js"\n}'
		},
		{
			breadcrumbs: ['Packaging', 'TypeScript'],
			href: '/docs/packaging#typescript',
			content:
				'You should ship type definitions for your library even if you don\'t use TypeScript yourself so that people who do get proper intellisense when using your library. @sveltejs/package makes the process of generating types mostly opaque to you. By default, when packaging your library, type definitions are auto-generated for JavaScript, TypeScript and Svelte files. All you need to ensure is that the types condition in the exports map points to the correct files. When initialising a library project through npm create svelte@latest, this is automatically setup for the root export.\n\nIf you have something else than a root export however — for example providing a your-library/foo import — you need to take additional care for providing type definitions. Unfortunately, TypeScript by default will not resolve the types condition for an export like { &quot;./foo&quot;: { &quot;types&quot;: &quot;./dist/foo.d.ts&quot;, ... }}. Instead, it will search for a foo.d.ts relative to the root of your library (i.e. your-library/foo.d.ts instead of your-library/dist/foo.d.ts). To fix this, you have two options:\n\nThe first option is to require people using your library to set the moduleResolution option in their tsconfig.json (or jsconfig.json) to bundler (available since TypeScript 5, the best and recommended option in the future), node16 or nodenext. This opts TypeScript into actually looking at the exports map and resolving the types correctly.\n\nThe second option is to (ab)use the typesVersions feature from TypeScript to wire up the types. This is a field inside package.json TypeScript uses to check for different type definitions depending on the TypeScript version, and also contains a path mapping feature for that. We leverage that path mapping feature to get what we want. For the mentioned foo export above, the corresponding typesVersions looks like this:\n\n{\n    "exports": {\n        "./foo": {\n            "types": "./dist/foo.d.ts",\n            "svelte": "./dist/foo.js"\n        }\n    },\n    "typesVersions": {\n        ">4.0": {\n            "foo": ["./dist/foo.d.ts"]\n        }\n    }\n}>4.0 tells TypeScript to check the inner map if the used TypeScript version is greater than 4 (which should in practice always be true). The inner map tells TypeScript that the typings for your-library/foo are found within ./dist/foo.d.ts, which essentially replicates the exports condition. You also have * as a wildcard at your disposal to make many type definitions at once available without repeating yourself. Note that if you opt into typesVersions you have to declare all type imports through it, including the root import (which is defined as &quot;index&quot;: [..]).\n\nYou can read more about that feature here.'
		},
		{
			breadcrumbs: ['Packaging', 'Best practices'],
			href: '/docs/packaging#best-practices',
			content:
				'You should avoid using SvelteKit-specific modules like $app in your packages unless you intend for them to only be consumable by other SvelteKit projects. E.g. rather than using import { browser } from \'$app/environment\' you could use import { BROWSER } from \'esm-env\' (see esm-env docs). You may also wish to pass in things like the current URL or a navigation action as a prop rather than relying directly on $app/stores, $app/navigation, etc. Writing your app in this more generic fashion will also make it easier to setup tools for testing, UI demos and so on.\n\nEnsure that you add aliases via svelte.config.js (not vite.config.js or tsconfig.json), so that they are processed by svelte-package.\n\nYou should think carefully about whether or not the changes you make to your package are a bug fix, a new feature, or a breaking change, and update the package version accordingly. Note that if you remove any paths from exports or any export conditions inside them from your existing library, that should be regarded as a breaking change.\n\n{\n    "exports": {\n        ".": {\n            "types": "./dist/index.d.ts",\n// changing `svelte` to `default` is a breaking change:\n-\t\t\t"svelte": "./dist/index.js"\n+\t\t\t"default": "./dist/index.js"\n        },\n// removing this is a breaking change:\n-\t\t"./foo": {\n-\t\t\t"types": "./dist/foo.d.ts",\n-\t\t\t"svelte": "./dist/foo.js",\n-\t\t\t"default": "./dist/foo.js"\n-\t\t},\n// adding this is ok:\n+\t\t"./bar": {\n+\t\t\t"types": "./dist/bar.d.ts",\n+\t\t\t"svelte": "./dist/bar.js",\n+\t\t\t"default": "./dist/bar.js"\n+\t\t}\n    }\n}'
		},
		{
			breadcrumbs: ['Packaging', 'Options'],
			href: '/docs/packaging#options',
			content:
				"svelte-package accepts the following options:\n\n-w/--watch — watch files in src/lib for changes and rebuild the package\n-i/--input — the input directory which contains all the files of the package. Defaults to src/lib\n-o/--o — the output directory where the processed files are written to. Your package.json's exports should point to files inside there, and the files array should include that folder. Defaults to dist\n-t/--types — whether or not to create type definitions (d.ts files). We strongly recommend doing this as it fosters ecosystem library quality. Defaults to true"
		},
		{
			breadcrumbs: ['Packaging', 'Publishing'],
			href: '/docs/packaging#publishing',
			content: 'To publish the generated package:\n\nnpm publish'
		},
		{
			breadcrumbs: ['Packaging', 'Caveats'],
			href: '/docs/packaging#caveats',
			content:
				"All relative file imports need to be fully specified, adhering to Node's ESM algorithm. This means that for a file like src/lib/something/index.js, you must include the filename with the extension:\n\n-import { something } from './something';\n+import { something } from './something/index.js';If you are using TypeScript, you need to import .ts files the same way, but using a .js file ending, not a .ts file ending. (This is a TypeScript design decision outside our control.) Setting &quot;moduleResolution&quot;: &quot;NodeNext&quot; in your tsconfig.json or jsconfig.json will help you with this.\n\nAll files except Svelte files (preprocessed) and TypeScript files (transpiled to JavaScript) are copied across as-is."
		},
		{
			breadcrumbs: ['Accessibility'],
			href: '/docs/accessibility',
			content:
				"SvelteKit strives to provide an accessible platform for your app by default. Svelte's compile-time accessibility checks will also apply to any SvelteKit application you build.\n\nHere's how SvelteKit's built-in accessibility features work and what you need to do to help these features to work as well as possible. Keep in mind that while SvelteKit provides an accessible foundation, you are still responsible for making sure your application code is accessible. If you're new to accessibility, see the &quot;further reading&quot; section of this guide for additional resources.\n\nWe recognize that accessibility can be hard to get right. If you want to suggest improvements to how SvelteKit handles accessibility, please open a GitHub issue."
		},
		{
			breadcrumbs: ['Accessibility', 'Route announcements'],
			href: '/docs/accessibility#route-announcements',
			content:
				"In traditional server-rendered applications, every navigation (e.g. clicking on an <a> tag) triggers a full page reload. When this happens, screen readers and other assistive technology will read out the new page's title so that users understand that the page has changed.\n\nSince navigation between pages in SvelteKit happens without reloading the page (known as client-side routing), SvelteKit injects a live region onto the page that will read out the new page name after each navigation. This determines the page name to announce by inspecting the <title> element.\n\nBecause of this behavior, every page in your app should have a unique, descriptive title. In SvelteKit, you can do this by placing a <svelte:head> element on each page:\n\n/// file: src/routes/+page.svelte\n<svelte:head>\n    <title>Todo List</title>\n</svelte:head>This will allow screen readers and other assistive technology to identify the new page after a navigation occurs. Providing a descriptive title is also important for SEO."
		},
		{
			breadcrumbs: ['Accessibility', 'Focus management'],
			href: '/docs/accessibility#focus-management',
			content:
				"In traditional server-rendered applications, every navigation will reset focus to the top of the page. This ensures that people browsing the web with a keyboard or screen reader will start interacting with the page from the beginning.\n\nTo simulate this behavior during client-side routing, SvelteKit focuses the <body> element after each navigation and enhanced form submission. There is one exception - if an element with the autofocus attribute is present, SvelteKit will focus that element instead. Make sure to consider the implications for assistive technology when using that attribute.\n\nIf you want to customize SvelteKit's focus management, you can use the afterNavigate hook:\n\nimport { afterNavigate } from '$app/navigation';\n\nafterNavigate(() => {\n    /** @type {HTMLElement | null} */\n    const to_focus = document.querySelector('.focus-me');\n    to_focus?.focus();\n});You can also programmatically navigate to a different page using the goto function. By default, this will have the same client-side routing behavior as clicking on a link. However, goto also accepts a keepFocus option that will preserve the currently-focused element instead of resetting focus. If you enable this option, make sure the currently-focused element still exists on the page after navigation. If the element no longer exists, the user's focus will be lost, making for a confusing experience for assistive technology users."
		},
		{
			breadcrumbs: ['Accessibility', 'The "lang" attribute'],
			href: '/docs/accessibility#the-lang-attribute',
			content:
				"By default, SvelteKit's page template sets the default language of the document to English. If your content is not in English, you should update the <html> element in src/app.html to have the correct lang attribute. This will ensure that any assistive technology reading the document uses the correct pronunciation. For example, if your content is in German, you should update app.html to the following:\n\n/// file: src/app.html\n<html lang=\"de\">If your content is available in multiple languages, you should set the lang attribute based on the language of the current page. You can do this with SvelteKit's handle hook:\n\n/// file: src/app.html\n<html lang=\"%lang%\">/** @type {import('@sveltejs/kit').Handle} */\nexport function handle({ event, resolve }) {\n    return resolve(event, {\n        transformPageChunk: ({ html }) => html.replace('%lang%', get_lang(event))\n    });\n}"
		},
		{
			breadcrumbs: ['Accessibility', 'Further reading'],
			href: '/docs/accessibility#further-reading',
			content:
				'For the most part, building an accessible SvelteKit app is the same as building an accessible web app. You should be able to apply information from the following general accessibility resources to any web experience you build:\n\nMDN Web Docs: Accessibility\nThe A11y Project\nHow to Meet WCAG (Quick Reference)'
		},
		{
			breadcrumbs: ['SEO'],
			href: '/docs/seo',
			content:
				'The most important aspect of SEO is to create high-quality content that is widely linked to from around the web. However, there are a few technical considerations for building sites that rank well.'
		},
		{ breadcrumbs: ['SEO', 'Out of the box'], href: '/docs/seo#out-of-the-box', content: '' },
		{
			breadcrumbs: ['SEO', 'Out of the box', 'SSR'],
			href: '/docs/seo#out-of-the-box-ssr',
			content:
				"While search engines have got better in recent years at indexing content that was rendered with client-side JavaScript, server-side rendered content is indexed more frequently and reliably. SvelteKit employs SSR by default, and while you can disable it in handle, you should leave it on unless you have a good reason not to.\n\nSvelteKit's rendering is highly configurable and you can implement dynamic rendering if necessary. It's not generally recommended, since SSR has other benefits beyond SEO."
		},
		{
			breadcrumbs: ['SEO', 'Out of the box', 'Performance'],
			href: '/docs/seo#out-of-the-box-performance',
			content:
				"Signals such as Core Web Vitals impact search engine ranking. Because Svelte and SvelteKit introduce minimal overhead, it's easier to build high performance sites. You can test your site's performance using Google's PageSpeed Insights or Lighthouse."
		},
		{
			breadcrumbs: ['SEO', 'Out of the box', 'Normalized URLs'],
			href: '/docs/seo#out-of-the-box-normalized-urls',
			content:
				'SvelteKit redirects pathnames with trailing slashes to ones without (or vice versa depending on your configuration), as duplicate URLs are bad for SEO.'
		},
		{ breadcrumbs: ['SEO', 'Manual setup'], href: '/docs/seo#manual-setup', content: '' },
		{
			breadcrumbs: ['SEO', 'Manual setup', '&lt;title&gt; and &lt;meta&gt;'],
			href: '/docs/seo#manual-setup-title-and-meta',
			content:
				"Every page should have well-written and unique <title> and <meta name=&quot;description&quot;> elements inside a <svelte:head>. Guidance on how to write descriptive titles and descriptions, along with other suggestions on making content understandable by search engines, can be found on Google's Lighthouse SEO audits documentation.\n\nA common pattern is to return SEO-related data from page load functions, then use it (as $page.data) in a <svelte:head> in your root layout."
		},
		{
			breadcrumbs: ['SEO', 'Manual setup', 'Structured data'],
			href: '/docs/seo#manual-setup-structured-data',
			content:
				"Structured data helps search engines understand the content of a page. If you're using structured data alongside svelte-preprocess, you will need to explicitly preserve ld+json data (this may change in future):\n\nimport preprocess from 'svelte-preprocess';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    preprocess: preprocess({\n        preserve: ['ld+json']\n        // ...\n    })\n};\n\nexport default config;"
		},
		{
			breadcrumbs: ['SEO', 'Manual setup', 'Sitemaps'],
			href: '/docs/seo#manual-setup-sitemaps',
			content:
				'Sitemaps help search engines prioritize pages within your site, particularly when you have a large amount of content. You can create a sitemap dynamically using an endpoint:\n\n/// file: src/routes/sitemap.xml/+server.js\nexport async function GET() {\n    return new Response(\n        `\n        <?xml version="1.0" encoding="UTF-8" ?>\n        <urlset\n            xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"\n            xmlns:xhtml="https://www.w3.org/1999/xhtml"\n            xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"\n            xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"\n            xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"\n            xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"\n        >\n            <!-- <url> elements go here -->\n        </urlset>`.trim(),\n        {\n            headers: {\n                \'Content-Type\': \'application/xml\'\n            }\n        }\n    );\n}'
		},
		{
			breadcrumbs: ['SEO', 'Manual setup', 'AMP'],
			href: '/docs/seo#manual-setup-amp',
			content:
				"An unfortunate reality of modern web development is that it is sometimes necessary to create an Accelerated Mobile Pages (AMP) version of your site. In SvelteKit this can be done by setting the inlineStyleThreshold option...\n\n/// file: svelte.config.js\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        // since <link rel=\"stylesheet\"> isn't\n        // allowed, inline all styles\n        inlineStyleThreshold: Infinity\n    }\n};\n\nexport default config;...disabling csr in your root +layout.js/+layout.server.js...\n\n/// file: src/routes/+layout.server.js\nexport const csr = false;...and transforming the HTML using transformPageChunk along with transform imported from @sveltejs/amp:\n\nimport * as amp from '@sveltejs/amp';\n\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    let buffer = '';\n    return resolve(event, {\n        transformPageChunk: ({ html, done }) => {\n            buffer += html;\n            if (done) return amp.transform(html);\n        }\n    });\n}It's a good idea to use the handle hook to validate the transformed HTML using amphtml-validator, but only if you're prerendering pages since it's very slow."
		},
		{
			breadcrumbs: ['Configuration'],
			href: '/docs/configuration',
			content:
				"Your project's configuration lives in a svelte.config.js file at the root of your project. As well as SvelteKit, this config object is used by other tooling that integrates with Svelte such as editor extensions.\n\nimport adapter from '@sveltejs/adapter-auto';\n\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        adapter: adapter()\n    }\n};\n\nexport default config;\ninterface Config {/*…*/}\ncompilerOptions?: CompileOptions;\n\n\ndefault\n {}\n\n\nOptions passed to svelte.compile.\n\n\n\nextensions?: string[];\n\n\ndefault\n [&quot;.svelte&quot;]\n\n\nList of file extensions that should be treated as Svelte files.\n\n\n\nkit?: KitConfig;\nSvelteKit options\n\n\n\npackage?: {\n    source?: string;\n    dir?: string;\n    emitTypes?: boolean;\n    exports?(filepath: string): boolean;\n    files?(filepath: string): boolean;\n};\n@sveltejs/package options.\n\n\n\npreprocess?: any;\nPreprocessor options, if any. Preprocessing can alternatively also be done through Vite's preprocessor capabilities.\n\n\n\n[key: string]: any;\nAny additional options required by tooling that integrates with Svelte.\n\n\nThe kit property configures SvelteKit, and can have the following properties:\n\nadapter\n\n\ndefault\n undefined\n\n\nYour adapter is run when executing vite build. It determines how the output is converted for different platforms.\n\n\n\nalias\n\n\ndefault\n {}\n\n\nAn object containing zero or more aliases used to replace values in import statements. These aliases are automatically passed to Vite and TypeScript.\n\n// @errors: 7031\n/// file: svelte.config.js\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        alias: {\n            // this will match a file\n            'my-file': 'path/to/my-file.js',\n\n            // this will match a directory and its contents\n            // (`my-directory/x` resolves to `path/to/my-directory/x`)\n            'my-directory': 'path/to/my-directory',\n\n            // an alias ending /* will only match\n            // the contents of a directory, not the directory itself\n            'my-directory/*': 'path/to/my-directory/*'\n        }\n    }\n};The built-in $lib alias is controlled by config.kit.files.lib as it is used for packaging.\n\n\nYou will need to run npm run dev to have SvelteKit automatically generate the required alias configuration in jsconfig.json or tsconfig.json.\n\n\n\n\nappDir\n\n\ndefault\n &quot;_app&quot;\n\n\nThe directory relative to paths.assets where the built JS and CSS (and imported assets) are served from. (The filenames therein contain content-based hashes, meaning they can be cached indefinitely). Must not start or end with /.\n\n\n\ncsp\n\n\nContent Security Policy configuration. CSP helps to protect your users against cross-site scripting (XSS) attacks, by limiting the places resources can be loaded from. For example, a configuration like this...\n\n// @errors: 7031\n/// file: svelte.config.js\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        csp: {\n            directives: {\n                'script-src': ['self']\n            },\n            reportOnly: {\n                'script-src': ['self']\n            }\n        }\n    }\n};\n\nexport default config;...would prevent scripts loading from external sites. SvelteKit will augment the specified directives with nonces or hashes (depending on mode) for any inline styles and scripts it generates.\n\nTo add a nonce for scripts and links manually included in src/app.html, you may use the placeholder %sveltekit.nonce% (for example <script nonce=&quot;%sveltekit.nonce%&quot;>).\n\nWhen pages are prerendered, the CSP header is added via a <meta http-equiv> tag (note that in this case, frame-ancestors, report-uri and sandbox directives will be ignored).\n\nWhen mode is 'auto', SvelteKit will use nonces for dynamically rendered pages and hashes for prerendered pages. Using nonces with prerendered pages is insecure and therefore forbidden.\n\n\nNote that most Svelte transitions work by creating an inline <style> element. If you use these in your app, you must either leave the style-src directive unspecified or add unsafe-inline.\n\n\nIf this level of configuration is insufficient and you have more dynamic requirements, you can use the handle hook to roll your own CSP.\n\n\n\nmode?: 'hash' | 'nonce' | 'auto';\nWhether to use hashes or nonces to restrict <script> and <style> elements. 'auto' will use hashes for prerendered pages, and nonces for dynamically rendered pages.\n\n\ndirectives?: CspDirectives;\nDirectives that will be added to Content-Security-Policy headers.\n\n\nreportOnly?: CspDirectives;\nDirectives that will be added to Content-Security-Policy-Report-Only headers.\n\n\n\ncsrf\n\n\nProtection against cross-site request forgery (CSRF) attacks.\n\n\n\ncheckOrigin?: boolean;\n\n\ndefault\n true\n\n\nWhether to check the incoming origin header for POST, PUT, PATCH, or DELETE form submissions and verify that it matches the server's origin.\n\nTo allow people to make POST, PUT, PATCH, or DELETE requests with a Content-Type of application/x-www-form-urlencoded, multipart/form-data, or text/plain to your app from other origins, you will need to disable this option. Be careful!\n\n\n\nembedded\n\n\ndefault\n false\n\n\nWhether or not the app is embedded inside a larger app. If true, SvelteKit will add its event listeners related to navigation etc on the parent of %sveltekit.body% instead of window, and will pass params from the server rather than inferring them from location.pathname.\n\n\n\nenv\n\n\nEnvironment variable configuration\n\n\n\ndir?: string;\n\n\ndefault\n &quot;.&quot;\n\n\nThe directory to search for .env files.\n\n\npublicPrefix?: string;\n\n\ndefault\n &quot;PUBLIC_&quot;\n\n\nA prefix that signals that an environment variable is safe to expose to client-side code. See $env/static/public and $env/dynamic/public. Note that Vite's envPrefix must be set separately if you are using Vite's environment variable handling - though use of that feature should generally be unnecessary.\n\n\n\nfiles\n\n\nWhere to find various files within your project.\n\n\n\nassets?: string;\n\n\ndefault\n &quot;static&quot;\n\n\na place to put static files that should have stable URLs and undergo no processing, such as favicon.ico or manifest.json\n\n\nhooks?: {/*…*/}\n\nclient?: string;\n\n\ndefault\n &quot;src/hooks.client&quot;\n\n\nThe location of your client hooks.\n\n\nserver?: string;\n\n\ndefault\n &quot;src/hooks.server&quot;\n\n\nThe location of your server hooks.\n\n\nlib?: string;\n\n\ndefault\n &quot;src/lib&quot;\n\n\nyour app's internal library, accessible throughout the codebase as $lib\n\n\nparams?: string;\n\n\ndefault\n &quot;src/params&quot;\n\n\na directory containing parameter matchers\n\n\nroutes?: string;\n\n\ndefault\n &quot;src/routes&quot;\n\n\nthe files that define the structure of your app (see Routing)\n\n\nserviceWorker?: string;\n\n\ndefault\n &quot;src/service-worker&quot;\n\n\nthe location of your service worker's entry point (see Service workers)\n\n\nappTemplate?: string;\n\n\ndefault\n &quot;src/app.html&quot;\n\n\nthe location of the template for HTML responses\n\n\nerrorTemplate?: string;\n\n\ndefault\n &quot;src/error.html&quot;\n\n\nthe location of the template for fallback error responses\n\n\n\ninlineStyleThreshold\n\n\ndefault\n 0\n\n\nInline CSS inside a <style> block at the head of the HTML. This option is a number that specifies the maximum length of a CSS file to be inlined. All CSS files needed for the page and smaller than this value are merged and inlined in a <style> block.\n\nThis results in fewer initial requests and can improve your First Contentful Paint score. However, it generates larger HTML output and reduces the effectiveness of browser caches. Use it advisedly.\n\n\n\n\nmoduleExtensions\n\n\ndefault\n [&quot;.js&quot;, &quot;.ts&quot;]\n\n\nAn array of file extensions that SvelteKit will treat as modules. Files with extensions that match neither config.extensions nor config.kit.moduleExtensions will be ignored by the router.\n\n\n\noutDir\n\n\ndefault\n &quot;.svelte-kit&quot;\n\n\nThe directory that SvelteKit writes files to during dev and build. You should exclude this directory from version control.\n\n\n\noutput\n\n\nOptions related to the build output format\n\n\n\npreloadStrategy?: 'modulepreload' | 'preload-js' | 'preload-mjs';\n\n\ndefault\n &quot;modulepreload&quot;\n\n\nSvelteKit will preload the JavaScript modules needed for the initial page to avoid import 'waterfalls', resulting in faster application startup. There\nare three strategies with different trade-offs:\n\nmodulepreload - uses <link rel=&quot;modulepreload&quot;>. This delivers the best results in Chromium-based browsers, but is currently ignored by Firefox and Safari (though support is coming to Safari soon).\npreload-js - uses <link rel=&quot;preload&quot;>. Prevents waterfalls in Chromium and Safari, but Chromium will parse each module twice (once as a script, once as a module). Causes modules to be requested twice in Firefox. This is a good setting if you want to maximise performance for users on iOS devices at the cost of a very slight degradation for Chromium users.\npreload-mjs - uses <link rel=&quot;preload&quot;> but with the .mjs extension which prevents double-parsing in Chromium. Some static webservers will fail to serve .mjs files with a Content-Type: application/javascript header, which will cause your application to break. If that doesn't apply to you, this is the option that will deliver the best performance for the largest number of users, until modulepreload is more widely supported.\n\n\n\npaths\n\n\n\n\nassets?: '' | `http://${string}` | `https://${string}`;\n\n\ndefault\n &quot;&quot;\n\n\nAn absolute path that your app's files are served from. This is useful if your files are served from a storage bucket of some kind.\n\n\nbase?: '' | `/${string}`;\n\n\ndefault\n &quot;&quot;\n\n\nA root-relative path that must start, but not end with / (e.g. /base-path), unless it is the empty string. This specifies where your app is served from and allows the app to live on a non-root path. Note that you need to prepend all your root-relative links with the base value or they will point to the root of your domain, not your base (this is how the browser works). You can use base from $app/paths for that: <a href=&quot;{base}/your-page&quot;>Link</a>. If you find yourself writing this often, it may make sense to extract this into a reusable component.\n\n\nrelative?: boolean | undefined;\n\n\ndefault\n undefined\n\n\nWhether to use relative asset paths. By default, if paths.assets is not external, SvelteKit will replace %sveltekit.assets% with a relative path and use relative paths to reference build artifacts, but base and assets imported from $app/paths will be as specified in your config.\n\nIf true, base and assets imported from $app/paths will be replaced with relative asset paths during server-side rendering, resulting in portable HTML.\nIf false, %sveltekit.assets% and references to build artifacts will always be root-relative paths, unless paths.assets is an external URL\n\nIf your app uses a <base> element, you should set this to false, otherwise asset URLs will incorrectly be resolved against the <base> URL rather than the current page.\n\n\n\nprerender\n\n\nSee Prerendering.\n\n\n\nconcurrency?: number;\n\n\ndefault\n 1\n\n\nHow many pages can be prerendered simultaneously. JS is single-threaded, but in cases where prerendering performance is network-bound (for example loading content from a remote CMS) this can speed things up by processing other tasks while waiting on the network response.\n\n\ncrawl?: boolean;\n\n\ndefault\n true\n\n\nWhether SvelteKit should find pages to prerender by following links from entries.\n\n\nentries?: Array<'*' | `/${string}`>;\n\n\ndefault\n [&quot;*&quot;]\n\n\nAn array of pages to prerender, or start crawling from (if crawl: true). The * string includes all non-dynamic routes (i.e. pages with no [parameters], because SvelteKit doesn't know what value the parameters should have).\n\n\nhandleHttpError?: PrerenderHttpErrorHandlerValue;\n\n\ndefault\n &quot;fail&quot;\n\n\nHow to respond to HTTP errors encountered while prerendering the app.\n\n'fail' — fail the build\n'ignore' - silently ignore the failure and continue\n'warn' — continue, but print a warning\n(details) => void — a custom error handler that takes a details object with status, path, referrer, referenceType and message properties. If you throw from this function, the build will fail\n\n// @errors: 7031\n/// file: svelte.config.js\n/** @type {import('@sveltejs/kit').Config} */\nconst config = {\n    kit: {\n        prerender: {\n            handleHttpError: ({ path, referrer, message }) => {\n                // ignore deliberate link to shiny 404 page\n                if (path === '/not-found' && referrer === '/blog/how-we-built-our-404-page') {\n                    return;\n                }\n\n                // otherwise fail the build\n                throw new Error(message);\n            }\n        }\n    }\n};\nhandleMissingId?: PrerenderMissingIdHandlerValue;\n\n\ndefault\n &quot;fail&quot;\n\n\nHow to respond to hash links from one prerendered page to another that don't correspond to an id on the destination page\n\n'fail' — fail the build\n'ignore' - silently ignore the failure and continue\n'warn' — continue, but print a warning\n(details) => void — a custom error handler that takes a details object with path, id, referrers and message properties. If you throw from this function, the build will fail\n\n\norigin?: string;\n\n\ndefault\n &quot;http://sveltekit-prerender&quot;\n\n\nThe value of url.origin during prerendering; useful if it is included in rendered content.\n\n\n\nserviceWorker\n\n\n\n\nregister?: boolean;\n\n\ndefault\n true\n\n\nWhether to automatically register the service worker, if it exists.\n\n\nfiles?(filepath: string): boolean;\n\n\ndefault\n (filename) => !/\\.DS_Store/.test(filename)\n\n\nDetermine which files in your static directory will be available in $service-worker.files.\n\n\n\ntypescript\n\n\n\n\nconfig?: (config: Record<string, any>) => Record<string, any> | void;\n\n\ndefault\n (config) => config\n\n\nA function that allows you to edit the generated tsconfig.json. You can mutate the config (recommended) or return a new one.\nThis is useful for extending a shared tsconfig.json in a monorepo root, for example.\n\n\n\nversion\n\n\nClient-side navigation can be buggy if you deploy a new version of your app while people are using it. If the code for the new page is already loaded, it may have stale content; if it isn't, the app's route manifest may point to a JavaScript file that no longer exists.\nSvelteKit helps you solve this problem through version management.\nIf SvelteKit encounters an error while loading the page and detects that a new version has been deployed (using the name specified here, which defaults to a timestamp of the build) it will fall back to traditional full-page navigation.\nNot all navigations will result in an error though, for example if the JavaScript for the next page is already loaded. If you still want to force a full-page navigation in these cases, use techniques such as setting the pollInterval and then using beforeNavigate:\n\n/// +layout.svelte\n<script>\nimport { beforeNavigate } from '$app/navigation';\nimport { updated } from '$app/stores';\n\nbeforeNavigate(({ willUnload, to }) => {\n    if ($updated && !willUnload && to?.url) {\n        location.href = to.url.href;\n    }\n});\n</script>If you set pollInterval to a non-zero value, SvelteKit will poll for new versions in the background and set the value of the updated store to true when it detects one.\n\n\n\nname?: string;\nThe current app version string. If specified, this must be deterministic (e.g. a commit ref rather than Math.random() or Date.now().toString()), otherwise defaults to a timestamp of the build.\n\nFor example, to use the current commit hash, you could do use git rev-parse HEAD:\n\n// @errors: 7031\n/// file: svelte.config.js\nimport * as child_process from 'node:child_process';\n\nexport default {\n    kit: {\n        version: {\n            name: child_process.execSync('git rev-parse HEAD').toString().trim()\n        }\n    }\n};\npollInterval?: number;\n\n\ndefault\n 0\n\n\nThe interval in milliseconds to poll for version changes. If this is 0, no polling occurs."
		},
		{
			breadcrumbs: ['Command Line Interface'],
			href: '/docs/cli',
			content:
				"SvelteKit projects use Vite, meaning you'll mostly use its CLI (albeit via npm run dev/build/preview scripts):\n\nvite dev — start a development server\nvite build — build a production version of your app\nvite preview — run the production version locally\n\nHowever SvelteKit includes its own CLI for initialising your project:"
		},
		{
			breadcrumbs: ['Command Line Interface', 'svelte-kit sync'],
			href: '/docs/cli#svelte-kit-sync',
			content:
				'svelte-kit sync creates the tsconfig.json and all generated types (which you can import as ./$types inside routing files) for your project. When you create a new project, it is listed as the prepare script and will be run automatically as part of the npm lifecycle, so you should not ordinarily have to run this command.'
		},
		{
			breadcrumbs: ['Modules'],
			href: '/docs/modules',
			content: 'SvelteKit makes a number of modules available to your application.'
		},
		{
			breadcrumbs: ['Modules', '$app/environment'],
			href: '/docs/modules#$app-environment',
			content: "import { browser, building, dev, version } from '$app/environment';"
		},
		{
			breadcrumbs: ['Modules', '$app/environment', 'browser'],
			href: '/docs/modules#$app-environment-browser',
			content: 'true if the app is running in the browser.\n\n\nconst browser: boolean;'
		},
		{
			breadcrumbs: ['Modules', '$app/environment', 'building'],
			href: '/docs/modules#$app-environment-building',
			content:
				'SvelteKit analyses your app during the build step by running it. During this process, building is true. This also applies during prerendering.\n\n\nconst building: boolean;'
		},
		{
			breadcrumbs: ['Modules', '$app/environment', 'dev'],
			href: '/docs/modules#$app-environment-dev',
			content:
				'Whether the dev server is running. This is not guaranteed to correspond to NODE_ENV or MODE.\n\n\nconst dev: boolean;'
		},
		{
			breadcrumbs: ['Modules', '$app/environment', 'version'],
			href: '/docs/modules#$app-environment-version',
			content: 'The value of config.kit.version.name.\n\n\nconst version: string;'
		},
		{
			breadcrumbs: ['Modules', '$app/forms'],
			href: '/docs/modules#$app-forms',
			content: "import { applyAction, deserialize, enhance } from '$app/forms';"
		},
		{
			breadcrumbs: ['Modules', '$app/forms', 'applyAction'],
			href: '/docs/modules#$app-forms-applyaction',
			content:
				'This action updates the form property of the current page with the given data and updates $page.status.\nIn case of an error, it redirects to the nearest error page.\n\n\nfunction applyAction<\n    Success extends Record<string, unknown> | undefined = Record<string, any>,\n    Invalid extends Record<string, unknown> | undefined = Record<string, any>\n>(result: ActionResult<Success, Invalid>): Promise<void>;'
		},
		{
			breadcrumbs: ['Modules', '$app/forms', 'deserialize'],
			href: '/docs/modules#$app-forms-deserialize',
			content:
				"Use this function to deserialize the response from a form submission.\nUsage:\n\nimport { deserialize } from '$app/forms';\n\nasync function handleSubmit(event) {\n  const response = await fetch('/form?/action', {\n    method: 'POST',\n    body: new FormData(event.target)\n  });\n\n  const result = deserialize(await response.text());\n  // ...\n}\nfunction deserialize<\n    Success extends Record<string, unknown> | undefined = Record<string, any>,\n    Invalid extends Record<string, unknown> | undefined = Record<string, any>\n>(serialized: string): ActionResult<Success, Invalid>;"
		},
		{
			breadcrumbs: ['Modules', '$app/forms', 'enhance'],
			href: '/docs/modules#$app-forms-enhance',
			content:
				"This action enhances a <form> element that otherwise would work without JavaScript.\n\n\nfunction enhance<\n    Success extends Record<string, unknown> | undefined = Record<string, any>,\n    Invalid extends Record<string, unknown> | undefined = Record<string, any>\n>(\n    form: HTMLFormElement,\n    /**\n     * Called upon submission with the given FormData and the `action` that should be triggered.\n     * If `cancel` is called, the form will not be submitted.\n     * You can use the abort `controller` to cancel the submission in case another one starts.\n     * If a function is returned, that function is called with the response from the server.\n     * If nothing is returned, the fallback will be used.\n     *\n     * If this function or its return value isn't set, it\n     * - falls back to updating the `form` prop with the returned data if the action is one same page as the form\n     * - updates `$page.status`\n     * - resets the `<form>` element and invalidates all data in case of successful submission with no redirect response\n     * - redirects in case of a redirect response\n     * - redirects to the nearest error page in case of an unexpected error\n     *\n     * If you provide a custom function with a callback and want to use the default behavior, invoke `update` in your callback.\n     */\n    submit?: SubmitFunction<Success, Invalid>\n): { destroy(): void };"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation'],
			href: '/docs/modules#$app-navigation',
			content:
				"import {\n    afterNavigate,\n    beforeNavigate,\n    disableScrollHandling,\n    goto,\n    invalidate,\n    invalidateAll,\n    preloadCode,\n    preloadData\n} from '$app/navigation';"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'afterNavigate'],
			href: '/docs/modules#$app-navigation-afternavigate',
			content:
				'A lifecycle function that runs the supplied callback when the current component mounts, and also whenever we navigate to a new URL.\n\nafterNavigate must be called during a component initialization. It remains active as long as the component is mounted.\n\n\nfunction afterNavigate(callback: (navigation: AfterNavigate) => void): void;'
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'beforeNavigate'],
			href: '/docs/modules#$app-navigation-beforenavigate',
			content:
				"A navigation interceptor that triggers before we navigate to a new URL, whether by clicking a link, calling goto(...), or using the browser back/forward controls.\nCalling cancel() will prevent the navigation from completing. If the navigation would have directly unloaded the current page, calling cancel will trigger the native\nbrowser unload confirmation dialog. In these cases, navigation.willUnload is true.\n\nWhen a navigation isn't client side, navigation.to.route.id will be null.\n\nbeforeNavigate must be called during a component initialization. It remains active as long as the component is mounted.\n\n\nfunction beforeNavigate(callback: (navigation: BeforeNavigate) => void): void;"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'disableScrollHandling'],
			href: '/docs/modules#$app-navigation-disablescrollhandling',
			content:
				"If called when the page is being updated following a navigation (in onMount or afterNavigate or an action, for example), this disables SvelteKit's built-in scroll handling.\nThis is generally discouraged, since it breaks user expectations.\n\n\nfunction disableScrollHandling(): void;"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'goto'],
			href: '/docs/modules#$app-navigation-goto',
			content:
				'Returns a Promise that resolves when SvelteKit navigates (or fails to navigate, in which case the promise rejects) to the specified url.\nFor external URLs, use window.location = url instead of calling goto(url).\n\n\nfunction goto(\n    url: string | URL,\n    opts?: {\n        /**\n         * If `true`, will replace the current `history` entry rather than creating a new one with `pushState`\n         */\n        replaceState?: boolean;\n        /**\n         * If `true`, the browser will maintain its scroll position rather than scrolling to the top of the page after navigation\n         */\n        noScroll?: boolean;\n        /**\n         * If `true`, the currently focused element will retain focus after navigation. Otherwise, focus will be reset to the body\n         */\n        keepFocus?: boolean;\n        /**\n         * The state of the new/updated history entry\n         */\n        state?: any;\n        /**\n         * If `true`, all `load` functions of the page will be rerun. See https://kit.svelte.dev/docs/load#rerunning-load-functions for more info on invalidation.\n         */\n        invalidateAll?: boolean;\n    }\n): Promise<void>;'
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'invalidate'],
			href: '/docs/modules#$app-navigation-invalidate',
			content:
				"Causes any load functions belonging to the currently active page to re-run if they depend on the url in question, via fetch or depends. Returns a Promise that resolves when the page is subsequently updated.\n\nIf the argument is given as a string or URL, it must resolve to the same URL that was passed to fetch or depends (including query parameters).\nTo create a custom identifier, use a string beginning with [a-z]+: (e.g. custom:state) — this is a valid URL.\n\nThe function argument can be used define a custom predicate. It receives the full URL and causes load to rerun if true is returned.\nThis can be useful if you want to invalidate based on a pattern instead of a exact match.\n\n// Example: Match '/path' regardless of the query parameters\nimport { invalidate } from '$app/navigation';\n\ninvalidate((url) => url.pathname === '/path');\nfunction invalidate(url: string | URL | ((url: URL) => boolean)): Promise<void>;"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'invalidateAll'],
			href: '/docs/modules#$app-navigation-invalidateall',
			content:
				'Causes all load functions belonging to the currently active page to re-run. Returns a Promise that resolves when the page is subsequently updated.\n\n\nfunction invalidateAll(): Promise<void>;'
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'preloadCode'],
			href: '/docs/modules#$app-navigation-preloadcode',
			content:
				"Programmatically imports the code for routes that haven't yet been fetched.\nTypically, you might call this to speed up subsequent navigation.\n\nYou can specify routes by any matching pathname such as /about (to match src/routes/about/+page.svelte) or /blog/* (to match src/routes/blog/[slug]/+page.svelte).\n\nUnlike preloadData, this won't call load functions.\nReturns a Promise that resolves when the modules have been imported.\n\n\nfunction preloadCode(...urls: string[]): Promise<void>;"
		},
		{
			breadcrumbs: ['Modules', '$app/navigation', 'preloadData'],
			href: '/docs/modules#$app-navigation-preloaddata',
			content:
				"Programmatically preloads the given page, which means\n\nensuring that the code for the page is loaded, and\ncalling the page's load function with the appropriate options.\n\nThis is the same behaviour that SvelteKit triggers when the user taps or mouses over an <a> element with data-sveltekit-preload-data.\nIf the next navigation is to href, the values returned from load will be used, making navigation instantaneous.\nReturns a Promise that resolves when the preload is complete.\n\n\nfunction preloadData(href: string): Promise<void>;"
		},
		{
			breadcrumbs: ['Modules', '$app/paths'],
			href: '/docs/modules#$app-paths',
			content: "import { assets, base } from '$app/paths';"
		},
		{
			breadcrumbs: ['Modules', '$app/paths', 'assets'],
			href: '/docs/modules#$app-paths-assets',
			content:
				"An absolute path that matches config.kit.paths.assets.\n\nIf a value for config.kit.paths.assets is specified, it will be replaced with '/_svelte_kit_assets' during vite dev or vite preview, since the assets don't yet live at their eventual URL.\n\n\n\nconst assets: `https://${string}` | `http://${string}`;"
		},
		{
			breadcrumbs: ['Modules', '$app/paths', 'base'],
			href: '/docs/modules#$app-paths-base',
			content:
				'A string that matches config.kit.paths.base.\n\nExample usage: <a href=&quot;{base}/your-page&quot;>Link</a>\n\n\nconst base: `/${string}`;'
		},
		{
			breadcrumbs: ['Modules', '$app/stores'],
			href: '/docs/modules#$app-stores',
			content:
				"import { getStores, navigating, page, updated } from '$app/stores';These stores are contextual on the server — they are added to the context of your root component. This means that page is unique to each request, rather than shared between multiple requests handled by the same server simultaneously.\n\nBecause of that, you must subscribe to the stores during component initialization (which happens automatically if you reference the store value, e.g. as $page, in a component) before you can use them.\n\nIn the browser, we don't need to worry about this, and stores can be accessed from anywhere. Code that will only ever run on the browser can refer to (or subscribe to) any of these stores at any time.\n\nYou can read more about client/server differences in the state management documentation."
		},
		{
			breadcrumbs: ['Modules', '$app/stores', 'getStores'],
			href: '/docs/modules#$app-stores-getstores',
			content:
				'A function that returns all of the contextual stores. On the server, this must be called during component initialization.\nOnly use this if you need to defer store subscription until after the component has mounted, for some reason.\n\n\nfunction getStores(): {\n    navigating: typeof navigating;\n    page: typeof page;\n    updated: typeof updated;\n};'
		},
		{
			breadcrumbs: ['Modules', '$app/stores', 'navigating'],
			href: '/docs/modules#$app-stores-navigating',
			content:
				"A readable store.\nWhen navigating starts, its value is a Navigation object with from, to, type and (if type === 'popstate') delta properties.\nWhen navigating finishes, its value reverts to null.\n\nOn the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.\n\n\nconst navigating: Readable<Navigation | null>;"
		},
		{
			breadcrumbs: ['Modules', '$app/stores', 'page'],
			href: '/docs/modules#$app-stores-page',
			content:
				'A readable store whose value contains page data.\n\nOn the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.\n\n\nconst page: Readable<Page>;'
		},
		{
			breadcrumbs: ['Modules', '$app/stores', 'updated'],
			href: '/docs/modules#$app-stores-updated',
			content:
				'A readable store whose initial value is false. If version.pollInterval is a non-zero value, SvelteKit will poll for new versions of the app and update the store value to true when it detects one. updated.check() will force an immediate check, regardless of polling.\n\nOn the server, this store can only be subscribed to during component initialization. In the browser, it can be subscribed to at any time.\n\n\nconst updated: Readable<boolean> & { check(): Promise<boolean> };'
		},
		{
			breadcrumbs: ['Modules', '$env/dynamic/private'],
			href: '/docs/modules#$env-dynamic-private',
			content:
				"This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using adapter-node (or running vite preview), this is equivalent to process.env. This module only includes variables that do not begin with config.kit.env.publicPrefix.\n\nThis module cannot be imported into client-side code.\n\nimport { env } from '$env/dynamic/private';\nconsole.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);In dev, $env/dynamic always includes environment variables from .env. In prod, this behavior will depend on your adapter."
		},
		{
			breadcrumbs: ['Modules', '$env/dynamic/public'],
			href: '/docs/modules#$env-dynamic-public',
			content:
				"Similar to $env/dynamic/private, but only includes variables that begin with config.kit.env.publicPrefix (which defaults to PUBLIC_), and can therefore safely be exposed to client-side code.\n\nNote that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use $env/static/public instead.\n\nimport { env } from '$env/dynamic/public';\nconsole.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);"
		},
		{
			breadcrumbs: ['Modules', '$env/static/private'],
			href: '/docs/modules#$env-static-private',
			content:
				'Environment variables loaded by Vite from .env files and process.env. Like $env/dynamic/private, this module cannot be imported into client-side code. This module only includes variables that do not begin with config.kit.env.publicPrefix.\n\nUnlike $env/dynamic/private, the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.\n\nimport { API_KEY } from \'$env/static/private\';Note that all environment variables referenced in your code should be declared (for example in an .env file), even if they don\'t have a value until the app is deployed:\n\nMY_FEATURE_FLAG=""You can override .env values from the command line like so:\n\nMY_FEATURE_FLAG="enabled" npm run dev'
		},
		{
			breadcrumbs: ['Modules', '$env/static/public'],
			href: '/docs/modules#$env-static-public',
			content:
				"Similar to $env/static/private, except that it only includes environment variables that begin with config.kit.env.publicPrefix (which defaults to PUBLIC_), and can therefore safely be exposed to client-side code.\n\nValues are replaced statically at build time.\n\nimport { PUBLIC_BASE_URL } from '$env/static/public';"
		},
		{
			breadcrumbs: ['Modules', '$lib'],
			href: '/docs/modules#$lib',
			content:
				'This is a simple alias to src/lib, or whatever directory is specified as config.kit.files.lib. It allows you to access common components and utility modules without ../../../../ nonsense.'
		},
		{
			breadcrumbs: ['Modules', '$lib', '`$lib/server`'],
			href: '/docs/modules#$lib-$lib-server',
			content:
				'A subdirectory of $lib. SvelteKit will prevent you from importing any modules in $lib/server into client-side code. See server-only modules.'
		},
		{
			breadcrumbs: ['Modules', '$service-worker'],
			href: '/docs/modules#$service-worker',
			content:
				"import { base, build, files, prerendered, version } from '$service-worker';This module is only available to service workers."
		},
		{
			breadcrumbs: ['Modules', '$service-worker', 'base'],
			href: '/docs/modules#$service-worker-base',
			content:
				'The base path of the deployment. Typically this is equivalent to config.kit.paths.base, but it is calculated from location.pathname meaning that it will continue to work correctly if the site is deployed to a subdirectory.\nNote that there is a base but no assets, since service workers cannot be used if config.kit.paths.assets is specified.\n\n\nconst base: string;'
		},
		{
			breadcrumbs: ['Modules', '$service-worker', 'build'],
			href: '/docs/modules#$service-worker-build',
			content:
				'An array of URL strings representing the files generated by Vite, suitable for caching with cache.addAll(build).\nDuring development, this is an empty array.\n\n\nconst build: string[];'
		},
		{
			breadcrumbs: ['Modules', '$service-worker', 'files'],
			href: '/docs/modules#$service-worker-files',
			content:
				'An array of URL strings representing the files in your static directory, or whatever directory is specified by config.kit.files.assets. You can customize which files are included from static directory using config.kit.serviceWorker.files\n\n\nconst files: string[];'
		},
		{
			breadcrumbs: ['Modules', '$service-worker', 'prerendered'],
			href: '/docs/modules#$service-worker-prerendered',
			content:
				'An array of pathnames corresponding to prerendered pages and endpoints.\nDuring development, this is an empty array.\n\n\nconst prerendered: string[];'
		},
		{
			breadcrumbs: ['Modules', '$service-worker', 'version'],
			href: '/docs/modules#$service-worker-version',
			content:
				"See config.kit.version. It's useful for generating unique cache names inside your service worker, so that a later deployment of your app can invalidate old caches.\n\n\nconst version: string;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit'],
			href: '/docs/modules#sveltejs-kit',
			content: "import { error, fail, json, redirect, text } from '@sveltejs/kit';"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'error'],
			href: '/docs/modules#sveltejs-kit-error',
			content:
				"Creates an HttpError object with an HTTP status code and an optional message.\nThis object, if thrown during request handling, will cause SvelteKit to\nreturn an error response without invoking handleError.\nMake sure you're not catching the thrown error, which would prevent SvelteKit from handling it.\n\n\nfunction error(status: number, body: App.Error): HttpError;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'error'],
			href: '/docs/modules#sveltejs-kit-error',
			content:
				'function error(\n    status: number,\n    // this overload ensures you can omit the argument or pass in a string if App.Error is of type { message: string }\n    body?: { message: string } extends App.Error\n        ? App.Error | string | undefined\n        : never\n): HttpError;'
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'fail'],
			href: '/docs/modules#sveltejs-kit-fail',
			content:
				'Create an ActionFailure object.\n\n\nfunction fail<T extends Record<string, unknown> | undefined = undefined>(\n    status: number,\n    data?: T\n): ActionFailure<T>;'
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'json'],
			href: '/docs/modules#sveltejs-kit-json',
			content:
				'Create a JSON Response object from the supplied data.\n\n\nfunction json(data: any, init?: ResponseInit): Response;'
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'redirect'],
			href: '/docs/modules#sveltejs-kit-redirect',
			content:
				"Create a Redirect object. If thrown during request handling, SvelteKit will return a redirect response.\nMake sure you're not catching the thrown redirect, which would prevent SvelteKit from handling it.\n\n\nfunction redirect(\n    status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308,\n    location: string\n): Redirect;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit', 'text'],
			href: '/docs/modules#sveltejs-kit-text',
			content:
				'Create a Response object from the supplied body.\n\n\nfunction text(body: string, init?: ResponseInit): Response;'
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/hooks'],
			href: '/docs/modules#sveltejs-kit-hooks',
			content: "import { sequence } from '@sveltejs/kit/hooks';"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/hooks', 'sequence'],
			href: '/docs/modules#sveltejs-kit-hooks-sequence',
			content:
				"A helper function for sequencing multiple handle calls in a middleware-like manner.\n\n// @errors: 7031\n/// file: src/hooks.server.js\nimport { sequence } from '@sveltejs/kit/hooks';\n\n/// type: import('@sveltejs/kit').Handle\nasync function first({ event, resolve }) {\n    console.log('first pre-processing');\n    const result = await resolve(event, {\n        transformPageChunk: ({ html }) => {\n            // transforms are applied in reverse order\n            console.log('first transform');\n            return html;\n        }\n    });\n    console.log('first post-processing');\n    return result;\n}\n\n/// type: import('@sveltejs/kit').Handle\nasync function second({ event, resolve }) {\n    console.log('second pre-processing');\n    const result = await resolve(event, {\n        transformPageChunk: ({ html }) => {\n            console.log('second transform');\n            return html;\n        }\n    });\n    console.log('second post-processing');\n    return result;\n}\n\nexport const handle = sequence(first, second);The example above would print:\n\nfirst pre-processing\nsecond pre-processing\nsecond transform\nfirst transform\nsecond post-processing\nfirst post-processing\nfunction sequence(...handlers: Handle[]): Handle;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/node'],
			href: '/docs/modules#sveltejs-kit-node',
			content:
				"import { getRequest, setResponse } from '@sveltejs/kit/node';Utilities used by adapters for Node-like environments."
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/node', 'getRequest'],
			href: '/docs/modules#sveltejs-kit-node-getrequest',
			content:
				"function getRequest(opts: {\n    base: string;\n    request: import('http').IncomingMessage;\n    bodySizeLimit?: number;\n}): Promise<Request>;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/node', 'setResponse'],
			href: '/docs/modules#sveltejs-kit-node-setresponse',
			content:
				"function setResponse(\n    res: import('http').ServerResponse,\n    response: Response\n): void;"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/node/polyfills'],
			href: '/docs/modules#sveltejs-kit-node-polyfills',
			content:
				"import { installPolyfills } from '@sveltejs/kit/node/polyfills';A polyfill for fetch and its related interfaces, used by adapters for environments that don't provide a native implementation."
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/node/polyfills', 'installPolyfills'],
			href: '/docs/modules#sveltejs-kit-node-polyfills-installpolyfills',
			content:
				'Make various web APIs available as globals:\n\ncrypto\nfetch\nHeaders\nRequest\nResponse\n\n\nfunction installPolyfills(): void;'
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/vite'],
			href: '/docs/modules#sveltejs-kit-vite',
			content: "import { sveltekit } from '@sveltejs/kit/vite';"
		},
		{
			breadcrumbs: ['Modules', '@sveltejs/kit/vite', 'sveltekit'],
			href: '/docs/modules#sveltejs-kit-vite-sveltekit',
			content: 'Returns the SvelteKit Vite plugins.\n\n\nfunction sveltekit(): Promise<Plugin[]>;'
		},
		{ breadcrumbs: ['Types'], href: '/docs/types', content: '' },
		{
			breadcrumbs: ['Types', 'Public types'],
			href: '/docs/types#public-types',
			content: 'The following types can be imported from @sveltejs/kit:'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Action'],
			href: '/docs/types#public-types-action',
			content:
				'Shape of a form action method that is part of export const actions = {..} in +page.server.js.\nSee form actions for more information.\n\n\ninterface Action<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    OutputData extends Record<string, any> | void = Record<string, any> | void,\n    RouteId extends string | null = string | null\n> {/*…*/}\n(event: RequestEvent<Params, RouteId>): MaybePromise<OutputData>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ActionFailure'],
			href: '/docs/types#public-types-actionfailure',
			content:
				'The object returned by the fail function\n\n\ninterface ActionFailure<\n    T extends Record<string, unknown> | undefined = undefined\n> extends UniqueInterface {/*…*/}\nstatus: number;\nThe HTTP status code, in the range 400-599.\n\n\n\ndata: T;\nData associated with the failure (e.g. validation errors)'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ActionResult'],
			href: '/docs/types#public-types-actionresult',
			content:
				"When calling a form action via fetch, the response will be one of these shapes.\n\n<form method=\"post\" use:enhance={() => {\n  return ({ result }) => {\n        // result is of type ActionResult\n  };\n}}\ntype ActionResult<\n    Success extends Record<string, unknown> | undefined = Record<string, any>,\n    Failure extends Record<string, unknown> | undefined = Record<string, any>\n> =\n    | { type: 'success'; status: number; data?: Success }\n    | { type: 'failure'; status: number; data?: Failure }\n    | { type: 'redirect'; status: number; location: string }\n    | { type: 'error'; status?: number; error: any };"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Actions'],
			href: '/docs/types#public-types-actions',
			content:
				'Shape of the export const actions = {..} object in +page.server.js.\nSee form actions for more information.\n\n\ntype Actions<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    OutputData extends Record<string, any> | void = Record<string, any> | void,\n    RouteId extends string | null = string | null\n> = Record<string, Action<Params, OutputData, RouteId>>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Adapter'],
			href: '/docs/types#public-types-adapter',
			content:
				'Adapters are responsible for taking the production build and turning it into something that can be deployed to a platform of your choosing.\n\n\ninterface Adapter {/*…*/}\nname: string;\nThe name of the adapter, using for logging. Will typically correspond to the package name.\n\n\n\nadapt(builder: Builder): MaybePromise<void>;\n\nbuilder An object provided by SvelteKit that contains methods for adapting the app\n\n\nThis function is called after SvelteKit has built your app.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'AfterNavigate'],
			href: '/docs/types#public-types-afternavigate',
			content:
				"The argument passed to afterNavigate callbacks.\n\n\ninterface AfterNavigate extends Navigation {/*…*/}\ntype: Omit<NavigationType, 'leave'>;\nThe type of navigation:\n\nenter: The app has hydrated\nform: The user submitted a <form>\nlink: Navigation was triggered by a link click\ngoto: Navigation was triggered by a goto(...) call or a redirect\npopstate: Navigation was triggered by back/forward navigation\n\n\n\nwillUnload: false;\nSince afterNavigate is called after a navigation completes, it will never be called with a navigation that unloads the page."
		},
		{
			breadcrumbs: ['Types', 'Public types', 'AwaitedActions'],
			href: '/docs/types#public-types-awaitedactions',
			content:
				'type AwaitedActions<T extends Record<string, (...args: any) => any>> =\n    OptionalUnion<\n        {\n            [Key in keyof T]: UnpackValidationError<Awaited<ReturnType<T[Key]>>>;\n        }[keyof T]\n    >;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'AwaitedProperties'],
			href: '/docs/types#public-types-awaitedproperties',
			content:
				'type AwaitedProperties<input extends Record<string, any> | void> =\n    AwaitedPropertiesUnion<input> extends Record<string, any>\n        ? OptionalUnion<AwaitedPropertiesUnion<input>>\n        : AwaitedPropertiesUnion<input>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'BeforeNavigate'],
			href: '/docs/types#public-types-beforenavigate',
			content:
				'The argument passed to beforeNavigate callbacks.\n\n\ninterface BeforeNavigate extends Navigation {/*…*/}\ncancel(): void;\nCall this to prevent the navigation from starting.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Builder'],
			href: '/docs/types#public-types-builder',
			content:
				"This object is passed to the adapt function of adapters.\nIt contains various methods and properties that are useful for adapting the app.\n\n\ninterface Builder {/*…*/}\nlog: Logger;\nPrint messages to the console. log.info and log.minor are silent unless Vite's logLevel is info.\n\n\n\nrimraf(dir: string): void;\nRemove dir and all its contents.\n\n\n\nmkdirp(dir: string): void;\nCreate dir and any required parent directories.\n\n\n\nconfig: ValidatedConfig;\nThe fully resolved svelte.config.js.\n\n\n\nprerendered: Prerendered;\nInformation about prerendered pages and assets, if any.\n\n\n\nroutes: RouteDefinition[];\nAn array of all routes (including prerendered)\n\n\n\ncreateEntries(fn: (route: RouteDefinition) => AdapterEntry): Promise<void>;\n\nfn A function that groups a set of routes into an entry point\n\n\nCreate separate functions that map to one or more routes of your app.\n\n\n\ngenerateFallback(dest: string): Promise<void>;\nGenerate a fallback page for a static webserver to use when no route is matched. Useful for single-page apps.\n\n\n\ngenerateManifest(opts: { relativePath: string; routes?: RouteDefinition[] }): string;\n\nopts a relative path to the base directory of the app and optionally in which format (esm or cjs) the manifest should be generated\n\n\nGenerate a server-side manifest to initialise the SvelteKit server with.\n\n\n\ngetBuildDirectory(name: string): string;\n\nname path to the file, relative to the build directory\n\n\nResolve a path to the name directory inside outDir, e.g. /path/to/.svelte-kit/my-adapter.\n\n\n\ngetClientDirectory(): string;\nGet the fully resolved path to the directory containing client-side assets, including the contents of your static directory.\n\n\n\ngetServerDirectory(): string;\nGet the fully resolved path to the directory containing server-side code.\n\n\n\ngetAppPath(): string;\nGet the application path including any configured base path, e.g. /my-base-path/_app.\n\n\n\nwriteClient(dest: string): string[];\n\ndest the destination folder\n\nreturns\n an array of files written to dest\n\n\nWrite client assets to dest.\n\n\n\nwritePrerendered(dest: string): string[];\n\ndest the destination folder\n\nreturns\n an array of files written to dest\n\n\nWrite prerendered files to dest.\n\n\n\nwriteServer(dest: string): string[];\n\ndest the destination folder\n\nreturns\n an array of files written to dest\n\n\nWrite server-side code to dest.\n\n\n\ncopy(\n    from: string,\n    to: string,\n    opts?: {\n        filter?(basename: string): boolean;\n        replace?: Record<string, string>;\n    }\n): string[];\n\nfrom the source file or directory\nto the destination file or directory\nopts.filter a function to determine whether a file or directory should be copied\nopts.replace a map of strings to replace\n\nreturns\n an array of files that were copied\n\n\nCopy a file or directory.\n\n\n\ncompress(directory: string): Promise<void>;\n\ndirectory The directory containing the files to be compressed\n\n\nCompress files in directory with gzip and brotli, where appropriate. Generates .gz and .br files alongside the originals."
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Config'],
			href: '/docs/types#public-types-config',
			content: 'interface Config {/*…*/}\nSee the configuration reference for details.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Cookies'],
			href: '/docs/types#public-types-cookies',
			content:
				"interface Cookies {/*…*/}\nget(name: string, opts?: import('cookie').CookieParseOptions): string | undefined;\n\nname the name of the cookie\nopts the options, passed directly to cookie.parse. See documentation here\n\n\nGets a cookie that was previously set with cookies.set, or from the request headers.\n\n\n\ngetAll(opts?: import('cookie').CookieParseOptions): Array<{ name: string; value: string }>;\n\nopts the options, passed directily to cookie.parse. See documentation here\n\n\nGets all cookies that were previously set with cookies.set, or from the request headers.\n\n\n\nset(name: string, value: string, opts?: import('cookie').CookieSerializeOptions): void;\n\nname the name of the cookie\nvalue the cookie value\nopts the options, passed directory to cookie.serialize. See documentation here\n\n\nSets a cookie. This will add a set-cookie header to the response, but also make the cookie available via cookies.get or cookies.getAll during the current request.\n\nThe httpOnly and secure options are true by default (except on http://localhost, where secure is false), and must be explicitly disabled if you want cookies to be readable by client-side JavaScript and/or transmitted over HTTP. The sameSite option defaults to lax.\n\nBy default, the path of a cookie is the 'directory' of the current pathname. In most cases you should explicitly set path: '/' to make the cookie available throughout your app.\n\n\n\ndelete(name: string, opts?: import('cookie').CookieSerializeOptions): void;\n\nname the name of the cookie\nopts the options, passed directory to cookie.serialize. The path must match the path of the cookie you want to delete. See documentation here\n\n\nDeletes a cookie by setting its value to an empty string and setting the expiry date in the past.\n\nBy default, the path of a cookie is the 'directory' of the current pathname. In most cases you should explicitly set path: '/' to make the cookie available throughout your app.\n\n\n\nserialize(name: string, value: string, opts?: import('cookie').CookieSerializeOptions): string;\n\nname the name of the cookie\nvalue the cookie value\nopts the options, passed directory to cookie.serialize. See documentation here\n\n\nSerialize a cookie name-value pair into a Set-Cookie header string, but don't apply it to the response.\n\nThe httpOnly and secure options are true by default (except on http://localhost, where secure is false), and must be explicitly disabled if you want cookies to be readable by client-side JavaScript and/or transmitted over HTTP. The sameSite option defaults to lax.\n\nBy default, the path of a cookie is the current pathname. In most cases you should explicitly set path: '/' to make the cookie available throughout your app."
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Handle'],
			href: '/docs/types#public-types-handle',
			content:
				'The handle hook runs every time the SvelteKit server receives a request and\ndetermines the response.\nIt receives an event object representing the request and a function called resolve, which renders the route and generates a Response.\nThis allows you to modify response headers or bodies, or bypass SvelteKit entirely (for implementing routes programmatically, for example).\n\n\ninterface Handle {/*…*/}\n(input: {\n    event: RequestEvent;\n    resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;\n}): MaybePromise<Response>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'HandleClientError'],
			href: '/docs/types#public-types-handleclienterror',
			content:
				'The client-side handleError hook runs when an unexpected error is thrown while navigating.\n\nIf an unexpected error is thrown during loading or the following render, this function will be called with the error and the event.\nMake sure that this function never throws an error.\n\n\ninterface HandleClientError {/*…*/}\n(input: { error: unknown; event: NavigationEvent }): MaybePromise<void | App.Error>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'HandleFetch'],
			href: '/docs/types#public-types-handlefetch',
			content:
				'The handleFetch hook allows you to modify (or replace) a fetch request that happens inside a load function that runs on the server (or during pre-rendering)\n\n\ninterface HandleFetch {/*…*/}\n(input: { event: RequestEvent; request: Request; fetch: typeof fetch }): MaybePromise<Response>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'HandleServerError'],
			href: '/docs/types#public-types-handleservererror',
			content:
				'The server-side handleError hook runs when an unexpected error is thrown while responding to a request.\n\nIf an unexpected error is thrown during loading or rendering, this function will be called with the error and the event.\nMake sure that this function never throws an error.\n\n\ninterface HandleServerError {/*…*/}\n(input: { error: unknown; event: RequestEvent }): MaybePromise<void | App.Error>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'HttpError'],
			href: '/docs/types#public-types-httperror',
			content:
				'The object returned by the error function.\n\n\ninterface HttpError {/*…*/}\nstatus: number;\nThe HTTP status code, in the range 400-599.\n\n\n\nbody: App.Error;\nThe content of the error.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'KitConfig'],
			href: '/docs/types#public-types-kitconfig',
			content: 'interface KitConfig {/*…*/}\nSee the configuration reference for details.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Load'],
			href: '/docs/types#public-types-load',
			content:
				'The generic form of PageLoad and LayoutLoad. You should import those from ./$types (see generated types)\nrather than using Load directly.\n\n\ninterface Load<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    InputData extends Record<string, unknown> | null = Record<string, any> | null,\n    ParentData extends Record<string, unknown> = Record<string, any>,\n    OutputData extends Record<string, unknown> | void = Record<\n        string,\n        any\n    > | void,\n    RouteId extends string | null = string | null\n> {/*…*/}\n(event: LoadEvent<Params, InputData, ParentData, RouteId>): MaybePromise<OutputData>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'LoadEvent'],
			href: '/docs/types#public-types-loadevent',
			content:
				"The generic form of PageLoadEvent and LayoutLoadEvent. You should import those from ./$types (see generated types)\nrather than using LoadEvent directly.\n\n\ninterface LoadEvent<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    Data extends Record<string, unknown> | null = Record<string, any> | null,\n    ParentData extends Record<string, unknown> = Record<string, any>,\n    RouteId extends string | null = string | null\n> extends NavigationEvent<Params, RouteId> {/*…*/}\nfetch: typeof fetch;\nfetch is equivalent to the native fetch web API, with a few additional features:\n\nit can be used to make credentialed requests on the server, as it inherits the cookie and authorization headers for the page request\nit can make relative requests on the server (ordinarily, fetch requires a URL with an origin when used in a server context)\ninternal requests (e.g. for +server.js routes) go directly to the handler function when running on the server, without the overhead of an HTTP call\nduring server-side rendering, the response will be captured and inlined into the rendered HTML. Note that headers will not be serialized, unless explicitly included via filterSerializedResponseHeaders\nduring hydration, the response will be read from the HTML, guaranteeing consistency and preventing an additional network request\n\nCookies will only be passed through if the target host is the same as the SvelteKit application or a more specific subdomain of it.\n\n\n\n\ndata: Data;\nContains the data returned by the route's server load function (in +layout.server.js or +page.server.js), if any.\n\n\n\nsetHeaders(headers: Record<string, string>): void;\nIf you need to set headers for the response, you can do so using the this method. This is useful if you want the page to be cached, for example:\n\n// @errors: 7031\n/// file: src/routes/blog/+page.js\nexport async function load({ fetch, setHeaders }) {\n    const url = `https://cms.example.com/articles.json`;\n    const response = await fetch(url);\n\n    setHeaders({\n        age: response.headers.get('age'),\n        'cache-control': response.headers.get('cache-control')\n    });\n\n    return response.json();\n}Setting the same header multiple times (even in separate load functions) is an error — you can only set a given header once.\n\nYou cannot add a set-cookie header with setHeaders — use the cookies API in a server-only load function instead.\n\nsetHeaders has no effect when a load function runs in the browser.\n\n\n\nparent(): Promise<ParentData>;\nawait parent() returns data from parent +layout.js load functions.\nImplicitly, a missing +layout.js is treated as a ({ data }) => data function, meaning that it will return and forward data from parent +layout.server.js files.\n\nBe careful not to introduce accidental waterfalls when using await parent(). If for example you only want to merge parent data into the returned output, call it after fetching your other data.\n\n\n\ndepends(...deps: string[]): void;\nThis function declares that the load function has a dependency on one or more URLs or custom identifiers, which can subsequently be used with invalidate() to cause load to rerun.\n\nMost of the time you won't need this, as fetch calls depends on your behalf — it's only necessary if you're using a custom API client that bypasses fetch.\n\nURLs can be absolute or relative to the page being loaded, and must be encoded.\n\nCustom identifiers have to be prefixed with one or more lowercase letters followed by a colon to conform to the URI specification.\n\nThe following example shows how to use depends to register a dependency on a custom identifier, which is invalidated after a button click, making the load function rerun.\n\n// @errors: 7031\n/// file: src/routes/+page.js\nlet count = 0;\nexport async function load({ depends }) {\n    depends('increase:count');\n\n    return { count: count++ };\n}// @errors: 7031\n/// file: src/routes/+page.svelte\n<script>\n    import { invalidate } from '$app/navigation';\n\n    export let data;\n\n    const increase = async () => {\n        await invalidate('increase:count');\n    }\n</script>\n\n<p>{data.count}<p>\n<button on:click={increase}>Increase Count</button>"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Navigation'],
			href: '/docs/types#public-types-navigation',
			content:
				"interface Navigation {/*…*/}\nfrom: NavigationTarget | null;\nWhere navigation was triggered from\n\n\n\nto: NavigationTarget | null;\nWhere navigation is going to/has gone to\n\n\n\ntype: Omit<NavigationType, 'enter'>;\nThe type of navigation:\n\nform: The user submitted a <form>\nleave: The user is leaving the app by closing the tab or using the back/forward buttons to go to a different document\nlink: Navigation was triggered by a link click\ngoto: Navigation was triggered by a goto(...) call or a redirect\npopstate: Navigation was triggered by back/forward navigation\n\n\n\nwillUnload: boolean;\nWhether or not the navigation will result in the page being unloaded (i.e. not a client-side navigation)\n\n\n\ndelta?: number;\nIn case of a history back/forward navigation, the number of steps to go back/forward"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'NavigationEvent'],
			href: '/docs/types#public-types-navigationevent',
			content:
				'interface NavigationEvent<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    RouteId extends string | null = string | null\n> {/*…*/}\nparams: Params;\nThe parameters of the current page - e.g. for a route like /blog/[slug], a { slug: string } object\n\n\n\nroute: {/*…*/}\nInfo about the current route\n\n\nid: RouteId;\nThe ID of the current route - e.g. for src/routes/blog/[slug], it would be /blog/[slug]\n\n\n\nurl: URL;\nThe URL of the current page'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'NavigationTarget'],
			href: '/docs/types#public-types-navigationtarget',
			content:
				'Information about the target of a specific navigation.\n\n\ninterface NavigationTarget {/*…*/}\nparams: Record<string, string> | null;\nParameters of the target page - e.g. for a route like /blog/[slug], a { slug: string } object.\nIs null if the target is not part of the SvelteKit app (could not be resolved to a route).\n\n\n\nroute: { id: string | null };\nInfo about the target route\n\n\n\nurl: URL;\nThe URL that is navigated to'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'NavigationType'],
			href: '/docs/types#public-types-navigationtype',
			content:
				"enter: The app has hydrated\nform: The user submitted a <form>\nleave: The user is leaving the app by closing the tab or using the back/forward buttons to go to a different document\nlink: Navigation was triggered by a link click\ngoto: Navigation was triggered by a goto(...) call or a redirect\npopstate: Navigation was triggered by back/forward navigation\n\n\ntype NavigationType = 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate';"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Page'],
			href: '/docs/types#public-types-page',
			content:
				'The shape of the $page store\n\n\ninterface Page<\n    Params extends Record<string, string> = Record<string, string>,\n    RouteId extends string | null = string | null\n> {/*…*/}\nurl: URL;\nThe URL of the current page\n\n\n\nparams: Params;\nThe parameters of the current page - e.g. for a route like /blog/[slug], a { slug: string } object\n\n\n\nroute: {/*…*/}\nInfo about the current route\n\n\nid: RouteId;\nThe ID of the current route - e.g. for src/routes/blog/[slug], it would be /blog/[slug]\n\n\n\nstatus: number;\nHttp status code of the current page\n\n\n\nerror: App.Error | null;\nThe error object of the current page, if any. Filled from the handleError hooks.\n\n\n\ndata: App.PageData & Record<string, any>;\nThe merged result of all data from all load functions on the current page. You can type a common denominator through App.PageData.\n\n\n\nform: any;\nFilled only after a form submission. See form actions for more info.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ParamMatcher'],
			href: '/docs/types#public-types-parammatcher',
			content:
				'The shape of a param matcher. See matching for more info.\n\n\ninterface ParamMatcher {/*…*/}\n(param: string): boolean;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Redirect'],
			href: '/docs/types#public-types-redirect',
			content:
				'The object returned by the redirect function\n\n\ninterface Redirect {/*…*/}\nstatus: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;\nThe HTTP status code, in the range 300-308.\n\n\n\nlocation: string;\nThe location to redirect to.'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'RequestEvent'],
			href: '/docs/types#public-types-requestevent',
			content:
				"interface RequestEvent<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    RouteId extends string | null = string | null\n> {/*…*/}\ncookies: Cookies;\nGet or set cookies related to the current request\n\n\n\nfetch: typeof fetch;\nfetch is equivalent to the native fetch web API, with a few additional features:\n\nit can be used to make credentialed requests on the server, as it inherits the cookie and authorization headers for the page request\nit can make relative requests on the server (ordinarily, fetch requires a URL with an origin when used in a server context)\ninternal requests (e.g. for +server.js routes) go directly to the handler function when running on the server, without the overhead of an HTTP call\n\nCookies will only be passed through if the target host is the same as the SvelteKit application or a more specific subdomain of it.\n\n\n\n\ngetClientAddress(): string;\nThe client's IP address, set by the adapter.\n\n\n\nlocals: App.Locals;\nContains custom data that was added to the request within the handle hook.\n\n\n\nparams: Params;\nThe parameters of the current route - e.g. for a route like /blog/[slug], a { slug: string } object\n\n\n\nplatform: Readonly<App.Platform> | undefined;\nAdditional data made available through the adapter.\n\n\n\nrequest: Request;\nThe original request object\n\n\n\nroute: {/*…*/}\nInfo about the current route\n\n\nid: RouteId;\nThe ID of the current route - e.g. for src/routes/blog/[slug], it would be /blog/[slug]\n\n\n\nsetHeaders(headers: Record<string, string>): void;\nIf you need to set headers for the response, you can do so using the this method. This is useful if you want the page to be cached, for example:\n\n// @errors: 7031\n/// file: src/routes/blog/+page.js\nexport async function load({ fetch, setHeaders }) {\n    const url = `https://cms.example.com/articles.json`;\n    const response = await fetch(url);\n\n    setHeaders({\n        age: response.headers.get('age'),\n        'cache-control': response.headers.get('cache-control')\n    });\n\n    return response.json();\n}Setting the same header multiple times (even in separate load functions) is an error — you can only set a given header once.\n\nYou cannot add a set-cookie header with setHeaders — use the cookies API instead.\n\n\n\nurl: URL;\nThe requested URL.\n\n\n\nisDataRequest: boolean;\ntrue if the request comes from the client asking for +page/layout.server.js data. The url property will be stripped of the internal information\nrelated to the data request in this case. Use this property instead if the distinction is important to you."
		},
		{
			breadcrumbs: ['Types', 'Public types', 'RequestHandler'],
			href: '/docs/types#public-types-requesthandler',
			content:
				'A (event: RequestEvent) => Response function exported from a +server.js file that corresponds to an HTTP verb (GET, PUT, PATCH, etc) and handles requests with that method.\n\nIt receives Params as the first generic argument, which you can skip by using generated types instead.\n\n\ninterface RequestHandler<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    RouteId extends string | null = string | null\n> {/*…*/}\n(event: RequestEvent<Params, RouteId>): MaybePromise<Response>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ResolveOptions'],
			href: '/docs/types#public-types-resolveoptions',
			content:
				"interface ResolveOptions {/*…*/}\ntransformPageChunk?(input: { html: string; done: boolean }): MaybePromise<string | undefined>;\n\ninput the html chunk and the info if this is the last chunk\n\n\nApplies custom transforms to HTML. If done is true, it's the final chunk. Chunks are not guaranteed to be well-formed HTML\n(they could include an element's opening tag but not its closing tag, for example)\nbut they will always be split at sensible boundaries such as %sveltekit.head% or layout/page components.\n\n\n\nfilterSerializedResponseHeaders?(name: string, value: string): boolean;\n\nname header name\nvalue header value\n\n\nDetermines which headers should be included in serialized responses when a load function loads a resource with fetch.\nBy default, none will be included.\n\n\n\npreload?(input: { type: 'font' | 'css' | 'js' | 'asset'; path: string }): boolean;\n\ninput the type of the file and its path\n\n\nDetermines what should be added to the <head> tag to preload it.\nBy default, js, css and font files will be preloaded."
		},
		{
			breadcrumbs: ['Types', 'Public types', 'RouteDefinition'],
			href: '/docs/types#public-types-routedefinition',
			content:
				"interface RouteDefinition<Config = any> {/*…*/}\nid: string;\n\n\napi: {\n    methods: HttpMethod[];\n};\n\n\npage: {\n    methods: Extract<HttpMethod, 'GET' | 'POST'>[];\n};\n\n\npattern: RegExp;\n\n\nprerender: PrerenderOption;\n\n\nsegments: RouteSegment[];\n\n\nmethods: HttpMethod[];\n\n\nconfig: Config;"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'SSRManifest'],
			href: '/docs/types#public-types-ssrmanifest',
			content:
				'interface SSRManifest {/*…*/}\nappDir: string;\n\n\nappPath: string;\n\n\nassets: Set<string>;\n\n\nmimeTypes: Record<string, string>;\n\n\n_: {\n    client: {\n        start: AssetDependencies;\n        app: AssetDependencies;\n    };\n    nodes: SSRNodeLoader[];\n    routes: SSRRoute[];\n    matchers(): Promise<Record<string, ParamMatcher>>;\n};\nprivate fields'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Server'],
			href: '/docs/types#public-types-server',
			content:
				'class Server {\n    constructor(manifest: SSRManifest);\n    init(options: ServerInitOptions): Promise<void>;\n    respond(request: Request, options: RequestOptions): Promise<Response>;\n}'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ServerInitOptions'],
			href: '/docs/types#public-types-serverinitoptions',
			content: 'interface ServerInitOptions {/*…*/}\nenv: Record<string, string>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ServerLoad'],
			href: '/docs/types#public-types-serverload',
			content:
				'The generic form of PageServerLoad and LayoutServerLoad. You should import those from ./$types (see generated types)\nrather than using ServerLoad directly.\n\n\ninterface ServerLoad<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    ParentData extends Record<string, any> = Record<string, any>,\n    OutputData extends Record<string, any> | void = Record<string, any> | void,\n    RouteId extends string | null = string | null\n> {/*…*/}\n(event: ServerLoadEvent<Params, ParentData, RouteId>): MaybePromise<OutputData>;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'ServerLoadEvent'],
			href: '/docs/types#public-types-serverloadevent',
			content:
				"interface ServerLoadEvent<\n    Params extends Partial<Record<string, string>> = Partial<\n        Record<string, string>\n    >,\n    ParentData extends Record<string, any> = Record<string, any>,\n    RouteId extends string | null = string | null\n> extends RequestEvent<Params, RouteId> {/*…*/}\nparent(): Promise<ParentData>;\nawait parent() returns data from parent +layout.server.js load functions.\n\nBe careful not to introduce accidental waterfalls when using await parent(). If for example you only want to merge parent data into the returned output, call it after fetching your other data.\n\n\n\ndepends(...deps: string[]): void;\nThis function declares that the load function has a dependency on one or more URLs or custom identifiers, which can subsequently be used with invalidate() to cause load to rerun.\n\nMost of the time you won't need this, as fetch calls depends on your behalf — it's only necessary if you're using a custom API client that bypasses fetch.\n\nURLs can be absolute or relative to the page being loaded, and must be encoded.\n\nCustom identifiers have to be prefixed with one or more lowercase letters followed by a colon to conform to the URI specification.\n\nThe following example shows how to use depends to register a dependency on a custom identifier, which is invalidated after a button click, making the load function rerun.\n\n// @errors: 7031\n/// file: src/routes/+page.js\nlet count = 0;\nexport async function load({ depends }) {\n    depends('increase:count');\n\n    return { count: count++ };\n}// @errors: 7031\n/// file: src/routes/+page.svelte\n<script>\n    import { invalidate } from '$app/navigation';\n\n    export let data;\n\n    const increase = async () => {\n        await invalidate('increase:count');\n    }\n</script>\n\n<p>{data.count}<p>\n<button on:click={increase}>Increase Count</button>"
		},
		{
			breadcrumbs: ['Types', 'Public types', 'Snapshot'],
			href: '/docs/types#public-types-snapshot',
			content:
				'The type of export const snapshot exported from a page or layout component.\n\n\ninterface Snapshot<T = any> {/*…*/}\ncapture: () => T;\n\n\nrestore: (snapshot: T) => void;'
		},
		{
			breadcrumbs: ['Types', 'Public types', 'SubmitFunction'],
			href: '/docs/types#public-types-submitfunction',
			content:
				"interface SubmitFunction<\n    Success extends Record<string, unknown> | undefined = Record<string, any>,\n    Failure extends Record<string, unknown> | undefined = Record<string, any>\n> {/*…*/}\n(input: {\n    action: URL;\n    data: FormData;\n    form: HTMLFormElement;\n    controller: AbortController;\n    submitter: HTMLElement | null;\n    cancel(): void;\n}): MaybePromise<\n    | void\n    | ((opts: {\n            form: HTMLFormElement;\n            action: URL;\n            result: ActionResult<Success, Failure>;\n            /**\n             * Call this to get the default behavior of a form submission response.\n             * @param options Set `reset: false` if you don't want the `<form>` values to be reset after a successful submission.\n             */\n            update(options?: { reset: boolean }): Promise<void>;\n      }) => void)\n>;"
		},
		{
			breadcrumbs: ['Types', 'Private types'],
			href: '/docs/types#private-types',
			content:
				'The following are referenced by the public types documented above, but cannot be imported directly:'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'AdapterEntry'],
			href: '/docs/types#private-types-adapterentry',
			content:
				'interface AdapterEntry {/*…*/}\nid: string;\nA string that uniquely identifies an HTTP service (e.g. serverless function) and is used for deduplication.\nFor example, /foo/a-[b] and /foo/[c] are different routes, but would both\nbe represented in a Netlify _redirects file as /foo/:param, so they share an ID\n\n\n\nfilter(route: RouteDefinition): boolean;\nA function that compares the candidate route with the current route to determine\nif it should be grouped with the current route.\n\nUse cases:\n\nFallback pages: /foo/[c] is a fallback for /foo/a-[b], and /[...catchall] is a fallback for all routes\nGrouping routes that share a common config: /foo should be deployed to the edge, /bar and /baz should be deployed to a serverless function\n\n\n\ncomplete(entry: { generateManifest(opts: { relativePath: string }): string }): MaybePromise<void>;\nA function that is invoked once the entry has been created. This is where you\nshould write the function to the filesystem and generate redirect manifests.'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'Csp'],
			href: '/docs/types#private-types-csp',
			content:
				"namespace Csp {\n    type ActionSource = 'strict-dynamic' | 'report-sample';\n    type BaseSource =\n        | 'self'\n        | 'unsafe-eval'\n        | 'unsafe-hashes'\n        | 'unsafe-inline'\n        | 'wasm-unsafe-eval'\n        | 'none';\n    type CryptoSource = `${'nonce' | 'sha256' | 'sha384' | 'sha512'}-${string}`;\n    type FrameSource = HostSource | SchemeSource | 'self' | 'none';\n    type HostNameScheme = `${string}.${string}` | 'localhost';\n    type HostSource = `${HostProtocolSchemes}${HostNameScheme}${PortScheme}`;\n    type HostProtocolSchemes = `${string}://` | '';\n    type HttpDelineator = '/' | '?' | '#' | '\\\\';\n    type PortScheme = `:${number}` | '' | ':*';\n    type SchemeSource =\n        | 'http:'\n        | 'https:'\n        | 'data:'\n        | 'mediastream:'\n        | 'blob:'\n        | 'filesystem:';\n    type Source = HostSource | SchemeSource | CryptoSource | BaseSource;\n    type Sources = Source[];\n    type UriPath = `${HttpDelineator}${string}`;\n}"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'CspDirectives'],
			href: '/docs/types#private-types-cspdirectives',
			content:
				"interface CspDirectives {/*…*/}\n'child-src'?: Csp.Sources;\n\n\n'default-src'?: Array<Csp.Source | Csp.ActionSource>;\n\n\n'frame-src'?: Csp.Sources;\n\n\n'worker-src'?: Csp.Sources;\n\n\n'connect-src'?: Csp.Sources;\n\n\n'font-src'?: Csp.Sources;\n\n\n'img-src'?: Csp.Sources;\n\n\n'manifest-src'?: Csp.Sources;\n\n\n'media-src'?: Csp.Sources;\n\n\n'object-src'?: Csp.Sources;\n\n\n'prefetch-src'?: Csp.Sources;\n\n\n'script-src'?: Array<Csp.Source | Csp.ActionSource>;\n\n\n'script-src-elem'?: Csp.Sources;\n\n\n'script-src-attr'?: Csp.Sources;\n\n\n'style-src'?: Array<Csp.Source | Csp.ActionSource>;\n\n\n'style-src-elem'?: Csp.Sources;\n\n\n'style-src-attr'?: Csp.Sources;\n\n\n'base-uri'?: Array<Csp.Source | Csp.ActionSource>;\n\n\nsandbox?: Array<\n    | 'allow-downloads-without-user-activation'\n    | 'allow-forms'\n    | 'allow-modals'\n    | 'allow-orientation-lock'\n    | 'allow-pointer-lock'\n    | 'allow-popups'\n    | 'allow-popups-to-escape-sandbox'\n    | 'allow-presentation'\n    | 'allow-same-origin'\n    | 'allow-scripts'\n    | 'allow-storage-access-by-user-activation'\n    | 'allow-top-navigation'\n    | 'allow-top-navigation-by-user-activation'\n>;\n\n\n'form-action'?: Array<Csp.Source | Csp.ActionSource>;\n\n\n'frame-ancestors'?: Array<Csp.HostSource | Csp.SchemeSource | Csp.FrameSource>;\n\n\n'navigate-to'?: Array<Csp.Source | Csp.ActionSource>;\n\n\n'report-uri'?: Csp.UriPath[];\n\n\n'report-to'?: string[];\n\n\n'require-trusted-types-for'?: Array<'script'>;\n\n\n'trusted-types'?: Array<'none' | 'allow-duplicates' | '*' | string>;\n\n\n'upgrade-insecure-requests'?: boolean;\n\n\n'require-sri-for'?: Array<'script' | 'style' | 'script style'>;\n\n\n'block-all-mixed-content'?: boolean;\n\n\n'plugin-types'?: Array<`${string}/${string}` | 'none'>;\n\n\nreferrer?: Array<\n    | 'no-referrer'\n    | 'no-referrer-when-downgrade'\n    | 'origin'\n    | 'origin-when-cross-origin'\n    | 'same-origin'\n    | 'strict-origin'\n    | 'strict-origin-when-cross-origin'\n    | 'unsafe-url'\n    | 'none'\n>;"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'HttpMethod'],
			href: '/docs/types#private-types-httpmethod',
			content:
				"type HttpMethod =\n    | 'GET'\n    | 'HEAD'\n    | 'POST'\n    | 'PUT'\n    | 'DELETE'\n    | 'PATCH'\n    | 'OPTIONS';"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'Logger'],
			href: '/docs/types#private-types-logger',
			content:
				'interface Logger {/*…*/}\n(msg: string): void;\n\n\nsuccess(msg: string): void;\n\n\nerror(msg: string): void;\n\n\nwarn(msg: string): void;\n\n\nminor(msg: string): void;\n\n\ninfo(msg: string): void;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'MaybePromise'],
			href: '/docs/types#private-types-maybepromise',
			content: 'type MaybePromise<T> = T | Promise<T>;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderHttpErrorHandler'],
			href: '/docs/types#private-types-prerenderhttperrorhandler',
			content:
				"interface PrerenderHttpErrorHandler {/*…*/}\n(details: {\n    status: number;\n    path: string;\n    referrer: string | null;\n    referenceType: 'linked' | 'fetched';\n    message: string;\n}): void;"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderHttpErrorHandlerValue'],
			href: '/docs/types#private-types-prerenderhttperrorhandlervalue',
			content:
				"type PrerenderHttpErrorHandlerValue =\n    | 'fail'\n    | 'warn'\n    | 'ignore'\n    | PrerenderHttpErrorHandler;"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderMap'],
			href: '/docs/types#private-types-prerendermap',
			content: 'type PrerenderMap = Map<string, PrerenderOption>;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderMissingIdHandler'],
			href: '/docs/types#private-types-prerendermissingidhandler',
			content:
				'interface PrerenderMissingIdHandler {/*…*/}\n(details: { path: string; id: string; referrers: string[]; message: string }): void;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderMissingIdHandlerValue'],
			href: '/docs/types#private-types-prerendermissingidhandlervalue',
			content:
				"type PrerenderMissingIdHandlerValue =\n    | 'fail'\n    | 'warn'\n    | 'ignore'\n    | PrerenderMissingIdHandler;"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'PrerenderOption'],
			href: '/docs/types#private-types-prerenderoption',
			content: "type PrerenderOption = boolean | 'auto';"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'Prerendered'],
			href: '/docs/types#private-types-prerendered',
			content:
				'interface Prerendered {/*…*/}\npages: Map<\n    string,\n    {\n        /** The location of the .html file relative to the output directory */\n        file: string;\n    }\n>;\nA map of path to { file } objects, where a path like /foo corresponds to foo.html and a path like /bar/ corresponds to bar/index.html.\n\n\n\nassets: Map<\n    string,\n    {\n        /** The MIME type of the asset */\n        type: string;\n    }\n>;\nA map of path to { type } objects.\n\n\n\nredirects: Map<\n    string,\n    {\n        status: number;\n        location: string;\n    }\n>;\nA map of redirects encountered during prerendering.\n\n\n\npaths: string[];\nAn array of prerendered paths (without trailing slashes, regardless of the trailingSlash config)'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'RequestOptions'],
			href: '/docs/types#private-types-requestoptions',
			content:
				'interface RequestOptions {/*…*/}\ngetClientAddress(): string;\n\n\nplatform?: App.Platform;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'RouteSegment'],
			href: '/docs/types#private-types-routesegment',
			content:
				'interface RouteSegment {/*…*/}\ncontent: string;\n\n\ndynamic: boolean;\n\n\nrest: boolean;'
		},
		{
			breadcrumbs: ['Types', 'Private types', 'TrailingSlash'],
			href: '/docs/types#private-types-trailingslash',
			content: "type TrailingSlash = 'never' | 'always' | 'ignore';"
		},
		{
			breadcrumbs: ['Types', 'Private types', 'UniqueInterface'],
			href: '/docs/types#private-types-uniqueinterface',
			content: 'interface UniqueInterface {/*…*/}\nreadonly [uniqueSymbol]: unknown;'
		},
		{
			breadcrumbs: ['Types', 'Generated types'],
			href: '/docs/types#generated-types',
			content:
				"The RequestHandler and Load types both accept a Params argument allowing you to type the params object. For example this endpoint expects foo, bar and baz params:\n\n/// file: src/routes/[foo]/[bar]/[baz]/+page.server.js\n// @errors: 2355 2322 1360\n/** @type {import('@sveltejs/kit').RequestHandler<{\n *   foo: string;\n *   bar: string;\n *   baz: string\n * }>} */\nexport async function GET({ params }) {\n    // ...\n}Needless to say, this is cumbersome to write out, and less portable (if you were to rename the [foo] directory to [qux], the type would no longer reflect reality).\n\nTo solve this problem, SvelteKit generates .d.ts files for each of your endpoints and pages:\n\n/// file: .svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts\n/// link: false\nimport type * as Kit from '@sveltejs/kit';\n\ntype RouteParams = {\n    foo: string;\n    bar: string;\n    baz: string;\n}\n\nexport type PageServerLoad = Kit.ServerLoad<RouteParams>;\nexport type PageLoad = Kit.Load<RouteParams>;These files can be imported into your endpoints and pages as siblings, thanks to the rootDirs option in your TypeScript configuration:\n\n/** @type {import('./$types').PageServerLoad} */\nexport async function GET({ params }) {\n    // ...\n}/** @type {import('./$types').PageLoad} */\nexport async function load({ params, fetch }) {\n    // ...\n}For this to work, your own tsconfig.json or jsconfig.json should extend from the generated .svelte-kit/tsconfig.json (where .svelte-kit is your outDir):\n\n{ \"extends\": \"./.svelte-kit/tsconfig.json\" }"
		},
		{
			breadcrumbs: ['Types', 'Generated types', 'Default tsconfig.json'],
			href: '/docs/types#generated-types-default-tsconfig-json',
			content:
				'The generated .svelte-kit/tsconfig.json file contains a mixture of options. Some are generated programmatically based on your project configuration, and should generally not be overridden without good reason:\n\n/// file: .svelte-kit/tsconfig.json\n{\n    "compilerOptions": {\n        "baseUrl": "..",\n        "paths": {\n            "$lib": "src/lib",\n            "$lib/*": "src/lib/*"\n        },\n        "rootDirs": ["..", "./types"]\n    },\n    "include": ["../src/**/*.js", "../src/**/*.ts", "../src/**/*.svelte"],\n    "exclude": ["../node_modules/**", "./**"]\n}Others are required for SvelteKit to work properly, and should also be left untouched unless you know what you\'re doing:\n\n/// file: .svelte-kit/tsconfig.json\n{\n    "compilerOptions": {\n        // this ensures that types are explicitly\n        // imported with `import type`, which is\n        // necessary as svelte-preprocess cannot\n        // otherwise compile components correctly\n        "importsNotUsedAsValues": "error",\n\n        // Vite compiles one TypeScript module\n        // at a time, rather than compiling\n        // the entire module graph\n        "isolatedModules": true,\n\n        // TypeScript cannot \'see\' when you\n        // use an imported value in your\n        // markup, so we need this\n        "preserveValueImports": true,\n\n        // This ensures both `vite build`\n        // and `svelte-package` work correctly\n        "lib": ["esnext", "DOM", "DOM.Iterable"],\n        "moduleResolution": "node",\n        "module": "esnext",\n        "target": "esnext"\n    }\n}'
		},
		{
			breadcrumbs: ['Types', 'App'],
			href: '/docs/types#app',
			content:
				"It's possible to tell SvelteKit how to type objects inside your app by declaring the App namespace. By default, a new project will have a file called src/app.d.ts containing the following:\n\ndeclare global {\n    namespace App {\n        // interface Error {}\n        // interface Locals {}\n        // interface PageData {}\n        // interface Platform {}\n    }\n}\n\nexport {};The export {} line exists because without it, the file would be treated as an ambient module which prevents you from adding import declarations.\nIf you need to add ambient declare module declarations, do so in a separate file like src/ambient.d.ts.\n\nBy populating these interfaces, you will gain type safety when using event.locals, event.platform, and data from load functions."
		},
		{
			breadcrumbs: ['Types', 'App', 'Error'],
			href: '/docs/types#app-error',
			content:
				'Defines the common shape of expected and unexpected errors. Expected errors are thrown using the error function. Unexpected errors are handled by the handleError hooks which should return this shape.\n\n\ninterface Error {/*…*/}\nmessage: string;'
		},
		{
			breadcrumbs: ['Types', 'App', 'Locals'],
			href: '/docs/types#app-locals',
			content:
				'The interface that defines event.locals, which can be accessed in hooks (handle, and handleError), server-only load functions, and +server.js files.\n\n\ninterface Locals {}'
		},
		{
			breadcrumbs: ['Types', 'App', 'PageData'],
			href: '/docs/types#app-pagedata',
			content:
				'Defines the common shape of the $page.data store - that is, the data that is shared between all pages.\nThe Load and ServerLoad functions in ./$types will be narrowed accordingly.\nUse optional properties for data that is only present on specific pages. Do not add an index signature ([key: string]: any).\n\n\ninterface PageData {}'
		},
		{
			breadcrumbs: ['Types', 'App', 'Platform'],
			href: '/docs/types#app-platform',
			content:
				'If your adapter provides platform-specific context via event.platform, you can specify it here.\n\n\ninterface Platform {}'
		},
		{ breadcrumbs: ['Integrations'], href: '/docs/integrations', content: '' },
		{
			breadcrumbs: ['Integrations', 'Preprocessors'],
			href: '/docs/integrations#preprocessors',
			content:
				'Preprocessors transform your .svelte files before passing them to the compiler. For example, if your .svelte file uses TypeScript and PostCSS, it must first be transformed into JavaScript and CSS so that the Svelte compiler can handle it. There are many available preprocessors. The Svelte team maintains two official ones discussed below.'
		},
		{
			breadcrumbs: ['Integrations', 'Preprocessors', '`vitePreprocess`'],
			href: '/docs/integrations#preprocessors-vitepreprocess',
			content:
				"vite-plugin-svelte offers a vitePreprocess feature which utilizes Vite for preprocessing. It is capable of handling the language flavors Vite handles: TypeScript, PostCSS, SCSS, Less, Stylus, and SugarSS. For convenience, it is re-exported from the @sveltejs/kit/vite package. If you set your project up with TypeScript it will be included by default:\n\n// svelte.config.js\nimport { vitePreprocess } from '@sveltejs/kit/vite';\n\nexport default {\n  preprocess: [vitePreprocess()]\n};"
		},
		{
			breadcrumbs: ['Integrations', 'Preprocessors', '`svelte-preprocess`'],
			href: '/docs/integrations#preprocessors-svelte-preprocess',
			content:
				'svelte-preprocess has some additional functionality not found in vitePreprocess such as support for Pug, Babel, and global styles. However, vitePreprocess may be faster and require less configuration, so it is used by default. Note that CoffeeScript is not supported by SvelteKit.\n\nYou will need to install svelte-preprocess with npm install --save-dev svelte-preprocess and add it to your svelte.config.js. After that, you will often need to install the corresponding library such as npm install -D sass or npm install -D less.'
		},
		{
			breadcrumbs: ['Integrations', 'Adders'],
			href: '/docs/integrations#adders',
			content:
				'Svelte Adders allow you to setup many different complex integrations like Tailwind, PostCSS, Storybook, Firebase, GraphQL, mdsvex, and more with a single command. Please see sveltesociety.dev for a full listing of templates, components, and tools available for use with Svelte and SvelteKit.'
		},
		{
			breadcrumbs: ['Integrations', 'Integration FAQs'],
			href: '/docs/integrations#integration-faqs',
			content:
				'The SvelteKit FAQ has a section on integrations, which may be helpful if you still have questions.'
		},
		{
			breadcrumbs: ['Migrating from Sapper'],
			href: '/docs/migrating',
			content:
				'SvelteKit is the successor to Sapper and shares many elements of its design.\n\nIf you have an existing Sapper app that you plan to migrate to SvelteKit, there are a number of changes you will need to make. You may find it helpful to view some examples while migrating.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'package.json'],
			href: '/docs/migrating#package-json',
			content: '',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'package.json', 'type: "module"'],
			href: '/docs/migrating#package-json-type-module',
			content:
				'Add &quot;type&quot;: &quot;module&quot; to your package.json. You can do this step separately from the rest as part of an incremental migration if you are using Sapper 0.29.3\nor newer.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'package.json', 'dependencies'],
			href: '/docs/migrating#package-json-dependencies',
			content:
				"Remove polka or express, if you're using one of those, and any middleware such as sirv or compression.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'package.json', 'devDependencies'],
			href: '/docs/migrating#package-json-devdependencies',
			content:
				'Remove sapper from your devDependencies and replace it with @sveltejs/kit and whichever adapter you plan to use (see next section).',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'package.json', 'scripts'],
			href: '/docs/migrating#package-json-scripts',
			content:
				'Any scripts that reference sapper should be updated:\n\nsapper build should become vite build using the Node adapter\nsapper export should become vite build using the static adapter\nsapper dev should become vite dev\nnode __sapper__/build should become node build',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files'],
			href: '/docs/migrating#project-files',
			content:
				'The bulk of your app, in src/routes, can be left where it is, but several project files will need to be moved or updated.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'Configuration'],
			href: '/docs/migrating#project-files-configuration',
			content:
				"Your webpack.config.js or rollup.config.js should be replaced with a svelte.config.js, as documented here. Svelte preprocessor options should be moved to config.preprocess.\n\nYou will need to add an adapter. sapper build is roughly equivalent to adapter-node while sapper export is roughly equivalent to adapter-static, though you might prefer to use an adapter designed for the platform you're deploying to.\n\nIf you were using plugins for filetypes that are not automatically handled by Vite, you will need to find Vite equivalents and add them to the Vite config.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'src/client.js'],
			href: '/docs/migrating#project-files-src-client-js',
			content:
				'This file has no equivalent in SvelteKit. Any custom logic (beyond sapper.start(...)) should be expressed in your +layout.svelte file, inside an onMount callback.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'src/server.js'],
			href: '/docs/migrating#project-files-src-server-js',
			content:
				'When using adapter-node the equivalent is a custom server. Otherwise, this file has no direct equivalent, since SvelteKit apps can run in serverless environments.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'src/service-worker.js'],
			href: '/docs/migrating#project-files-src-service-worker-js',
			content:
				'Most imports from @sapper/service-worker have equivalents in $service-worker:\n\nfiles is unchanged\nroutes has been removed\nshell is now build\ntimestamp is now version',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'src/template.html'],
			href: '/docs/migrating#project-files-src-template-html',
			content:
				'The src/template.html file should be renamed src/app.html.\n\nRemove %sapper.base%, %sapper.scripts% and %sapper.styles%. Replace %sapper.head% with %sveltekit.head% and %sapper.html% with %sveltekit.body%. The <div id=&quot;sapper&quot;> is no longer necessary.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Project files', 'src/node_modules'],
			href: '/docs/migrating#project-files-src-node-modules',
			content:
				"A common pattern in Sapper apps is to put your internal library in a directory inside src/node_modules. This doesn't work with Vite, so we use src/lib instead.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts'],
			href: '/docs/migrating#pages-and-layouts',
			content: '',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Renamed files'],
			href: '/docs/migrating#pages-and-layouts-renamed-files',
			content:
				'Routes now are made up of the folder name exclusively to remove ambiguity, the folder names leading up to a +page.svelte correspond to the route. See the routing docs for an overview. The following shows a old/new comparison:\n\nOld New \n\nYour custom error page component should be renamed from _error.svelte to +error.svelte. Any _layout.svelte files should likewise be renamed +layout.svelte. Any other files are ignored.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Imports'],
			href: '/docs/migrating#pages-and-layouts-imports',
			content:
				'The goto, prefetch and prefetchRoutes imports from @sapper/app should be replaced with goto, preloadData and preloadCode imports respectively from $app/navigation.\n\nThe stores import from @sapper/app should be replaced — see the Stores section below.\n\nAny files you previously imported from directories in src/node_modules will need to be replaced with $lib imports.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Preload'],
			href: '/docs/migrating#pages-and-layouts-preload',
			content:
				'As before, pages and layouts can export a function that allows data to be loaded before rendering takes place.\n\nThis function has been renamed from preload to load, it now lives in a +page.js (or +layout.js) next to its +page.svelte (or +layout.svelte), and its API has changed. Instead of two arguments — page and session — there is a single event argument.\n\nThere is no more this object, and consequently no this.fetch, this.error or this.redirect. Instead, you can get fetch from the input methods, and both error and redirect are now thrown.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Stores'],
			href: '/docs/migrating#pages-and-layouts-stores',
			content:
				"In Sapper, you would get references to provided stores like so:\n\nimport { stores } from '@sapper/app';\nconst { preloading, page, session } = stores();The page store still exists; preloading has been replaced with a navigating store that contains from and to properties. page now has url and params properties, but no path or query.\n\nYou access them differently in SvelteKit. stores is now getStores, but in most cases it is unnecessary since you can import navigating, and page directly from $app/stores.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Routing'],
			href: '/docs/migrating#pages-and-layouts-routing',
			content: 'Regex routes are no longer supported. Instead, use advanced route matching.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'Segments'],
			href: '/docs/migrating#pages-and-layouts-segments',
			content:
				"Previously, layout components received a segment prop indicating the child segment. This has been removed; you should use the more flexible $page.url.pathname value to derive the segment you're interested in.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', 'URLs'],
			href: '/docs/migrating#pages-and-layouts-urls',
			content:
				"In Sapper, all relative URLs were resolved against the base URL — usually /, unless the basepath option was used — rather than against the current page.\n\nThis caused problems and is no longer the case in SvelteKit. Instead, relative URLs are resolved against the current page (or the destination page, for fetch URLs in load functions) instead. In most cases, it's easier to use root-relative (i.e. starts with /) URLs, since their meaning is not context-dependent.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Pages and layouts', '&lt;a&gt; attributes'],
			href: '/docs/migrating#pages-and-layouts-a-attributes',
			content:
				'sapper:prefetch is now data-sveltekit-preload-data\nsapper:noscroll is now data-sveltekit-noscroll',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Endpoints'],
			href: '/docs/migrating#endpoints',
			content:
				"In Sapper, server routes received the req and res objects exposed by Node's http module (or the augmented versions provided by frameworks like Polka and Express).\n\nSvelteKit is designed to be agnostic as to where the app is running — it could be running on a Node server, but could equally be running on a serverless platform or in a Cloudflare Worker. For that reason, you no longer interact directly with req and res. Your endpoints will need to be updated to match the new signature.\n\nTo support this environment-agnostic behavior, fetch is now available in the global context, so you don't need to import node-fetch, cross-fetch, or similar server-side fetch implementations in order to use it.",
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Integrations'],
			href: '/docs/migrating#integrations',
			content: 'See the FAQ for detailed information about integrations.',
			rank: 1
		},
		{
			breadcrumbs: ['Migrating from Sapper', 'Integrations', 'HTML minifier'],
			href: '/docs/migrating#integrations-html-minifier',
			content:
				"Sapper includes html-minifier by default. SvelteKit does not include this, but you can add it as a prod dependency and then use it through a hook:\n\nimport { minify } from 'html-minifier';\nimport { building } from '$app/environment';\n\nconst minification_options = {\n    collapseBooleanAttributes: true,\n    collapseWhitespace: true,\n    conservativeCollapse: true,\n    decodeEntities: true,\n    html5: true,\n    ignoreCustomComments: [/^#/],\n    minifyCSS: true,\n    minifyJS: false,\n    removeAttributeQuotes: true,\n    removeComments: false, // some hydration code needs comments, so leave them in\n    removeOptionalTags: true,\n    removeRedundantAttributes: true,\n    removeScriptTypeAttributes: true,\n    removeStyleLinkTypeAttributes: true,\n    sortAttributes: true,\n    sortClassName: true\n};\n\n/** @type {import('@sveltejs/kit').Handle} */\nexport async function handle({ event, resolve }) {\n    let page = '';\n\n    return resolve(event, {\n        transformPageChunk: ({ html, done }) => {\n            page += html;\n            if (done) {\n                return building ? minify(page, minification_options) : page;\n            }\n        }\n    });\n}Note that prerendering is false when using vite preview to test the production build of the site, so to verify the results of minifying, you'll need to inspect the built HTML files directly.",
			rank: 1
		},
		{ breadcrumbs: ['Additional resources'], href: '/docs/additional-resources', content: '' },
		{
			breadcrumbs: ['Additional resources', 'FAQs'],
			href: '/docs/additional-resources#faqs',
			content:
				'Please see the SvelteKit FAQ for solutions to common issues and helpful tips and tricks.\n\nThe Svelte FAQ and vite-plugin-svelte FAQ may also be helpful for questions deriving from those libraries.'
		},
		{
			breadcrumbs: ['Additional resources', 'Examples'],
			href: '/docs/additional-resources#examples',
			content:
				"We've written and published a few different SvelteKit sites as examples:\n\nsveltejs/realworld contains an example blog site\nThe sites/kit.svelte.dev directory contains the code for this site\nsveltejs/sites contains the code for svelte.dev and for a HackerNews clone\n\nSvelteKit users have also published plenty of examples on GitHub, under the #sveltekit and #sveltekit-template topics, as well as on the Svelte Society site. Note that these have not been vetted by the maintainers and may not be up to date."
		},
		{
			breadcrumbs: ['Additional resources', 'Support'],
			href: '/docs/additional-resources#support',
			content:
				"You can ask for help on Discord and StackOverflow. Please first search for information related to your issue in the FAQ, Google or another search engine, issue tracker, and Discord chat history in order to be respectful of others' time. There are many more people asking questions than answering them, so this will help in allowing the community to grow in a scalable fashion."
		},
		{
			breadcrumbs: ['Glossary'],
			href: '/docs/glossary',
			content:
				'The core of SvelteKit provides a highly configurable rendering engine. This section describes some of the terms used when discussing rendering. A reference for setting these options is provided in the documentation above.'
		},
		{
			breadcrumbs: ['Glossary', 'CSR'],
			href: '/docs/glossary#csr',
			content:
				'Client-side rendering (CSR) is the generation of the page contents in the web browser using JavaScript.\n\nIn SvelteKit, client-side rendering will be used by default, but you can turn off JavaScript with the csr = false page option.'
		},
		{
			breadcrumbs: ['Glossary', 'Hydration'],
			href: '/docs/glossary#hydration',
			content:
				'Svelte components store some state and update the DOM when the state is updated. When fetching data during SSR, by default SvelteKit will store this data and transmit it to the client along with the server-rendered HTML. The components can then be initialized on the client with that data without having to call the same API endpoints again. Svelte will then check that the DOM is in the expected state and attach event listeners in a process called hydration. Once the components are fully hydrated, they can react to changes to their properties just like any newly created Svelte component.\n\nIn SvelteKit, pages will be hydrated by default, but you can turn off JavaScript with the csr = false page option.'
		},
		{
			breadcrumbs: ['Glossary', 'Prerendering'],
			href: '/docs/glossary#prerendering',
			content:
				"Prerendering means computing the contents of a page at build time and saving the HTML for display. This approach has the same benefits as traditional server-rendered pages, but avoids recomputing the page for each visitor and so scales nearly for free as the number of visitors increases. The tradeoff is that the build process is more expensive and prerendered content can only be updated by building and deploying a new version of the application.\n\nNot all pages can be prerendered. The basic rule is this: for content to be prerenderable, any two users hitting it directly must get the same content from the server, and the page must not contain actions. Note that you can still prerender content that is loaded based on the page's parameters as long as all users will be seeing the same prerendered content.\n\nPre-rendered pages are not limited to static content. You can build personalized pages if user-specific data is fetched and rendered client-side. This is subject to the caveat that you will experience the downsides of not doing SSR for that content as discussed above.\n\nIn SvelteKit, you can control prerendering with the prerender page option and prerender config in svelte.config.js."
		},
		{
			breadcrumbs: ['Glossary', 'Routing'],
			href: '/docs/glossary#routing',
			content:
				"By default, when you navigate to a new page (by clicking on a link or using the browser's forward or back buttons), SvelteKit will intercept the attempted navigation and handle it instead of allowing the browser to send a request to the server for the destination page. SvelteKit will then update the displayed contents on the client by rendering the component for the new page, which in turn can make calls to the necessary API endpoints. This process of updating the page on the client in response to attempted navigation is called client-side routing.\n\nIn SvelteKit, client-side routing will be used by default, but you can skip it with data-sveltekit-reload."
		},
		{
			breadcrumbs: ['Glossary', 'SPA'],
			href: '/docs/glossary#spa',
			content:
				'A single-page app (SPA) is an application in which all requests to the server load a single HTML file which then does client-side rendering of the requested contents based on the requested URL. All navigation is handled on the client-side in a process called client-side routing with per-page contents being updated and common layout elements remaining largely unchanged. SPAs do not provide SSR, which has the shortcoming described above. However, some applications are not greatly impacted by these shortcomings such as a complex business application behind a login where SEO would not be important and it is known that users will be accessing the application from a consistent computing environment.\n\nIn SvelteKit, you can build a SPA with adapter-static.'
		},
		{
			breadcrumbs: ['Glossary', 'SSG'],
			href: '/docs/glossary#ssg',
			content:
				'Static Site Generation (SSG) is a term that refers to a site where every page is prerendered. SvelteKit was not built to do only static site generation like some tools and so may not scale as well to efficiently render a very large number of pages as tools built specifically for that purpose. However, in contrast to most purpose-built SSGs, SvelteKit does nicely allow for mixing and matching different rendering types on different pages. One benefit of fully prerendering a site is that you do not need to maintain or pay for servers to perform SSR. Once generated, the site can be served from CDNs, leading to great &quot;time to first byte&quot; performance. This delivery model is often referred to as JAMstack.\n\nIn SvelteKit, you can do static site generation by using adapter-static or by configuring every page to be prerendered using the prerender page option or prerender config in svelte.config.js.'
		},
		{
			breadcrumbs: ['Glossary', 'SSR'],
			href: '/docs/glossary#ssr',
			content:
				'Server-side rendering (SSR) is the generation of the page contents on the server. SSR is generally preferred for SEO. While some search engines can index content that is dynamically generated on the client-side it may take longer even in these cases. It also tends to improve perceived performance and makes your app accessible to users if JavaScript fails or is disabled (which happens more often than you probably think).\n\nIn SvelteKit, pages are server-side rendered by default. You can disable SSR with the ssr page option.'
		},
		{
			breadcrumbs: ['FAQ', 'Other resources'],
			href: '/faq#other-resources',
			content:
				'Please see the Svelte FAQ and vite-plugin-svelte FAQ as well for the answers to questions deriving from those libraries.'
		},
		{
			breadcrumbs: ['FAQ', 'How do I use HMR with SvelteKit?'],
			href: '/faq#hmr',
			content:
				"SvelteKit has HMR enabled by default powered by svelte-hmr. If you saw Rich's presentation at the 2020 Svelte Summit, you may have seen a more powerful-looking version of HMR presented. This demo had svelte-hmr's preserveLocalState flag on. This flag is now off by default because it may lead to unexpected behaviour and edge cases. But don't worry, you are still getting HMR with SvelteKit! If you'd like to preserve local state you can use the @hmr:keep or @hmr:keep-all directives as documented on the svelte-hmr page."
		},
		{
			breadcrumbs: ['FAQ', 'How do I include details from package.json in my application?'],
			href: '/faq#read-package-json',
			content:
				"You cannot directly require JSON files, since SvelteKit expects svelte.config.js to be an ES module. If you'd like to include your application's version number or other information from package.json in your application, you can load JSON like so:\n\nimport { readFileSync } from 'fs';\nimport { fileURLToPath } from 'url';\n\nconst file = fileURLToPath(new URL('package.json', import.meta.url));\nconst json = readFileSync(file, 'utf8');\nconst pkg = JSON.parse(json);"
		},
		{
			breadcrumbs: ['FAQ', "How do I fix the error I'm getting trying to include a package?"],
			href: '/faq#packages',
			content:
				"Most issues related to including a library are due to incorrect packaging. You can check if a library's packaging is compatible with Node.js by entering it into the publint website.\n\nHere are a few things to keep in mind when checking if a library is packaged correctly:\n\nexports takes precedence over the other entry point fields such as main and module. Adding an exports field may not be backwards-compatible as it prevents deep imports.\nESM files should end with .mjs unless &quot;type&quot;: &quot;module&quot; is set in which any case CommonJS files should end with .cjs.\nmain should be defined if exports is not. It should be either a CommonJS or ESM file and adhere to the previous bullet. If a module field is defined, it should refer to an ESM file.\nSvelte components should be distributed as uncompiled .svelte files with any JS in the package written as ESM only. Custom script and style languages, like TypeScript and SCSS, should be preprocessed as vanilla JS and CSS respectively. We recommend using svelte-package for packaging Svelte libraries, which will do this for you.\n\nLibraries work best in the browser with Vite when they distribute an ESM version, especially if they are dependencies of a Svelte component library. You may wish to suggest to library authors that they provide an ESM version. However, CommonJS (CJS) dependencies should work as well since, by default, vite-plugin-svelte will ask Vite to pre-bundle them using esbuild to convert them to ESM.\n\nIf you are still encountering issues we recommend searching both the Vite issue tracker and the issue tracker of the library in question. Sometimes issues can be worked around by fiddling with the optimizeDeps or ssr config values though we recommend this as only a short-term workaround in favor of fixing the library in question."
		},
		{
			breadcrumbs: ['FAQ', 'How do I use X with SvelteKit?'],
			href: '/faq#integrations',
			content:
				"Make sure you've read the documentation section on integrations. If you're still having trouble, solutions to common issues are listed below.\n\nHow do I setup a database?\nPut the code to query your database in a server route - don't query the database in .svelte files. You can create a db.js or similar that sets up a connection immediately and makes the client accessible throughout the app as a singleton. You can execute any one-time setup code in hooks.js and import your database helpers into any endpoint that needs them.\n\nHow do I use a client-side only library that depends on document or window?\nIf you need access to the document or window variables or otherwise need code to run only on the client-side you can wrap it in a browser check:\n\nimport { browser } from '$app/environment';\n\nif (browser) {\n    // client-only code here\n}You can also run code in onMount if you'd like to run it after the component has been first rendered to the DOM:\n\nimport { onMount } from 'svelte';\n\nonMount(async () => {\n    const { method } = await import('some-browser-only-library');\n    method('hello world');\n});If the library you'd like to use is side-effect free you can also statically import it and it will be tree-shaken out in the server-side build where onMount will be automatically replaced with a no-op:\n\nimport { onMount } from 'svelte';\nimport { method } from 'some-browser-only-library';\n\nonMount(() => {\n    method('hello world');\n});Otherwise, if the library has side effects and you'd still prefer to use static imports, check out vite-plugin-iso-import to support the ?client import suffix. The import will be stripped out in SSR builds. However, note that you will lose the ability to use VS Code Intellisense if you use this method.\n\nimport { onMount } from 'svelte';\nimport { method } from 'some-browser-only-library?client';\n\nonMount(() => {\n    method('hello world');\n});How do I use a different backend API server?\nYou can use event.fetch to request data from an external API server, but be aware that you would need to deal with CORS, which will result in complications such as generally requiring requests to be preflighted resulting in higher latency. Requests to a separate subdomain may also increase latency due to an additional DNS lookup, TLS setup, etc. If you wish to use this method, you may find handleFetch helpful.\n\nAnother approach is to set up a proxy to bypass CORS headaches. In production, you would rewrite a path like /api to the API server; for local development, use Vite's server.proxy option.\n\nHow to setup rewrites in production will depend on your deployment platform. If rewrites aren't an option, you could alternatively add an API route:\n\n/// file: src/routes/api/[...path]/+server.js\n/** @type {import('./$types').RequestHandler} */\nexport function GET({ params, url }) {\n    return fetch(`https://my-api-server.com/${params.path + url.search}`);\n}(Note that you may also need to proxy POST/PATCH etc requests, and forward request.headers, depending on your needs.)\n\nHow do I use middleware?\nadapter-node builds a middleware that you can use with your own server for production mode. In dev, you can add middleware to Vite by using a Vite plugin. For example:\n\nimport { sveltekit } from '@sveltejs/kit/vite';\n\n/** @type {import('vite').Plugin} */\nconst myPlugin = {\n    name: 'log-request-middleware',\n    configureServer(server) {\n        server.middlewares.use((req, res, next) => {\n            console.log(`Got request ${req.url}`);\n            next();\n        });\n    }\n};\n\n/** @type {import('vite').UserConfig} */\nconst config = {\n    plugins: [myPlugin, sveltekit()]\n};\n\nexport default config;See Vite's configureServer docs for more details including how to control ordering.\n\nDoes it work with Yarn 2?\nSort of. The Plug'n'Play feature, aka 'pnp', is broken (it deviates from the Node module resolution algorithm, and doesn't yet work with native JavaScript modules which SvelteKit — along with an increasing number of packages — uses). You can use nodeLinker: 'node-modules' in your .yarnrc.yml file to disable pnp, but it's probably easier to just use npm or pnpm, which is similarly fast and efficient but without the compatibility headaches.\n\nHow do I use with Yarn 3?\nCurrently ESM Support within the latest Yarn (version 3) is considered experimental.\n\nThe below seems to work although your results may vary.\n\nFirst create a new application:\n\nyarn create svelte myapp\ncd myappAnd enable Yarn Berry:\n\nyarn set version berry\nyarn installYarn 3 global cache\n\nOne of the more interesting features of Yarn Berry is the ability to have a single global cache for packages, instead of having multiple copies for each project on the disk. However, setting enableGlobalCache to true causes building to fail, so it is recommended to add the following to the .yarnrc.yml file:\n\nnodeLinker: node-modulesThis will cause packages to be downloaded into a local node_modules directory but avoids the above problem and is your best bet for using version 3 of Yarn at this point in time."
		}
	];
}
