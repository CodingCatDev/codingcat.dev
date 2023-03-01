<script>
	import Content from '$lib/components/content/Content.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
	console.log(data);
</script>

<Content {data} />
