<script lang="ts">
	import { auth, firestore } from '$lib/client/firebase';
	import { collectionStore, userStore } from 'sveltefire';
	import { CheckCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { LayoutData } from './$types';
	import type { Lesson } from '$lib/types';
	import { and, collection, deleteDoc, doc, query, setDoc, where } from 'firebase/firestore';

	/* DATA */
	export let lesson: Lesson;
	export let data: LayoutData;

	const user = userStore(auth);
	const collectionRef = 'users/' + $user?.uid + `/completed`;
	const completed = collectionStore(
		firestore,
		query(
			collection(firestore, collectionRef),
			and(where('lesson.slug', '==', lesson.slug), where('lesson.type', '==', lesson.type))
		)
	);
</script>

{#if $completed?.at(0)}
	<button
		on:click={(e) => {
			e.preventDefault();
			deleteDoc(doc(firestore, `${collectionRef}/${$completed?.at(0)?.id}`));
		}}
		class="!p-0"
	>
		<Icon src={CheckCircle} theme="solid" />
	</button>
{:else}
	<button
		on:click={(e) => {
			e.preventDefault();
			setDoc(
				doc(
					firestore,
					`${collectionRef}/${data.course.type}.${data.course.slug}.${lesson.type}.${lesson.slug}`
				),
				{
					...data.course,
					lesson
				},
				{ merge: true }
			);
		}}
		class="!p-0"
	>
		<Icon src={CheckCircle} />
	</button>
{/if}
