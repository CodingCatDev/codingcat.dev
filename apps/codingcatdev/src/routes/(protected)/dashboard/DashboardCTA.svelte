<script lang="ts">
	import Discord from '$lib/components/global/icons/socials/Discord.svelte';
	import Twitter from '$lib/components/global/icons/socials/Twitter.svelte';
</script>

<!-- TODO hover effects -->
<!-- TODO standardize height -->

<div class="py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
	<a class="bcu-card p-8 max-w-xs" target="_blank" href="https://discord.com/invite/vM2bagU">
		<div class="flex flex-col gap-4 justify-start items-start">
			<Discord />
			<h5 class="tracking-wide">Join the Discord!</h5>
			<p class="text-md font-normal">
				We are part of the Teach, Learn, Grow community. A place to learn then give back. Join us!
			</p>
		</div>
	</a>
	<a class="bcu-card p-8 max-w-xs" target="_blank" href="https://twitter.com/CodingCatDev">
		<div class="flex flex-col gap-4 justify-start items-start">
			<Twitter fill="#BC2261" />
			<h5 class="tracking-wide">See if Twitter is still running</h5>
			<p class="text-md font-normal">See the latest and start a conversation.</p>
		</div>
	</a>
	<!-- I got the fill value from Discord.svelte, we should talk about color so I can put a style guide together-->
	<!--make a few more ctas and make them a responsive grid-->
	<a class="bcu-card p-8 max-w-xs" target="_blank" href="https://twitter.com/CodingCatDev">
		<div class="flex flex-col gap-4 justify-start items-start">
			<Twitter fill="#BC2261" />
			<h5 class="tracking-wide">See if Twitter is still running</h5>
			<p class="text-md font-normal">See the latest and start a conversation.</p>
		</div>
	</a>
</div>
