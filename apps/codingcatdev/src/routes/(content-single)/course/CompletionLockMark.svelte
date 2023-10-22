<script lang="ts">
	import Locked from './Locked.svelte';
	import type { LayoutData } from './$types';
	import type { Lesson } from '$lib/types';
	import { auth } from '$lib/client/firebase';
	import { userStore } from 'sveltefire';
	import ProComplete from './ProComplete.svelte';

	/* DATA */
	export let locked: boolean;
	export let lesson: Lesson;
	export let data: LayoutData;
	const user = userStore(auth);
</script>

<!-- If user is pro check if they have completed the lesson. -->
{#if $user?.uid}
	{#await $user?.getIdTokenResult()}
		<Locked {locked} />
	{:then user}
		{#if user?.claims?.stripeRole}
			<ProComplete {data} {lesson} />
		{:else}
			<Locked {locked} />
		{/if}
	{/await}
{:else}
	<Locked {locked} />
{/if}
