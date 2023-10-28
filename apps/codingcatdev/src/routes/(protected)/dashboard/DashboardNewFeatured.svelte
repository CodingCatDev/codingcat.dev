<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import ContentCards from '../../(content-list)/ContentCards.svelte';
	import type { PageData } from './$types';
	import { Star } from '@steeze-ui/heroicons';
	export let data: PageData;
</script>

<div>
	<div class="flex gap-1">
		<div class="w-8"><Icon src={Star} theme="solid" /></div>
		<h3>New and Featured</h3>
	</div>
	<ContentCards {data} />
</div>
