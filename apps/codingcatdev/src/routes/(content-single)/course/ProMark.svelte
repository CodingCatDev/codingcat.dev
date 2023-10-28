<script lang="ts">
	import Locked from './Locked.svelte';
	import type { LayoutData } from './$types';
	import { ContentType, type Lesson } from '$lib/types';
	import ProComplete from './ProComplete.svelte';
	import ProBookmark from './ProBookmark.svelte';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';

	/* DATA */
	export let data: LayoutData;
	export let lesson: Lesson;
	export let locked: boolean;

	const user = userStore(auth);
</script>

{#if data?.user?.stripeRole && $user?.uid}
	<div class="flex w-12 gap-1">
		<ProComplete {data} {lesson} />
		<ProBookmark {data} {lesson} />
	</div>
{:else if data.content?.type === ContentType.course || data.content?.type === ContentType.lesson}
	<div class="flex w-6 gap-1">
		<Locked {locked} />
	</div>
{:else}
	<div />
{/if}
