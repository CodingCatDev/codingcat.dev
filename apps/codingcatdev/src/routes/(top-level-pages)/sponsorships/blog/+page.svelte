<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import AJPrimary from '$lib/components/global/icons/AJPrimary.svelte';
</script>

<svelte:head>
	<title>Blog Sponsorship</title>
	<!-- Meta Tags -->
	<meta name="title" content="CodingCat.dev Blog Sponsorship" />
	<meta name="description" content="CodingCat.dev Blog Sponsorship" />
	<meta name="keywords" content="codingcatdev, webdev, webdevelopment, learning, beginner" />
	<meta name="theme-color" content="#6366f1" />
	<meta name="author" content="CodingCatDev, LLC" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="CodingCat.dev Blog Sponsorship" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://codingcat.dev/sponsorships" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content="Blog Sponsorship" />
	<meta property="og:description" content="CodingCat.dev Blog Sponsorship" />
	<meta
		property="og:image"
		content="https://media.codingcat.dev/image/upload/v1686700627/main-codingcatdev-photo/blog-sponsorship.png"
	/>
	<meta
		property="og:image:secure_url"
		content="https://media.codingcat.dev/image/upload/v1686700627/main-codingcatdev-photo/blog-sponsorship.png"
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />

	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@CodingCatDev" />
	<meta name="twitter:creator" content="@CodingCatDev" />
	<meta name="twitter:title" content="Sponsorships" />
	<meta name="twitter:description" content="CodingCat.dev Blog Sponsorship" />
	<meta
		name="twitter:image"
		content="https://media.codingcat.dev/image/upload/v1686699444/main-codingcatdev-photo/blog-sponsorship.png"
	/>
</svelte:head>

<ol class="breadcrumb">
	<li class="capitalize crumb"><a href="/sponsorships">Sponsorships</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li>Blog Sponsorship</li>
</ol>

<section class="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8 markdown">
	<div class="flex flex-col items-center sm:hidden">
		<AJPrimary cls="w-48 h-48" />
	</div>
	<div class="flex justify-center m-4">
		<h1 class="flex flex-col gap-2">
			<span class="text-xl md:text-4xl">Sponsorship for</span>
			<span class="md:text-6xl font-extrabold"> CodingCat.dev Blog </span>
			<span class="text-xl md:text-2xl">a CodingCat.dev Production</span>
		</h1>
		<div class="flex-col items-center hidden sm:flex">
			<AJPrimary cls="w-48 h-48" />
		</div>
	</div>
	<div class="flex justify-center card variant-soft-surface">
		<div class="flex flex-col p-8">
			<div class="flex justify-center w-full gap-4 p-8 font-extrabold">
				<p class="text-4xl">
					<span class="text-8xl text-primary-500"> Why </span>
					<span class="font-bold">would you sponsor our blog?</span>
				</p>
			</div>
			<p>
				Blog sponsorship is a great way to reach a highly engaged audience of potential customers.
				By sponsoring a blog post, your company can be featured prominently on a popular blog, with
				the opportunity to reach a large number of readers who are already interested in the topics
				you post is about.
			</p>
		</div>
	</div>

	<div class="flex flex-wrap justify-center p-8 bg-basics-900 text-primary-50 rounded-xl">
		<iframe
			class="w-full border-none rounded-xl"
			height="720px"
			src="https://notionforms.io/forms/sponsor-submissions"
			title="Sponsorship Form"
		/>
	</div>
</section>
