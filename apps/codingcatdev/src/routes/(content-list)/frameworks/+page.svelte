<script lang="ts">
	import ContentCards from '$lib/components/content/ContentCards.svelte';
	import { ContentType } from '$lib/types/index';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<ContentCards type={ContentType.framework} {data} />
