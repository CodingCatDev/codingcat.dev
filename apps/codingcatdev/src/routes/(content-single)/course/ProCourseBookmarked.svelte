<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Lesson } from '$lib/types';
	import ProCourseSaved from './ProCourseSaved.svelte';
	import { CheckCircle } from '@steeze-ui/heroicons';

	/* DATA */
	export let lesson: Lesson | undefined = undefined;
	export let data: LayoutData;
</script>

<ProCourseSaved {data} {lesson} savedRef="/bookmarked" savedIconSource={CheckCircle} />
