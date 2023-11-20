<script lang="ts">
	import SponsorshipCards from '../SponsorshipCards.svelte';
	import AJPrimary from '$lib/components/global/icons/AJPrimary.svelte';
	import SponsorshipForm from '../SponsorshipForm.svelte';
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
			<section class="my-8 flex flex-col gap-1 md:gap-4">
				<p class="">
					On CodingCat.dev your advertisement is <span
						class="uppercase bg-surface-backdrop-token dark:text-primary-500 font-black text-3xl p-2 rounded m-1"
						>permanent</span
					>!
				</p>
				<p>
					You read that right, it is not just while you are sponsoring and it doesn't change by the
					flavor of the week like Carbon or Google Ads.
				</p>

				<p>
					Blog sponsorship is a great way to reach a highly engaged audience of potential customers.
					By sponsoring a blog post, your company can be featured prominently on a popular blog,
					with the opportunity to reach a large number of readers who are already interested in the
					topics your post is about.
				</p>
			</section>
		</div>
	</div>

	<SponsorshipForm />

	<div class="flex justify-center card variant-soft-surface">
		<div class="flex flex-col p-8">
			<ul class="flex flex-col gap-2">
				<li data-sourcepos="3:1-4:0">
					<p data-sourcepos="3:4-3:322">
						<strong>Increased Brand Awareness and Visibility:</strong>
						By sponsoring blog posts on CodingCat.dev, your brand will be prominently featured in front
						of a highly engaged audience of tech enthusiasts and programmers. This exposure can significantly
						boost brand awareness and make your company more recognizable in the tech industry.
					</p>
				</li>
				<li data-sourcepos="5:1-6:0">
					<p data-sourcepos="5:4-5:278">
						<strong>Enhanced Brand Credibility and Reputation:</strong>
						Being associated with a reputable blog like CodingCat.dev can enhance your brand's credibility
						and reputation. The blog's audience will associate your company with high-quality content
						and expertise, fostering trust and loyalty.
					</p>
				</li>
				<li data-sourcepos="7:1-8:0">
					<p data-sourcepos="7:4-7:297">
						<strong>Targeted Audience Reach:</strong>
						CodingCat.dev attracts a dedicated readership of individuals passionate about coding and
						programming. Sponsoring blog posts on this platform ensures you're reaching a highly targeted
						audience of potential customers genuinely interested in your products or services.
					</p>
				</li>
				<li data-sourcepos="9:1-10:0">
					<p data-sourcepos="9:4-9:280">
						<strong>Long-Term Impact and Brand Recall:</strong>
						Unlike traditional advertising that fades quickly, sponsoring long-term blog posts on CodingCat.dev
						creates a lasting impression. Your brand will remain visible and associated with valuable
						content long after the initial publication date.
					</p>
				</li>
				<li data-sourcepos="11:1-12:0">
					<p data-sourcepos="11:4-11:301">
						<strong>Cost-Effective Marketing Strategy:</strong>
						Compared to traditional advertising methods, blog sponsorship offers a cost-effective way
						to reach a large audience. The targeted nature of blog readership ensures your marketing
						efforts are reaching the right people, maximizing the return on your investment.
					</p>
				</li>
			</ul>
		</div>
	</div>
	<SponsorshipCards />
</section>
