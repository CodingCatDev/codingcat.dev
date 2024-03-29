<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import { ContentPublished, type Content, type Course } from '$lib/types';
	import { ContentType } from '$lib/types';
	import type { LayoutData } from '../$types';
	import ProCourseMark from '../(content-single)/course/ProCourseMark.svelte';
	export let data: {
		contentType: ContentType;
		content: Content[] & Course[];
		next?: any;
		user: LayoutData['user'];
	};

	let next = data.next;
	const contentType = data.contentType;
	const more = async () => {
		const response = await fetch('/api/more-content', {
			method: 'POST',
			body: JSON.stringify({ after: next, contentType }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const d = await response.json();
		data = {
			contentType,
			content: [...data.content, ...d.content],
			next,
			user: data?.user
		};
		next = d.next;
	};
</script>

{#if !data?.content?.length}
	<div class="p-4 pt-8">
		<h1>Oh no! Nothing to show yet...</h1>
	</div>
{:else}
	<div class="flex flex-col gap-4 p-2">
		<div class="p-4 sm:p-10">
			<section class="relative grid gap-4 grid-cols-fit sm:gap-10">
				{#each data?.content as content}
					<div class="max-w-6xl ccd-grid-card relative">
						{#if content?.published !== ContentPublished.published}
							<div class="absolute top-2 right-2">
								<span class="chip variant-filled-warning py-1 px-4 rounded-full uppercase font-bold"
									>{content?.published || 'draft'}</span
								>
							</div>
						{/if}
						<a class="self-start" href={`/${content.type}/${content.slug}`}>
							{#if content?.cover}
								<Image
									src={content.cover}
									alt={content.title || 'Missing Alt Sorry'}
									classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
								/>
							{:else}
								<Image
									src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
									alt={content.title || 'Missing Alt Sorry'}
									classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
								/>
							{/if}
							<section class="grid h-full grid-cols-1 gap-2 p-4">
								<div class="space-y-2">
									{#if contentType === ContentType.course}
										<div class="flex justify-between">
											{#if content?.lesson?.filter((l) => l.locked).length}
												<span class="chip variant-filled-primary py-1 px-4 rounded-full text-sm"
													>Pro</span
												>
											{:else}
												<span class="chip variant-ringed py-1 px-4 rounded-full text-sm">Free</span>
											{/if}
											<ProCourseMark
												data={{
													course: content,
													user: data.user
												}}
											/>
										</div>
									{:else}
										<div class="flex justify-end h-6">
											<ProCourseMark
												data={{
													content,
													user: data.user
												}}
											/>
										</div>
									{/if}
									<h3 class="font-sans text-lg tracking-wide text-bold">
										{content.title}
									</h3>
									{#if content?.excerpt}
										<p class="text-sm font-hairline">{content.excerpt}</p>
									{/if}
								</div>
							</section>
						</a>
					</div>
				{/each}
			</section>
			{#if next}
				<div class="flex justify-center m-8">
					<button class="text-2xl btn variant-filled-primary" on:click={() => more()}>
						Show More
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
