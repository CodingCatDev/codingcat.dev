<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Discord, Github, Twitter, Youtube } from '@steeze-ui/simple-icons';
</script>

<div class="card flex flex-col md:flex-row justify-between gap-2 md:gap-8 w-full">
	<div class="flex flex-col md:flex-row md:justify-between w-full p-8 gap-4 md:gap-8">
		<div class="md:w-1/3">
			<h2 class="mb-8">Support</h2>
			<p>Struggling? Reach out!</p>
		</div>
		<div class="card variant-filled p-8 flex flex-col gap-4 md:w-2/3">
			<p class="text-lg">Support Contact</p>
			<p>Questions/Comments? Reach out on your preferred platform!</p>
			<div class="flex flex-wrap justify-around">
				<a
					class="card variant-filled card-hover p-8 min-h-96"
					target="_blank"
					href="https://discord.com/invite/vM2bagU"
				>
					<Icon src={Discord} theme="solid" class="w-8" />
				</a>
				<a
					class="card variant-filled card-hover p-8 min-h-96"
					target="_blank"
					href="https://twitter.com/CodingCatDev"
				>
					<Icon src={Twitter} theme="solid" class="w-8" />
				</a>
				<a
					class="card variant-filled card-hover p-8 min-h-96"
					target="_blank"
					href="https://www.youtube.com/c/codingcatdev"
				>
					<Icon src={Youtube} theme="solid" class="w-8" />
				</a>
				<a
					class="card variant-filled card-hover p-8 min-h-96"
					target="_blank"
					href="https://twitter.com/CodingCatDev"
				>
					<Icon src={Github} theme="solid" class="w-8" />
				</a>
			</div>
		</div>
	</div>
</div>
