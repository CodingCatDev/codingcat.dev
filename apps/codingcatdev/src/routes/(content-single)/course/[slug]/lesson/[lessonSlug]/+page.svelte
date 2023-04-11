<script lang="ts">
	import Lesson from './Lesson.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Lesson {data} />
