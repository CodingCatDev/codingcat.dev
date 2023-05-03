<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import type { Author, ContentType } from '$lib/types';

	export let data: { content: Author[]; next?: any; contentType: ContentType };

	let next = data.next;
	const more = async () => {
		const response = await fetch('/api/more-content', {
			method: 'POST',
			body: JSON.stringify({ contentType: data.contentType, after: next }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const d = await response.json();
		data = {
			contentType: data.contentType,
			content: [...data.content, ...d.content],
			next
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
				{#each data?.content as author}
					<div class="ccd-grid-card">
						<a class="self-start" href={`/author/${author.slug}`}>
							{#if author?.cover}
								<Image
									src={author.cover}
									alt={author.name || 'Missing Alt Sorry'}
									classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square w-full rounded-md rounded-b-none cursor-pointer"
								/>
							{:else}
								<Image
									src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
									alt={author.name || 'Missing Alt Sorry'}
									classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square w-full rounded-md rounded-b-none cursor-pointer"
								/>
							{/if}

							<section class="grid h-full grid-cols-1 gap-2 p-4">
								<div class="space-y-2">
									<h3 class="font-sans text-lg tracking-wide text-bold">
										{author.name}
									</h3>
								</div>
							</section>
						</a>
					</div>
				{/each}
			</section>
			{#if next}
				<div class="flex justify-center m-8">
					<button class="text-2xl bcu-button variant-filled-primary" on:click={() => more()}>
						Show More
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.grid-cols-fit {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
