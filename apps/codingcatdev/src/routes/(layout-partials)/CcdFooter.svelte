<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github, Twitter, Youtube } from '@steeze-ui/simple-icons';
</script>

<footer class="md:mx-12 md:my-4 md:gap-16">
	<section
		class="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:space-y-0"
	>
		<p class="text-xs">
			<a class="bcu-button variant-soft" href="https://alexpatterson.dev">Made by Alex Patterson</a>
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
				<span class="hidden md:inline-block ml-2">Twitter</span>
			</a>
		</div>
	</section>
</footer>
