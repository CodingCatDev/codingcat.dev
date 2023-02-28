<script>
	import AJPrimary from '$lib/components/global/icons/AJPrimary.svelte';
	import Image from '$lib/components/content/Image.svelte';

	/** @type {import('$lib/types/index').ContentType} */
	export let type;

	/** @typedef {import('$lib/types/index').Content} Content */

	/** @type {{content: Content[], next?: any}} */
	export let data;

	let next = data.next;
	const more = async () => {
		const response = await fetch('/api/more-content', {
			method: 'POST',
			body: JSON.stringify({ contentType: type, after: next }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const d = await response.json();
		data = {
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
				{#each data?.content as content}
					<div
						class="grid transition-all rounded-md shadow-lg dark:text-primary-50 dark:bg-basics-900 grid-rows-auto-2 hover:shadow-2xl hover:scale-105 bg-base-100"
					>
						<a class="self-start" href={`/${type}/${content.slug}`}>
							{#if content?.cover}
								<Image
									src={content.cover}
									alt={content.title || 'Missing Alt Sorry'}
									classes="rounded-md rounded-b-none cursor-pointer"
								/>
							{:else}
								<div class="relative" style="paddingBottom: '56.25%'">
									<div
										class="absolute flex items-center flex-auto w-full h-full rounded-t-md bg-primary-900 dark:bg-primary-900"
									>
										<AJPrimary cls="w-full h-full p-4" />
									</div>
								</div>
							{/if}

							<section class="grid h-full grid-cols-1 gap-2 p-4">
								<div class="space-y-2">
									<h3 class="font-sans text-lg tracking-wide text-bold">
										<a href={`/${type}/${content.slug}`}>{content.title}</a>
									</h3>
									{#if content.excerpt}
										<p class="text-sm font-hairline ">{content.excerpt}</p>
									{/if}
									{#if content.authors}
										<div class="flex flex-col">
											{#each content.authors as author}
												<a href={`/authors/${author.slug}`} class="font-sans text-lg">
													{author.displayName}
												</a>
											{/each}
										</div>
									{/if}
								</div>
							</section>
						</a>
					</div>
				{/each}
			</section>
			{#if next && Object.keys(next).length}
				<div class="flex justify-center m-8">
					<button class="text-2xl btn btn-lg btn-primary" on:click={() => more()}> More </button>
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
