<script lang="ts">
	export let products: {
		price: string;
		id: string;
	}[];
	export let title: string;

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	import BuyModal from './BuyModal.svelte';

	const showBuy = () => {
		const d: ModalSettings = {
			type: 'component',
			component: {
				ref: BuyModal
			},
			meta: {
				products: products,
				title
			}
		};
		modalStore.trigger(d);
	};
</script>

<button
	class="inline-block w-full px-8 py-4 mb-2 text-sm text-center text-white transition-transform duration-200 rounded-lg bg-primary-500 sm:text-xl md:text-2xl hover:scale-105"
	on:click={showBuy}
>
	Buy Now
</button>
