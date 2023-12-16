<script lang="ts">
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	import type { LayoutData } from '../$types';

	import { Collection, SignedIn } from 'sveltefire';
	export let data: LayoutData;
</script>

<div class="card p-8 flex flex-col gap-2 md:gap-8 w-full">
	<h2>Purchases</h2>
	<SignedIn let:user>
		{#if user?.uid}
			<Collection ref={`stripe-customers/${user.uid}/payments`} let:data={payments}>
				{#each payments as payment}
					{#each payment?.items as item}
						{#each data?.courses?.filter( (c) => c.product?.filter((p) => p === `${item.product}`) ) as course}
							<a class="flex justify-between align-middle" href={`/course/${course.slug}`}>
								{#if course.cover}
									<CloudinaryImage classes="w-20" src={course.cover} />
								{/if}
								<div class="text-2xl font-bold">{item.description}</div>
								<div class="text-2xl font-bold">{item.quantity}</div>
								<div class="text-2xl font-bold flex gap-1">
									<span>${item.amount_total / 100}</span>
									<span>{item.currency}</span>
								</div>
							</a>
						{/each}
					{/each}
				{/each}
			</Collection>
		{/if}
	</SignedIn>
</div>
