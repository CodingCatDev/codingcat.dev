<script lang="ts">
	import Locked from './Locked.svelte';
	import type { LayoutData } from './$types';
	import { ContentType, type Lesson } from '$lib/types';
	import ProCourseCompleted from './ProCourseCompleted.svelte';
	import ProCourseBookmarked from './ProCourseBookmarked.svelte';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';

	/* DATA */
	export let data: LayoutData;
	export let lesson: Lesson | undefined = undefined;
	export let locked: boolean | undefined = undefined;

	const user = userStore(auth);
</script>

{#if data?.user?.stripeRole && $user?.uid}
	<div class="flex w-12 gap-1">
		<ProCourseCompleted {data} {lesson} />
		<ProCourseBookmarked {data} {lesson} />
	</div>
{:else if data.content?.type === ContentType.lesson}
	<div class="flex w-6 gap-1">
		<Locked {locked} />
	</div>
{:else}
	<div />
{/if}
