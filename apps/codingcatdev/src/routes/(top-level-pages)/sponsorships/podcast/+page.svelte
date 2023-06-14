<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import AJHeadphones from '$lib/components/global/icons/AJHeadphones.svelte';
	import Podcatchers from './Podcatchers.svelte';
	import Arrow from './Arrow.svelte';

	let form;
</script>

<svelte:head>
	<title>Podcast Sponsorship</title>
	<!-- Meta Tags -->
	<meta name="title" content="CodingCat.dev Podcast Sponsorship" />
	<meta name="description" content="CodingCat.dev Podcast Sponsorship" />
	<meta name="keywords" content="codingcatdev, webdev, webdevelopment, learning, beginner" />
	<meta name="theme-color" content="#6366f1" />
	<meta name="author" content="CodingCatDev, LLC" />
	<!-- Open Graph - https://ogp.me/ -->
	<meta property="og:site_name" content="CodingCat.dev Podcast Sponsorship" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://codingcat.dev/sponsorships" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content="Podcast Sponsorship" />
	<meta property="og:description" content="CodingCat.dev Podcast Sponsorship" />
	<meta
		property="og:image"
		content="https://media.codingcat.dev/image/upload/v1686699444/main-codingcatdev-photo/podcast-sponsorship.png"
	/>
	<meta
		property="og:image:secure_url"
		content="https://media.codingcat.dev/image/upload/v1686699444/main-codingcatdev-photo/podcast-sponsorship.png"
	/>
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />

	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@CodingCatDev" />
	<meta name="twitter:creator" content="@CodingCatDev" />
	<meta name="twitter:title" content="Sponsorships" />
	<meta name="twitter:description" content="CodingCat.dev Podcast Sponsorship" />
	<meta
		name="twitter:image"
		content="https://media.codingcat.dev/image/upload/v1686699444/main-codingcatdev-photo/podcast-sponsorship.png"
	/>
</svelte:head>

<ol class="bcu-breadcrumb">
	<li class="capitalize bcu-crumb"><a href="/sponsorships">Sponsorships</a></li>
	<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
	<li>Podcast Sponsorship</li>
</ol>

<section>
	<!-- <div class="sticky top-0 right-0 z-50 flex m-2 jusify-end">
          <button
            ref={scrollBtn}
            class="btn-primary"
            onClick={() => scrollToForm()}
          >
            Apply To Sponsor -{'>'}
          </button>
        </div> -->
	<section class="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8">
		<div class="flex flex-col items-center sm:hidden">
			<AJHeadphones cls="w-48 h-48" />
		</div>
		<div class="flex justify-center m-4">
			<h1 class="flex flex-col gap-2">
				<span class="text-xl md:text-4xl">Sponsorship for</span>
				<span class="md:text-6xl font-extrabold"> CodingCat.dev Podcast </span>
				<span class="text-xl md:text-2xl">a CodingCat.dev Production</span>
			</h1>
			<div class="flex-col items-center hidden sm:flex">
				<AJHeadphones cls="w-48 h-48" />
			</div>
		</div>
		<div class="flex justify-center bcu-card variant-soft-surface">
			<div class="flex flex-col max-w-xl gap-4 p-8 font-extrabold">
				<p class="text-4xl">Are you interested in reaching other web designers and developers?</p>
				<p class="text-6xl text-primary-500">We&lsquo;d love to help!</p>
				<p class="text-2xl">
					CodingCat.dev Podcast is a weekly podcast that focuses on developer&lsquo;s backgrounds,
					tools and tips.
				</p>
				<p class="text-2xl">
					We aim to keep listeners up to date on the latest technology and best practices, along
					with guiding developers on their journey and helping them use tools in their everyday
					workflow.
				</p>
			</div>
		</div>
		<div class="flex flex-wrap justify-center bcu-card variant-soft-surface">
			<div class="flex justify-center w-full gap-4 p-8 font-extrabold">
				<p class="text-4xl">
					<span class="text-8xl text-primary-500"> Why </span>
					<span class="font-bold">do we make the podcast?</span>
				</p>
			</div>
			<div class="flex flex-col w-full max-w-xl gap-4 p-8 font-extrabold">
				<p class="text-2xl">
					Alex and Brittney both have a passion for teaching and the
					<span class="text-primary-500">
						{' '}
						CodingCat.dev Podcast{' '}
					</span>
					podcast is an extension of that passion!
				</p>
			</div>
			<div class="flex flex-wrap justify-center sm:flex-nowrap">
				<div class="flex flex-col gap-4 p-8 font-extrabold">
					<p class="text-2xl">
						<a href="/author/alex-patterson" target="_blank"> Alex </a>
						created CodingCat.dev so that everyone has access to a great learning platform and a safe
						learning community. He has a primary background in web development and architecture.
					</p>
				</div>
				<div class="flex flex-col gap-4 p-8 font-extrabold">
					<p class="text-2xl">
						<a href="/author/brittney-postma" target="_blank"> Brittney </a>
						joined Alex to complete the design of CodingCat.dev and then joined CodingCat.dev Podcast
						to give a designer turned developer&lsquo;s perspective to the discussion.
					</p>
				</div>
			</div>
		</div>
		<div class="flex flex-wrap justify-center bcu-card variant-soft-surface">
			<div class="flex justify-center w-full gap-4 p-8 font-extrabold">
				<p class="text-4xl">
					<span class="text-8xl text-primary-500"> Where </span>
					<span class="font-bold">
						{' '}
						do we distribute the podcast?
					</span>
				</p>
			</div>
			<div class="flex flex-col w-full max-w-xl gap-4 p-8 font-extrabold">
				<p class="text-2xl">
					Our podcast is very visual and interactive, so we first livestream to{' '}
					<a
						href="https://twitch.tv/codingcatdev"
						rel="noreferrer"
						target="_blank"
						class="text-primary-500"
					>
						Twitch
					</a>{' '}
					then the episodes receive a number for release and are released to all the below syndication
					platforms.
				</p>
			</div>
			<div class="flex flex-wrap justify-center mb-8 sm:flex-nowrap">
				<Podcatchers />
			</div>
		</div>
		<div class="flex flex-col justify-center gap-8 p-8 bcu-card variant-soft-surface">
			<p class="flex justify-center w-full text-6xl font-bold">Audience Breakdown</p>
			<div class="flex flex-col w-full gap-8 text-2xl">
				<div class="flex flex-col items-center gap-4">
					<div class="text-4xl font-bold text-primary-500">Age Range</div>
					<div class="font-bold text-8xl text-primary-500">25-34</div>
					<div>Most listeners fall within this range.</div>
				</div>
				<div class="flex flex-col items-center gap-4">
					<div class="text-4xl font-bold text-primary-500">Spotify</div>
					<div class="w-full max-w-xl">
						<Image
							src="https://media.codingcat.dev/image/upload/v1686690100/main-codingcatdev-photo/spotify-analytics.png"
							alt="Spotify Analytics"
							classes="object-cover w-full bg-cover rounded bg-black/50"
						/>
					</div>
				</div>
				<div class="flex flex-col items-center gap-4">
					<div class="text-4xl font-bold text-primary-500">YouTube</div>
					<div class="w-full max-w-xl">
						<Image
							src="https://media.codingcat.dev/image/upload/v1686689730/main-codingcatdev-photo/youtube-analytics.png"
							alt="YouTube Analytics"
							classes="object-cover w-full bg-cover rounded bg-black/50"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-wrap justify-center p-8 bcu-card variant-soft-surface">
			<p class="flex justify-center w-full text-4xl font-bold md:text-6xl">
				Sponsoring is Purrfect for:
			</p>
			<div class="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
				<div class="grid grid-cols-[3rem_1fr] items-center text-2xl">
					<div class="w-12"><Arrow /></div>
					<div>Web design and development tools, software and services</div>
					<div class="w-12"><Arrow /></div>
					<div>Teams looking to hire</div>
					<div class="w-12"><Arrow /></div>
					<div>Technical training material and courses</div>
					<div class="w-12"><Arrow /></div>
					<div>Technical software</div>
					<div class="w-12"><Arrow /></div>
					<div>Hardware products</div>
				</div>
			</div>
		</div>
		<div class="flex flex-wrap justify-center p-8 bcu-card variant-soft-surface">
			<p class="flex justify-start w-full text-4xl font-bold md:text-6xl">Audience Interests:</p>
			<div class="flex flex-wrap md:flex-nowrap">
				<div class="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
					<p class="flex justify-start w-full text-3xl font-bold md:text-4xl">Hard Skills</p>
					<div class="grid grid-cols-[3rem_1fr] gap-2 items-center text-2xl">
						<div class="w-12"><Arrow /></div>
						<div>JavaScript frameworks (e.g. React, Angular, Vue, and Svelte)</div>
						<div class="w-12"><Arrow /></div>
						<div>CSS and CSS libraries like TailwindCSS</div>
						<div class="w-12"><Arrow /></div>
						<div>Backend Frameworks (e.g. NodeJs, Rust)</div>
						<div class="w-12"><Arrow /></div>
						<div>Cloud Solutions (e.g. AWS, GCP, Azure)</div>
						<div class="w-12"><Arrow /></div>
						<div>Lifestyle Products (e.g. keyboards, VSCode themes)</div>
					</div>
				</div>
				<div class="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
					<p class="flex justify-start w-full text-3xl font-bold md:text-4xl">Soft Skills</p>
					<div class="grid grid-cols-[3rem_1fr] gap-2 items-center text-2xl">
						<div class="w-12"><Arrow /></div>
						<div>How to get a job in tech</div>
						<div class="w-12"><Arrow /></div>
						<div>How to run a freelance business</div>
						<div class="w-12"><Arrow /></div>
						<div>How to start a podcast</div>
						<div class="w-12"><Arrow /></div>
						<div>How to change careers</div>
						<div class="w-12"><Arrow /></div>
						<div>Mental health and awareness</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="flex flex-wrap justify-start gap-4 p-8 md:gap-8 md:px-24 bcu-card variant-soft-surface"
		>
			<div class="flex flex-col justify-start w-full gap-4 font-extrabold ">
				<p class="text-4xl">
					<span class="text-8xl text-primary-500"> Pricing </span>
				</p>
			</div>
			<div class="grid grid-cols-[1fr] gap-2 text-xl md:text-2xl p-2 md:p-8">
				<div>
					<span class="text-2xl font-bold md:text-4xl text-primary-500"> Single Show </span>{' '}
					- $300 USD
				</div>
				<div>
					<span class="text-2xl font-bold md:text-4xl text-primary-500"> 3+ Shows </span>{' '}
					- $250 USD
				</div>
				<div>
					<span class="text-2xl font-bold md:text-4xl text-primary-500"> 10+ Shows </span>{' '}
					- $200 USD
				</div>
				<p class="text-sm">* per show pricing, contact us to arrange for annual terms.</p>
			</div>
			<p class="text-md md:text-2xl">
				We have found that we get the best results for our advertisers when they sponsor at least
				three shows, Alex and Brittney are able to test out the product, and your marketing team
				approves both pre-roll and mid-roll videos.
			</p>
		</div>
		<div class="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 bcu-card variant-soft-surface">
			<div class="flex flex-col w-full gap-4">
				<p class="w-full text-4xl font-bold">
					As part of the sponsorship package, you&lsquo;ll receive:
				</p>
				<div class="flex gap-2 py-8 text-2xl items-center">
					<span class="text-6xl font-bold text-primary-500"> 1 </span>
					<p class="text-3xl text-primary-500">
						A sponsorship section within the episode show notes, on our website.
					</p>
				</div>
				<p class="text-2xl">
					These notes will be listed on CodingCat.dev Podcast permanently and within the
					user&lsquo;s podcatcher of choice (Apple, Spotify...). This is a great opportunity to
					include unique targeted links and promo codes!
				</p>
			</div>
			<div class="w-full">
				<Image
					src="https://media.codingcat.dev/image/upload/v1659461240/main-codingcatdev-photo/Screen_Shot_2022-08-02_at_12.55.38_PM.png"
					alt="CodingCat.dev Podcast Sponsorship Image show logo."
					classes="object-cover w-full bg-cover rounded bg-black/50"
				/>
			</div>
		</div>
		<div class="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 bcu-card variant-soft-surface">
			<div class="flex flex-col w-full gap-4">
				<div class="flex gap-2 py-8 text-2xl items-center">
					<span class="text-6xl font-bold text-primary-500"> 2 </span>
					<p class="text-3xl text-primary-500">A call-out in the pre-roll of the show.</p>
				</div>
				<p class="text-2xl">
					The call-out will include the name of the company and slogan. Because we are a video
					podcast, there will also be an opportunity for your own branding to be included in the
					video. We highly suggest your marketing team creates the video with a voice-over from
					Brittney and Alex.
				</p>
			</div>
			<div class="flex flex-col w-full gap-4">
				<div class="flex gap-2 py-8 text-2xl items-center">
					<span class="text-6xl font-bold text-primary-500"> 3 </span>
					<p class="text-3xl text-primary-500">
						A 60-90 second sponsor spot mid-roll during the show.
					</p>
				</div>
				<p class="text-2xl">
					We can provide a standard ad read provided by your marketing department. We have found
					that because we are a video podcast, this is a good time to showcase your product. We can
					also provide a personal experience aad that allows Alex and Brittney to demonstrate their
					own experience with your product.
				</p>
			</div>
		</div>
		<div class="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 bcu-card variant-soft-surface">
			<div class="flex flex-col w-full gap-4">
				<div class="flex gap-2 py-8 text-2xl items-center">
					<span class="text-6xl font-bold text-primary-500"> 4 </span>
					<p class="text-3xl text-primary-500">
						An evergreen listing on the CodingCat.dev Podcast sponsors page.
					</p>
				</div>
				<p class="text-2xl">
					This is a useful resource for listeners wanting to quickly reference a sponsor&lsquo;s
					offering, but are unable to recall which episode, coupon code, or link was used during the
					ad read.
				</p>
			</div>
			<div class="flex flex-col w-full gap-4">
				<div class="flex gap-2 py-8 text-2xl items-center">
					<span class="text-6xl font-bold text-primary-500"> 5 </span>
					<p class="text-3xl text-primary-500">Access to a password protected dashboard.</p>
				</div>
				<p class="text-2xl">
					This will include easy access to all documents, including invoices and contracts.
				</p>
			</div>
		</div>

		<div
			bind:this={form}
			class="flex flex-wrap justify-center p-8 bg-basics-900 text-primary-50 rounded-xl"
		>
			<iframe
				class="w-full border-none rounded-xl"
				height="720px"
				src="https://notionforms.io/forms/sponsor-submissions"
				title="Sponsorship Form"
			/>
		</div>
	</section>
</section>
