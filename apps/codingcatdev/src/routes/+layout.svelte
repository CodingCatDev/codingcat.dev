<script lang="ts">
	export let data;

	// Core
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { navigationIsDelayed, storeCurrentUrl, storeUser } from '$lib/stores/stores';

	//Style
	import '../app.postcss';

	// BlackCatUI Components
	import { AppShell, Modal, ProgressCircle, Toast, storePopup } from '@codingcatdev/blackcatui';

	// Depedency: Floating UI
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// CodingCat.Dev Components
	import CcdAppBar from './(layout-partials)/CcdAppBar.svelte';
	import CcdDrawer from './(layout-partials)/CcdDrawer.svelte';
	import CcdFooter from './(layout-partials)/CcdFooter.svelte';
	import type { Author, Content } from '$lib/types';

	// Scroll heading into view
	function scrollHeadingIntoView(): void {
		if (!window.location.hash) return;
		const elemTarget: HTMLElement | null = document.querySelector(window.location.hash);
		if (elemTarget) elemTarget.scrollIntoView({ behavior: 'smooth' });
	}

	// Lifecycle
	afterNavigate((params: any) => {
		storeUser.set({
			email: data.user?.email,
			picture: data.user?.picture,
			uid: data.user?.uid
		});

		// Store current page route URL
		storeCurrentUrl.set($page.url.pathname);
		// Scroll to top
		const isNewPage: boolean =
			params.from && params.to && params.from.url.pathname !== params.to.url.pathname;
		const elemPage = document.querySelector('#bcu-app-shell-page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
		// Scroll heading into view
		scrollHeadingIntoView();
	});

	// SEO Metatags
	const metaDefaults = {
		title: 'CodingCat.dev',
		description:
			'Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!',
		image:
			'https://media.codingcat.dev/image/upload/f_jpg/dev-codingcatdev-photo/v60h88eohd7ufghkspgo'
	};
	const meta = {
		title: metaDefaults.title,
		description: metaDefaults.description,
		image: metaDefaults.image,
		// Article
		article: { publishTime: '', modifiedTime: '', author: '' },
		// Twitter
		twitter: {
			title: metaDefaults.title,
			description: metaDefaults.description,
			image: metaDefaults.image
		}
	};

	let content: (Content & Author) | undefined = undefined;
	let authors: Author[] | undefined = undefined;
	page.subscribe((page) => {
		content = page?.data?.content || page?.data?.course;
		authors = page?.data?.authors;

		// Restore Page Defaults
		meta.title = metaDefaults.title;
		meta.description = metaDefaults.description;
		meta.image = metaDefaults.image;
		// Restore Twitter Defaults
		meta.twitter.title = metaDefaults.title;
		meta.twitter.description = metaDefaults.description;
		meta.twitter.image = metaDefaults.image;
		console.log(content);

		if (content && !Array.isArray(content)) {
			// Post Data
			meta.title = content.title ? `${content.title}` : `${content.name}`;
			meta.description = `${content.excerpt}`;
			meta.image = `${content.cover}`;
			// Article
			meta.article.publishTime = content?.start
				? new Date(content?.start).toISOString()
				: new Date().toISOString();
			meta.article.modifiedTime = content?.updated
				? new Date(content?.updated).toISOString()
				: content?.start
				? content?.start.toISOString()
				: new Date().toISOString();
			meta.article.author = `${authors?.[0]?.name || 'Alex Patterson'}`;
			// Twitter
			meta.twitter.title = meta.title;
			meta.twitter.description = meta.description;
			meta.twitter.image = meta.image;
		}
	});
</script>

<svelte:head>
	<title>{meta.title}</title>
	<!-- Meta Tags -->
	<meta name="title" content={meta.title} />
	<meta name="description" content={meta.description} />
	<meta name="keywords" content="codingcatdev, webdev, webdevelopment, learning, beginner" />
	<meta name="theme-color" content="#6366f1" />
	<meta name="author" content="CodingCatDev, LLC" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="CodingCat.dev" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://codingcat.dev{$page.url.pathname}" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={meta.image} />
	<meta property="og:image:secure_url" content={meta.image} />
	<meta property="og:image:type" content="image/jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />

	<!-- OG: Article -->
	{#if content}
		<meta property="article:published_time" content={meta.article.publishTime} />
		<meta property="article:modified_time" content={meta.article.modifiedTime} />
		<meta property="article:author" content={meta.article.author} />
	{/if}

	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@CodingCatDev" />
	<meta name="twitter:creator" content="@CodingCatDev" />
	<meta name="twitter:title" content={meta.twitter.title} />
	<meta name="twitter:description" content={meta.twitter.description} />
	<meta name="twitter:image" content={meta.twitter.image} />
</svelte:head>

<!-- Overlays -->
<CcdDrawer />
<Modal />
<Toast />

<!-- App Shell -->
<AppShell regionPage="overflow-y-scroll" slotPageFooter="pt-4 bg-surface-50-900-token" }>
	<!-- Header -->
	<svelte:fragment slot="bcu-app-shell-header"><CcdAppBar /></svelte:fragment>

	<!-- Page Content -->
	{#if $navigationIsDelayed}
		<!-- LOOK HERE -->
		<div class="flex flex-col items-center gap-2 m-2 md:m-8 md:gap-8">
			<ProgressCircle stroke={60} value={undefined} width="w-20 md:w-36" />
			<h1 class="text-center ext-3xl text-cText">Fetching...</h1>
		</div>
	{:else}
		<slot />
	{/if}

	<!-- Page Footer -->
	<svelte:fragment slot="bcu-app-shell-page-footer"><CcdFooter /></svelte:fragment>
</AppShell>
