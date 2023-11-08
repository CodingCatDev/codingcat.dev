<script lang="ts">
	import type { Content, ContentType } from '$lib/types';
	import { pluralize } from '$lib/utils';

	export let list: Content[];
	export let contentType: ContentType;
	$: title = pluralize({ type: contentType } as Content);
</script>

<div class="card">
	<header class="card-header capitalize pb-2 text-xl font-bold">{title}</header>
	<hr />
	<ul>
		{#each list as content}
			<li class={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between`}>
				<a href={`/${contentType}/${content.slug}`} class="link-primary">
					{content.title}
				</a>
			</li>
		{/each}
	</ul>
</div>
