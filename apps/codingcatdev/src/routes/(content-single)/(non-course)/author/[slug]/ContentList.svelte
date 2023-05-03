<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import type { ContentType, Content } from '$lib/types';
	export let contentItems: Content[];
	export let contentType: ContentType;
</script>

{#each contentItems as p}
	<a
		href={`/${contentType}/${p.slug}`}
		class="flex items-center gap-2 p-2 md:gap-8 bcu-card md:p-4"
	>
		<div class="w-60 md:w-80">
			{#if p?.cover}
				<Image
					src={p.cover}
					alt={p.title || 'Missing Alt Sorry'}
					classes="rounded-md rounded-b-none cursor-pointer aspect-video"
				/>
			{:else}
				<Image
					src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
					alt={p.title || 'Missing Alt Sorry'}
					classes="rounded-md rounded-b-none cursor-pointer aspect-video"
				/>
			{/if}
		</div>
		<h2>
			{p.title}
		</h2>
	</a>
{/each}
