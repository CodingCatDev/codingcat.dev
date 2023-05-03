<script lang="ts">
	import Lesson from './Lesson.svelte';
	import ProButton from '../../../../../(protected)/ProButton.svelte';

	export let data;
</script>

{#if data.locked && data.products}
	<section class="flex flex-col justify-center mt-8 items-center p-2">
		<div class="flex flex-col items-center gap-8">
			<div class="font-bold flex flex-col gap-2 max-w-4xl">
				<span class="text-3xl">You have reached a locked lesson.</span>
				<div class="text-primary-500 text-2xl">{data.title}</div>
				Select the button below to add a Pro membership to your account.
			</div>
			<ProButton products={data.products} uid={data.user?.uid} />
		</div>
	</section>
{:else if data.content}
	<Lesson {data} />
{:else}
	Nice find, we are totally missing something!
{/if}
