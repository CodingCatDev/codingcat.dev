<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';

	import Video from '$lib/components/content/Video.svelte';
	import type { Content, ContentType } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	export let data: {
		content: Content;
		contentType: ContentType;
	};
	$: title = pluralize({ type: data.contentType } as Content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col xl:flex-row gap-8 justify-center p-1 xl:p-8 w-full">
			<div class="flex flex-col gap-2 md:gap-8 max-w-7xl w-full">
				<ol class="bcu-breadcrumb">
					<li class="bcu-crumb capitalize"><a href={`/${title}`}>{title}</a></li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.title}</li>
				</ol>
				{#if data?.content?.youtube}
					<Video
						sources={[
							{
								src: data.content.youtube,
								type: 'video/youtube'
							}
						]}
					/>
				{:else if data?.content?.cover}
					<CloudinaryImage src={data.content.cover} alt={data.content.title} />
				{/if}

				<section class="flex-grow w-full markdown flex flex-col gap-2 md:gap-8">
					{@html data.content.html}
				</section>
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
