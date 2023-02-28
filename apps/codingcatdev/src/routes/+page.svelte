<script>
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import HomeDetail from '$lib/components/home/HomeDetail.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<HomeHero />
<HomeDetail {data} />
