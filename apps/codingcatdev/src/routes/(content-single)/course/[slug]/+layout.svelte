<script lang="ts">
	import { AppShell, TableOfContents } from '@codingcatdev/blackcatui';
	import LessonList from './LessonList.svelte';

	import type { LayoutData } from './$types';
	export let data: LayoutData;
	console.log(data);
</script>

<!-- App Shell -->
<AppShell regionPage="overflow-y-scroll" slotPageFooter="pt-4 bg-surface-50-900-token" }>
	<!-- Page Content -->
	<slot />
	<svelte:fragment slot="bcu-app-shell-sidebar-right">
		<!-- Div takes up same room as fixed -->
		<div class="w-[19.5rem] xl:w-96" />
		<div
			class="fixed z-20 top-[5.125rem] bottom-24 w-[19.5rem] xl:w-96 py-10 overflow-y-auto hidden xl:block"
		>
			<div class="px-8 flex flex-col gap-2 md:gap-8">
				<TableOfContents target=".markdown" />
				{#if data?.course?.lesson && data?.course?.lesson.length > 0 && data?.course?.slug}
					<div class="hidden xl:block">
						<LessonList courseSlug={data?.course?.slug} lesson={data.course.lesson} />
					</div>
				{/if}
			</div>
		</div>
	</svelte:fragment>
	<!-- <svelte:fragment slot="bcu-app-shell-page-footer">new</svelte:fragment> -->
</AppShell>
