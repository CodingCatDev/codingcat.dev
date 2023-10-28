<script lang="ts">
	import { auth, firestore } from '$lib/client/firebase';
	import { docStore, userStore } from 'sveltefire';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { Saved, Lesson, Content } from '$lib/types';
	import { deleteDoc, doc, setDoc } from 'firebase/firestore';

	/* DATA */
	export let data: {
		content: Content;
	};
	export let savedRef: string;
	export let savedIconSource: IconSource;

	const user = userStore(auth);
	const collectionRef = 'users/' + $user?.uid + savedRef;
	const savedId = `${data.content.type}.${data.content.slug}`;
	const ref = `${collectionRef}/${savedId}`;
	const saved = docStore<Saved>(firestore, ref);
</script>

<!-- Course -->
{#if $saved?.savedComplete}
	<button
		on:click={(e) => {
			e.preventDefault();
			deleteDoc(doc(firestore, ref));
		}}
		class="!p-0"
	>
		<Icon src={savedIconSource} theme="solid" />
	</button>
{:else}
	<button
		on:click={(e) => {
			e.preventDefault();
			setDoc(
				doc(firestore, ref),
				{
					...data.content,
					savedId,
					savedComplete: true,
					savedUpdated: new Date()
				},
				{ merge: true }
			);
		}}
		class="!p-0"
	>
		<Icon src={savedIconSource} />
	</button>
{/if}
