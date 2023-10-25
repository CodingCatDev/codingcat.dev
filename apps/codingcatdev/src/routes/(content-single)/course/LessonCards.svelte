<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';

	import type { LayoutData } from './$types';
	import ProMark from './ProMark.svelte';
	export let data: LayoutData;
</script>

{#if data?.course?.lesson}
	<div class="flex flex-col gap-2 md:gap-8">
		<h2>Lessons</h2>
		<section
			class="grid grid-cols-[repeat(1,minmax(0,_1fr))] md:grid-cols-[repeat(2,minmax(0,_1fr))] lg:md:grid-cols-[repeat(3,minmax(0,_1fr))] gap-2 md:gap-8"
		>
			{#each data.course.lesson as l}
				{#if l?.section}
					<div class="pb-2 col-span-full">
						<span class="flex py-2 mt-4 text-xl font-bold">
							{l.section}
						</span>
						<hr />
					</div>
				{/if}
				<a href={`/course/${data.course.slug}/lesson/${l.slug}`} class="!no-underline !text-token">
					<div class="h-full card">
						{#if l?.cover}
							<Image
								src={l.cover}
								alt={l.title || 'Missing Alt Sorry'}
								classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
							/>
						{:else}
							<Image
								src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
								alt={l.title || 'Missing Alt Sorry'}
								classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
							/>
						{/if}
						<div class="p-4">
							<header class="relative py-6 text-2xl font-bold capitalize card-header">
								<div class="absolute top-0 right-0">
									<ProMark locked={l?.locked} lesson={l} {data} />
								</div>
								<div>
									{l.title}
								</div>
							</header>
							<p class="p-4 !opacity-80">
								{l?.excerpt || 'More info in course.'}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</section>
	</div>
{/if}
