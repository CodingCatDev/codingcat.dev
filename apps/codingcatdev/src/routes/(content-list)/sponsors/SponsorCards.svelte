<script lang="ts">
	import Image from '$lib/components/content/Image.svelte';
	import type { ContentType, Sponsor } from '$lib/types';

	export let data: { contentType: ContentType; content: Sponsor[]; next?: any };

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
				{#each data?.content as sponsor}
					<a
						class="max-w-sm overflow-hidden card bg-initial card-hover"
						href={`/sponsor/${sponsor.slug}`}
					>
						<header>
							{#if sponsor?.cover}
								<Image src={sponsor.cover} alt={sponsor?.name} />
							{/if}
						</header>
						<div class="p-4 space-y-4">
							<h3 data-toc-ignore="">{sponsor?.name}</h3>
							<article>
								<p>
									{sponsor?.description}
								</p>
							</article>
						</div>
					</a>
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

<style>
	.grid-cols-fit {
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	}
</style>
