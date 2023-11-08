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
	export let action: string;
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	{action}
	use:enhance={async ({ action, cancel, controller, data, form }) => {
		try {
			await ccdSignInWithPopUp(provider);
		} catch (err) {
			if (err instanceof Error) {
				toastStore.trigger({
					message: err.message,
					background: 'variant-filled-error'
				});
			}
		}
		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set

			update();
		};
	}}
>
	<button class="btn flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Github} class="w-4" />
		<div class="text-lg">GitHub</div>
	</button>
</form>
