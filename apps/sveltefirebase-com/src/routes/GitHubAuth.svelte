<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Github } from '@steeze-ui/simple-icons';

	//Firebase
	import { ccdSignInWithPopUp } from '$lib/client/firebase';
	import { GithubAuthProvider } from 'firebase/auth';
	const provider = new GithubAuthProvider();

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	// Display
	import { enhance } from '$app/forms';
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	use:enhance={async ({ cancel }) => {
		try {
			await ccdSignInWithPopUp(provider);
		} catch (err) {
			if (err instanceof Error) {
				console.error(err);

				toastStore.trigger({
					message: err.message,
					background: 'variant-filled-error'
				});
			}
		}
		cancel();
	}}
>
	<button class="btn flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Github} class="w-4" />
		<div class="text-lg">GitHub</div>
	</button>
</form>
