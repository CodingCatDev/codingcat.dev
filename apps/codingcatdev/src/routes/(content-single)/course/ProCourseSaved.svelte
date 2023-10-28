<script lang="ts">
	import { auth, firestore } from '$lib/client/firebase';
	import { docStore, userStore } from 'sveltefire';
	import { Icon, type IconSource } from '@steeze-ui/svelte-icon';
	import type { LayoutData } from './$types';
	import type { Saved, Lesson } from '$lib/types';
	import { deleteDoc, doc, setDoc } from 'firebase/firestore';

	/* DATA */
	export let lesson: Lesson | undefined = undefined;
	export let data: LayoutData;
	export let savedRef: string;
	export let savedIconSource: IconSource;

	const user = userStore(auth);
	const collectionRef = 'users/' + $user?.uid + savedRef;
	const courseId = `${data.course.type}.${data.course.slug}`;
	const lessonId = `${lesson?.type}.${lesson?.slug}`;
	const ref = `${collectionRef}/${courseId}`;
	const saved = docStore<Saved>(firestore, ref);

	const completeAllLessons = () => {
		const savedUpdated = new Date();
		const savedComplete = true;

		const lesson = data.course.lesson?.map((l) => {
			return {
				...l,
				savedId: `${l.type}.${l.slug}`,
				savedComplete,
				savedUpdated
			};
		});
		return {
			...data.course,
			lesson,
			savedId: courseId,
			savedComplete: true,
			savedUpdated: new Date()
		};
	};
	const completeLesson = () => {
		const course = {
			...data.course,
			savedId: courseId,
			savedUpdated: new Date(),
			lesson: [
				...($saved?.lesson || []),
				...[
					{
						savedId: lessonId,
						savedUpdated: new Date(),
						savedComplete: true
					}
				]
			]
		};
		return {
			...course,
			savedComplete: data.course.lesson?.length === course.lesson.length
		};
	};
	const removeLesson = () => {
		return {
			...data.course,
			savedId: courseId,
			savedComplete: false,
			savedUpdated: new Date(),
			lesson: [...($saved?.lesson?.filter((l) => l.savedId !== lessonId) || [])]
		};
	};
</script>

<!-- Lesson -->
{#if lesson}
	{#if $saved?.lesson?.filter((l) => l.savedId === lessonId && l.savedComplete === true).length}
		<button
			on:click={(e) => {
				e.preventDefault();
				setDoc(doc(firestore, ref), removeLesson(), { merge: true });
			}}
			class="!p-0"
		>
			<Icon src={savedIconSource} theme="solid" />
		</button>
	{:else}
		<button
			on:click={(e) => {
				e.preventDefault();
				setDoc(doc(firestore, ref), completeLesson(), { merge: true });
			}}
			class="!p-0"
		>
			<Icon src={savedIconSource} />
		</button>
	{/if}
{:else}
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
				setDoc(doc(firestore, ref), completeAllLessons(), { merge: true });
			}}
			class="!p-0"
		>
			<Icon src={savedIconSource} />
		</button>
	{/if}
{/if}
