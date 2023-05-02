<script lang="ts">
	import Discord from '$lib/components/global/icons/socials/Discord.svelte';
	import GitHub from '$lib/components/global/icons/socials/GitHub.svelte';
	import Twitter from '$lib/components/global/icons/socials/Twitter.svelte';
	import YouTube from '$lib/components/global/icons/socials/YouTube.svelte';

	const anchorClasses = 'bcu-card bcu-card-hover p-8 min-h-96';
	const sectionClasses = 'flex flex-col relative gap-4 justify-start items-start h-52 py-14';
	const logoClasses = 'absolute top-0';
	const titleClasses = 'tracking-wide';
	const descriptionClasses = 'text-md font-normal';
</script>

<!-- TODO hover effects -->
<div class="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
	<a class={anchorClasses} target="_blank" href="https://discord.com/invite/vM2bagU">
		<div class={sectionClasses}>
			<div class={logoClasses}>
				<Discord />
			</div>
			<h5 class={titleClasses}>Join the Discord!</h5>
			<p class={descriptionClasses}>
				We are part of the Teach, Learn, Grow community. A place to learn then give back. Join us!
			</p>
		</div>
	</a>
	<a class={anchorClasses} target="_blank" href="https://twitter.com/CodingCatDev">
		<div class={sectionClasses}>
			<div class={logoClasses}>
				<Twitter fill="#BC2261" />
			</div>
			<h5 class={titleClasses}>Follow Us on Twitter!</h5>
			<p class={descriptionClasses}>See the latest and start a conversation.</p>
		</div>
	</a>
	<!-- I got the fill value from Discord.svelte, we should talk about color so I can put a style guide together-->
	<!--make a few more ctas and make them a responsive grid-->
	<a class={anchorClasses} target="_blank" href="https://www.youtube.com/c/codingcatdev">
		<div class={sectionClasses}>
			<div class={logoClasses}>
				<YouTube fill="#BC2261" />
			</div>
			<h5 class={titleClasses}>Subscribe to our Youtube</h5>
			<p class={descriptionClasses}>See the latest and start a conversation.</p>
		</div>
	</a>
	<!-- last anchor has different classes for responsiveness-->
	<a
		class="bcu-card bcu-card-hover p-8 md:col-span-3 md:max-w-full lg:col-span-1 lg:max-w-xs"
		target="_blank"
		href="https://github.com/sponsors/CodingCatDev"
	>
		<div class={sectionClasses}>
			<div class={logoClasses}>
				<GitHub fill="#BC2261" />
			</div>
			<h5 class={titleClasses}>Sponsor our GitHub</h5>
			<p class={descriptionClasses}>
				Star the repo, look at the issues, and sponsor us to help us keep the lights on.
			</p>
		</div>
	</a>
</div>
