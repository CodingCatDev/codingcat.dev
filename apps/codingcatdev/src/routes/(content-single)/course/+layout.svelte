<script>
	import { AppShell, TableOfContents } from '@skeletonlabs/skeleton';
	import Course from './Course.svelte';
	import LessonList from './LessonList.svelte';
	import Lesson from './Lesson.svelte';
	import Image from '$lib/components/content/Image.svelte';
	import { storeCurrentUrl } from '$lib/stores/stores';

	export let data;
</script>

{#if data?.content}
	<Lesson {data}>
		<slot />
	</Lesson>
{:else}
	<Course {data}>
		<slot />
	</Course>
{/if}
