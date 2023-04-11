<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Google } from '@steeze-ui/simple-icons';

	//Firebase
	import { ccdSignInWithPopUp } from '$lib/client/firebase';
	import { GoogleAuthProvider } from 'firebase/auth';
	const provider = new GoogleAuthProvider();

	// Display
	import { enhance } from '$app/forms';
	import { toastStore } from '@codingcatdev/blackcatui';
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	action="?/login"
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
	<button class="bcu-button flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Google} class="w-4" />
		<div class="text-lg">Google</div>
	</button>
</form>
