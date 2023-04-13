<script lang="ts">
	export let products: {
		price: string;
		id: string;
	}[];

	export let uid: string | undefined;

	import { Icon } from '@steeze-ui/svelte-icon';
	import { RocketLaunch } from '@steeze-ui/heroicons';

	import { modalStore, type ModalSettings } from '@codingcatdev/blackcatui';

	import ProModal from './ProModal.svelte';

	const showPro = () => {
		const d: ModalSettings = {
			type: 'component',
			component: {
				ref: ProModal
			},
			meta: {
				products: products,
				uid
			}
		};
		modalStore.trigger(d);
	};
</script>

<button
	class="bcu-card variant-filled-primary w-full max-w-sm p-8 relative hover:shadow-2xl hover:scale-105 hover:cursor-pointer ease-in-out duration-300"
	aria-label="open-pro-modal"
	on:click={showPro}
>
	<div class="absolute top-0 right-0 mt-2 mr-2 md:mt-8 md:mr-8">
		<div class="bcu-button variant-filled-surface capitalize">Go Pro</div>
	</div>
	<h2>Pro</h2>
	<ul class="text-left text-md md:text-lg">
		<li class="my-2 flex flex-row gap-1 items-center">
			<Icon src={RocketLaunch} theme="solid" class="w-8" />
			Watch all PRO courses
		</li>
		<li class="my-2 flex flex-row gap-1 items-center">
			<Icon src={RocketLaunch} theme="solid" class="w-8" />
			Join PRO office hours
		</li>
		<li class="my-2 flex flex-row gap-1 items-center">
			<Icon src={RocketLaunch} theme="solid" class="w-8" />
			Read all PRO tutorials
		</li>
		<li class="my-2 flex flex-row gap-1 items-center">
			<Icon src={RocketLaunch} theme="solid" class="w-8" />
			Get PRO source code from GitHub
		</li>
	</ul>
</button>
