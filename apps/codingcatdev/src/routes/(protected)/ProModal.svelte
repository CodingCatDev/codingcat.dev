<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		ArrowTopRightOnSquare,
		CheckCircle,
		PaintBrush,
		RocketLaunch
	} from '@steeze-ui/heroicons';

	import KcPrimary from '$lib/components/global/icons/KCPrimary.svelte';
	import AjPrimary from '$lib/components/global/icons/AJPrimary.svelte';

	let monthly = true;
	const onSelect = (setMonth: boolean) => {
		monthly = setMonth;
	};
	import { getModalStore, getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	import { addSubscription } from '$lib/client/firebase';
	import { onSnapshot } from 'firebase/firestore';

	let redirecting = false;
	const onSubscribe = async (products: { role: string; price: string }[], uid: string) => {
		const price = products
			.filter((p) => (monthly ? p.role === 'monthly' : p.role === 'yearly'))
			.at(0)?.price;
		if (!price) {
			toastStore.trigger({
				message: 'Missing price data, contact Alex!',
				background: 'variant-filled-error'
			});
		} else {
			redirecting = true;
			const docRef = await addSubscription(price, uid);

			onSnapshot(docRef, (snap) => {
				const { error, url } = snap.data() as { error: Error; url: string };
				if (error) {
					toastStore.trigger({
						message: error.message,
						background: 'variant-filled-error'
					});
				}
				if (url) {
					// We have a Stripe Checkout URL, let's redirect.
					window.location.assign(url);
				}
			});
		}
	};

	const base = 'card p-2 md:p-8 flex flex-col items-center relative w-full hover:bg-opacity-90';
</script>

<div class="flex flex-col gap-2 p-2 card md:p-8 md:gap-8">
	<div class="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-8">
		<button
			class={`${base} ${monthly ? 'variant-filled-primary' : 'variant-soft-primary'}`}
			on:click={() => onSelect(true)}
		>
			{#if monthly}
				<div class="absolute top-0 right-0 mt-2 mr-2">
					<Icon src={CheckCircle} theme="solid" class="w-8" />
				</div>
			{/if}
			<span class="text-xl font-medium">Monthly</span>
			<div class="flex flex-row items-end justify-center mt-2">
				<span class="text-5xl font-bold">$29</span>
				<div class="mt-5">
					<span class="text-xl font-medium text-surface-50-900-token">/mo</span>
				</div>
			</div>
			<div class="mb-6">
				<span class="text-xs font-medium">Just $0.79 per day</span>
			</div>
			<KcPrimary />
		</button>
		<button
			class={`${base} ${!monthly ? 'variant-filled-primary' : 'variant-soft-primary'}`}
			on:click={() => onSelect(false)}
		>
			{#if !monthly}
				<div class="absolute top-0 right-0 mt-2 mr-2">
					<Icon src={CheckCircle} theme="solid" class="w-8" />
				</div>
			{/if}
			<span class="text-xl font-medium">Annual</span>
			<div class="flex flex-row items-end justify-center mt-2">
				<span class="text-5xl font-bold">$199</span>
				<div class="mt-5">
					<span class="text-xl font-medium text-surface-50-900-token">/year</span>
				</div>
			</div>
			<div class="mb-6">
				<span class="text-xs font-medium">Save $149 compared to monthly</span>
			</div>
			<AjPrimary />
		</button>
	</div>
	<div>
		<div class="p-2 card variant-filled-primary md:p-8">
			<h2>Pro</h2>
			<ul class="text-left text-md md:text-lg">
				<li class="flex flex-row items-center gap-1 my-2">
					<Icon src={RocketLaunch} theme="solid" class="w-8" />
					Watch all PRO courses
				</li>
				<li class="flex flex-row items-center gap-1 my-2">
					<Icon src={RocketLaunch} theme="solid" class="w-8" />
					Join PRO office hours
				</li>
				<li class="flex flex-row items-center gap-1 my-2">
					<Icon src={RocketLaunch} theme="solid" class="w-8" />
					Read all PRO posts
				</li>
				<li class="flex flex-row items-center gap-1 my-2">
					<Icon src={PaintBrush} theme="solid" class="w-8" />
					Pro Picked Custom Theme
				</li>
			</ul>
		</div>
	</div>

	{#if redirecting}
		<button class="flex self-end gap-2 btn variant-filled-surface">
			Redirecting
			<ProgressRadial
				stroke={100}
				meter="stroke-primary-50"
				track="stroke-primary-500/30"
				class="w-8"
			/>
		</button>
	{:else}
		<button
			class="flex self-end gap-2 btn variant-filled-surface"
			on:click|once={() => onSubscribe($modalStore[0].meta?.products, $modalStore[0].meta?.uid)}
		>
			Continue
			<Icon src={ArrowTopRightOnSquare} theme="mini" class="w-8" />
		</button>
	{/if}
</div>
