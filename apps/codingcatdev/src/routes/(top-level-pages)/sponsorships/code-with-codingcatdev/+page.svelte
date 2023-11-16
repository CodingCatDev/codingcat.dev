<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import AJPrimary from '$lib/components/global/icons/AJPrimary.svelte';
	import SponsorshipForm from '../SponsorshipForm.svelte';
</script>

<svelte:head>
	<title>Code with CodingCat.dev Sponsorship</title>
	<!-- Meta Tags -->
	<meta name="title" content="Code with CodingCat.dev Sponsorship" />
	<meta name="description" content="Code with CodingCat.dev Sponsorship" />
	<meta name="keywords" content="codingcatdev, webdev, webdevelopment, learning, beginner" />
	<meta name="theme-color" content="#6366f1" />
	<meta name="author" content="CodingCatDev, LLC" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="Code with CodingCat.dev Sponsorship" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://codingcat.dev/sponsorships" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content="Code with CodingCat.dev Sponsorship" />
	<meta property="og:description" content="Code with CodingCat.dev Sponsorship" />
	<meta
		property="og:image"
		content="https://media.codingcat.dev/image/upload/v1686702324/main-codingcatdev-photo/code-with-ccd-sponsorship.png"
	/>
	<meta
		property="og:image:secure_url"
		content="https://media.codingcat.dev/image/upload/v1686702324/main-codingcatdev-photo/code-with-ccd-sponsorship.png"
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />

	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@CodingCatDev" />
	<meta name="twitter:creator" content="@CodingCatDev" />
	<meta name="twitter:title" content="Sponsorships" />
	<meta name="twitter:description" content="Code with CodingCat.dev Sponsorship" />
	<meta
		name="twitter:image"
		content="https://media.codingcat.dev/image/upload/v1686702324/main-codingcatdev-photo/code-with-ccd-sponsorship.png"
	/>
</svelte:head>

<ol class="breadcrumb">
	<li class="capitalize crumb"><a href="/sponsorships">Sponsorships</a></li>
	<li class="crumb-separator" aria-hidden>&rsaquo;</li>
	<li>Code with CodingCat.dev Sponsorship</li>
</ol>

<section class="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8 markdown">
	<div class="flex flex-col items-center sm:hidden">
		<AJPrimary cls="w-48 h-48" />
	</div>
	<div class="flex justify-center m-4">
		<h1 class="flex flex-col gap-2">
			<span class="text-xl md:text-4xl">Sponsorship for</span>
			<span class="md:text-6xl font-extrabold"> Code with CodingCat.dev </span>
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
					<span class="font-bold">would you sponsor live coding?</span>
				</p>
			</div>
			<ul>
				<li>
					<strong>Reach a large audience:</strong>
					Live streaming on YouTube is a great way to reach a large audience. In fact, YouTube Live is
					one of the most popular live streaming platforms in the world, with millions of viewers tuning
					in each day.
				</li>
				<li>
					<strong>Engage with your audience:</strong>
					Live streaming is also a great way to engage with your audience. You can interact with viewers
					in real time, answer questions, and get feedback. This can help you build relationships with
					your audience and create a sense of community.
				</li>
				<li>
					<strong>Promote your brand:</strong>
					Live streaming is a great way to promote your brand. You can use live streaming to showcase
					your products or services, announce new initiatives, or simply share your company culture.
					This can help you raise awareness of your brand and attract new customers.
				</li>
				<li>
					<strong>Drive traffic to your website:</strong>
					Live streaming can also help you drive traffic to your website. You can include a link to your
					website in your live stream description, or you can encourage viewers to visit your website
					for more information. This can help you increase website traffic and generate leads.
				</li>
			</ul>
		</div>
	</div>

	<p>
		If you're looking for a way to reach a large audience, engage with your audience, promote your
		brand, and drive traffic to your website, then sponsoring live YouTube is a great option.
	</p>

	<SponsorshipForm />
</section>
