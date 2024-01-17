<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import SponsorshipCards from './SponsorshipCards.svelte';
</script>

<svelte:head>
	<title>Sponsorships</title>
	<!-- Meta Tags -->
	<meta name="title" content="CodingCat.dev Sponsorships" />
	<meta name="description" content="CodingCat.dev Sponsorships" />
	<meta name="keywords" content="codingcatdev, webdev, webdevelopment, learning, beginner" />
	<meta name="theme-color" content="#6366f1" />
	<meta name="author" content="CodingCatDev, LLC" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="CodingCat.dev Sponsorships" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://codingcat.dev/sponsorships" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content="Sponsorships" />
	<meta property="og:description" content="CodingCat.dev Sponsorships" />
	<meta
		property="og:image"
		content="https://media.codingcat.dev/image/upload/main-codingcatdev-photo/Sponsorship.png"
	/>
	<meta
		property="og:image:secure_url"
		content="https://media.codingcat.dev/image/upload/main-codingcatdev-photo/Sponsorship.png"
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />

	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@CodingCatDev" />
	<meta name="twitter:creator" content="@CodingCatDev" />
	<meta name="twitter:title" content="Sponsorships" />
	<meta name="twitter:description" content="CodingCat.dev Sponsorships" />
	<meta
		name="twitter:image"
		content="https://media.codingcat.dev/image/upload/main-codingcatdev-photo/Sponsorship.png"
	/>
</svelte:head>

<div class="flex justify-center">
	<section class="flex flex-col justify-center w-full gap-8 p-2 xl:flex-row xl:p-8">
		<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
			<Image
				src="https://media.codingcat.dev/image/upload/main-codingcatdev-photo/Sponsorship.png"
				alt="Ad Sponsorship"
			/>

			<SponsorshipCards />
		</div>
	</section>
</div>
