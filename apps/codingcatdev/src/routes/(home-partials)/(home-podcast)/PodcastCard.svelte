<script lang="ts">
	import type { Content } from '$lib/types';
	export let position: 'left' | 'right';
	export let content: Content;

	import Image from '$lib/components/content/Image.svelte';

	$: positionStyle = position === 'left' ? '-rotate-2 !bg-primary-300' : 'rotate-2 !bg-white';
</script>

<div
	class={`bcu-card max-w-xs snap-center shrink-0 !text-surface-500 ${positionStyle} ${$$props.class}`}
>
	<a class="self-start !no-underline" href={`/${content.type}/${content.slug}`}>
		{#if content?.cover}
			<Image
				src={content.cover}
				alt={content.title || 'Missing Alt Sorry'}
				classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
			/>
		{:else}
			<Image
				src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
				alt={content.title || 'Missing Alt Sorry'}
				classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
			/>
		{/if}

		<section class="grid h-full grid-cols-1 gap-2 p-4">
			<div class="space-y-2">
				<h3 class="font-sans text-lg tracking-wide text-bold">
					{content.title}
				</h3>
				{#if content?.excerpt}
					<p class="text-sm font-hairline">{content.excerpt}</p>
				{/if}
			</div>
		</section>
	</a>
</div>
