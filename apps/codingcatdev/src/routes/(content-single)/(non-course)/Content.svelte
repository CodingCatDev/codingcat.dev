<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';

	import Video from '$lib/components/content/Video.svelte';
	import type { Content, ContentType } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	export let data: {
		content: Content;
		contentType: ContentType;
	};
	$: title = pluralize({ type: data.contentType } as Content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col justify-center w-full gap-8 p-1 xl:flex-row xl:p-8">
			<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				<ol class="bcu-breadcrumb">
					<li class="capitalize bcu-crumb"><a href={`/${title}`}>{title}</a></li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.title}</li>
				</ol>
				{#if data?.content?.youtube}
					<Video src={data.content.youtube} title={`${data.content.title}`} />
				{:else if data?.content?.cover}
					<CloudinaryImage src={data.content.cover} alt={data.content.title} />
				{/if}

				<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
					<CopyCodeInjector>
						{@html data.content.html}
					</CopyCodeInjector>
				</section>
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
