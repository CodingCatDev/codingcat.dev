<script lang="ts">
	import { LightSwitch } from '@codingcatdev/blackcatui';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github, Twitter, Youtube } from '@steeze-ui/simple-icons';
</script>

<hr />
<footer class="md:mx-12 md:my-4 md:gap-16 flex justify-center p-8 sm:p-1">
	<div class="max-w-6xl">
		<section class="flex flex-col md:flex-row justify-between gap-8 md:space-y-0 items-center">
			<p class="text-xs">
				<a class="bcu-button variant-soft" href="https://alexpatterson.dev"
					>Made by Alex Patterson</a
				>
			</p>
			<p class="text-xs flex gap-2">
				Mode <LightSwitch />
			</p>
			<div class="flex gap-2">
				<a
					class="bcu-button variant-soft"
					href="https://github.com/codingcatdev/codingcat.dev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Github} class="w-4" />
					<span class="hidden md:inline-block ml-2">GitHub</span>
				</a>
				<a
					class="bcu-button variant-soft"
					href="https://twitter.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Twitter} class="w-4" />
					<span class="hidden md:inline-block ml-2">Twitter</span>
				</a>
				<a
					class="bcu-button variant-soft"
					href="https://youtube.com/CodingCatDev"
					target="_blank"
					rel="noreferrer"
				>
					<Icon src={Youtube} class="w-4" />
					<span class="hidden md:inline-block ml-2">YouTube</span>
				</a>
			</div>
		</section>
	</div>
</footer>
