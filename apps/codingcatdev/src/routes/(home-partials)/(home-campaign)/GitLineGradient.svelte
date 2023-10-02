<script>
	export let rotate = false;
</script>

<div class={`w-[3px] h-full rounded mx-auto ${rotate && 'rotate-180'}`} />

<style>
	div {
		background: linear-gradient(
			rgb(var(--color-surface-800)),
			rgb(var(--color-surface-400)) 50%,
			rgb(var(--color-surface-200))
		);
	}
</style>
