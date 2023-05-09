<script lang="ts">
	import type { Lesson } from '$lib/types';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed } from '@steeze-ui/heroicons';
	import { LockOpen } from '@steeze-ui/heroicons';
	import Image from '$lib/components/content/Image.svelte';

	export let lesson: Lesson[];
	export let courseSlug: string;
</script>

<section
	class="grid grid-cols-[repeat(1,minmax(0,_1fr))] md:grid-cols-[repeat(2,minmax(0,_1fr))] lg:md:grid-cols-[repeat(3,minmax(0,_1fr))]  gap-2 md:gap-8"
>
	{#each lesson as l}
		{#if l?.section}
			<div class="pb-2 col-span-full">
				<span class="flex py-2 mt-4 text-xl font-bold">
					{l.section}
				</span>
				<hr />
			</div>
		{/if}
		<a href={`/course/${courseSlug}/lesson/${l.slug}`} class="!no-underline !text-token">
			<div class="h-full bcu-card">
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
					<header class="relative py-6 text-2xl font-bold capitalize bcu-card-header">
						<div class="absolute top-0 right-0 w-6">
							{#if l?.locked}
								<Icon src={LockClosed} theme="solid" />
							{:else}
								<Icon src={LockOpen} theme="solid" />
							{/if}
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
