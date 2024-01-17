<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Google } from '@steeze-ui/simple-icons';

	//Firebase
	import { ccdSignInWithPopUp } from '$lib/client/firebase';
	import { GoogleAuthProvider } from 'firebase/auth';
	const provider = new GoogleAuthProvider();

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	// Display
	import { enhance } from '$app/forms';
	import { FirebaseError } from 'firebase/app';
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	use:enhance={async ({ cancel }) => {
		try {
			await ccdSignInWithPopUp(provider);
		} catch (err) {
			if (err instanceof FirebaseError) {
				if (err.code === 'auth/account-exists-with-different-credential') {
					toastStore.trigger({
						message:
							'Account Exists with Different Login Method. Please first login and then link within your Account page.',
						background: 'variant-filled-warning'
					});
				} else {
					console.error(err);

					toastStore.trigger({
						message: err.message,
						background: 'variant-filled-error'
					});
				}
			} else {
				console.error(err);
			}
		}

		cancel();
	}}
>
	<button class="btn flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Google} class="w-4" />
		<div class="text-lg">Google</div>
	</button>
</form>
