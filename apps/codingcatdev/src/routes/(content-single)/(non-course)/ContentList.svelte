<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import type { ContentType, Content } from '$lib/types';
	export let contentItems: Content[];
	export let contentType: ContentType;
</script>

{#each contentItems as p}
	<a href={`/${contentType}/${p.slug}`} class="max-w-sm overflow-hidden card bg-initial card-hover">
		<header>
			{#if p?.cover}
				<Image
					src={p.cover}
					alt={p?.title}
					classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none"
				/>
			{:else}
				<Image
					src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
					alt={p.title || 'Missing Alt Sorry'}
					classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none"
				/>
			{/if}
		</header>
		<div class="p-4 space-y-4">
			<article>
				<p>
					{p?.title}
				</p>
			</article>
		</div>
	</a>
{/each}
