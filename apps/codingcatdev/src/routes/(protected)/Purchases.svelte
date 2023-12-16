<script lang="ts">
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';

	import { Collection, Doc, SignedIn } from 'sveltefire';
	import StripePortalButton from './StripePortalButton.svelte';
</script>

<div class="card p-8 flex flex-col gap-2 md:gap-8 w-full">
	<h2>Purchases</h2>
	<SignedIn let:user>
		{#if user?.uid}
			<Collection ref={`stripe-customers/${user.uid}/payments`} let:data={payments}>
				{#each payments as payment}
					{#each payment?.items as item}
						<Doc ref={`stripe-products/${item.price.product}`} let:data={product}>
							<a
								class="flex justify-between align-middle items-center"
								href={`/course/${product?.metadata?.slug}`}
							>
								{#if product?.metadata?.cover}
									<CloudinaryImage classes="w-1/6" src={product?.metadata?.cover} />
								{/if}
								<div class="text-2xl font-bold">{item.description}</div>
								<div class="">{item.quantity}</div>
								<div class="">
									<span>${item.amount_total / 100}</span>
									<span>{item.currency}</span>
								</div>
								<div class="">{new Date(item.price.created * 1000).toLocaleDateString()}</div>
							</a>
						</Doc>
					{/each}
				{/each}
			</Collection>
		{/if}
	</SignedIn>
</div>
