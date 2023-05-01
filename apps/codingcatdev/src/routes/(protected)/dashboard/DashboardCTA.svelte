<script lang="ts">
	import Discord from '$lib/components/global/icons/socials/Discord.svelte';
	import GitHub from '$lib/components/global/icons/socials/GitHub.svelte';
	import Twitter from '$lib/components/global/icons/socials/Twitter.svelte';
	import YouTube from '$lib/components/global/icons/socials/YouTube.svelte';
</script>

<!-- TODO hover effects -->
<div class="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
	<a
		class="bcu-card bcu-card-hover p-8 min-h-96"
		target="_blank"
		href="https://discord.com/invite/vM2bagU"
	>
		<div class="flex flex-col gap-4 justify-center items-start h-52">
			<Discord />
			<h5 class="tracking-wide">Join the Discord!</h5>
			<p class="text-md font-normal">
				We are part of the Teach, Learn, Grow community. A place to learn then give back. Join us!
			</p>
		</div>
	</a>
	<a class="bcu-card bcu-card-hover p-8" target="_blank" href="https://twitter.com/CodingCatDev">
		<div class="flex flex-col gap-4 justify-center items-start h-52">
			<Twitter fill="#BC2261" />
			<h5 class="tracking-wide">See if Twitter is still running</h5>
			<p class="text-md font-normal">See the latest and start a conversation.</p>
		</div>
	</a>
	<!-- I got the fill value from Discord.svelte, we should talk about color so I can put a style guide together-->
	<!--make a few more ctas and make them a responsive grid-->
	<a
		class="bcu-card bcu-card-hover p-8"
		target="_blank"
		href="https://www.youtube.com/c/codingcatdev"
	>
		<div class="flex flex-col gap-4 justify-center items-start h-52">
			<YouTube fill="#BC2261" />
			<h5 class="tracking-wide">Subscribe to our Youtube</h5>
			<p class="text-md font-normal">See the latest and start a conversation.</p>
		</div>
	</a>
	<a
		class="bcu-card bcu-card-hover p-8 md:col-span-3 md:max-w-full lg:col-span-1 lg:max-w-xs"
		target="_blank"
		href="https://github.com/sponsors/CodingCatDev"
	>
		<div class="flex flex-col gap-4 justify-center items-start h-52">
			<GitHub fill="#BC2261" />
			<h5 class="tracking-wide">Sponsor our GitHub</h5>
			<p class="text-md font-normal">
				Star the repo, look at the issues, and sponsor us to help us keep the lights on.
			</p>
		</div>
	</a>
</div>
