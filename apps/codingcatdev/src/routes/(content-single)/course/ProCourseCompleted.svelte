<script lang="ts">
	import type { Course, Lesson, Saved } from '$lib/types';
	import ProCourseSaved from './ProCourseSaved.svelte';
	import { CheckCircle } from '@steeze-ui/heroicons';

	/* DATA */
	export let lesson: Lesson | undefined = undefined;
	export let data: {
		course: Course | Saved;
	};
</script>

<ProCourseSaved {data} {lesson} savedRef="/completed" savedIconSource={CheckCircle} />
