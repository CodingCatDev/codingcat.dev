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
	export let action: string;
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	{action}
	use:enhance={async () => {
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
					toastStore.trigger({
						message: err.message,
						background: 'variant-filled-error'
					});
				}
			} else {
				console.error(err);
			}
		}

		return async ({ update }) => {
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set
			update();
		};
	}}
>
	<button class="btn flex gap-2 variant-ringed-primary w-full" type="submit">
		<Icon src={Google} class="w-4" />
		<div class="text-lg">Google</div>
	</button>
</form>
