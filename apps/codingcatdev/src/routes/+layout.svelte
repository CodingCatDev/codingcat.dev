<script>
	import { ContentType, getContentTypePlural } from '$lib/types/index';
	import { MetaTags } from 'svelte-meta-tags';
	import { PUBLIC_FACEBOOK_APP_ID } from '$env/static/public';
	import { page } from '$app/stores';

	import '../app.postcss';
	import TopNav from '$lib/components/layout/TopNav.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import DrawerNav from '$lib/components/layout/DrawerNav.svelte';

	// TODO: https://github.com/sveltejs/kit/issues/2733
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	/** @type {HTMLElement} */
	let contentElem;
	afterNavigate(() => {
		setTimeout(() => {
			contentElem.scrollTo(0, 0);
		}, 0);
	});

	/** @type {import('$lib/types/index').Content} */
	const content = $page?.data?.content;
	/** @type {import('$lib/types/index').ContentType} */
	const contentType = $page?.data?.contentType;
	const contentTypePlural = getContentTypePlural(contentType);
	const title =
		content?.title ||
		(contentTypePlural
			? `${contentTypePlural.charAt(0)?.toUpperCase() + contentTypePlural.slice(1)} | `
			: '') + `CodingCat.dev`;
	const description =
		content?.excerpt ||
		'Codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!';
	const url = `https://codingcat.dev/${
		content?.slug ? `${contentType}/${content.slug}` : getContentTypePlural(contentType) || ''
	}`;
	const images = content?.cover
		? [
				{
					url: content?.cover?.replace(
						'https://media.codingcat.dev/image/upload/',
						'https://media.codingcat.dev/image/upload/f_jpg/'
					),
					alt: content?.title || 'Cover Image'
				}
		  ]
		: [
				{
					url: 'https://media.codingcat.dev/image/upload/f_jpg/dev-codingcatdev-photo/v60h88eohd7ufghkspgo',
					alt: 'AJ Logo Black Cat Face with CodingCat.dev Domain'
				}
		  ];
</script>

<MetaTags
	{title}
	{description}
	canonical={url}
	facebook={{
		appId: PUBLIC_FACEBOOK_APP_ID || ''
	}}
	openGraph={{
		type: 'website',
		url,
		title,
		description,
		images
	}}
	twitter={{
		handle: '@CodingCatDev',
		site: '@CodingCatDev',
		cardType: 'summary_large_image'
	}}
/>
<div class="drawer drawer-end">
	<input
		id="ccd-drawer"
		name="ccd-drawer"
		type="checkbox"
		class="drawer-toggle"
		aria-label="Click to Open Drawer"
	/>
	<div
		bind:this={contentElem}
		class="flex flex-col drawer-content"
		style="scroll-behavior: smooth; scroll-padding-top: 5rem;"
	>
		<TopNav />
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
	<div class="drawer-side">
		<label for="ccd-drawer" class="drawer-overlay" />
		<DrawerNav />
	</div>
</div>
