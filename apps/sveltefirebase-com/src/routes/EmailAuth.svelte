<script lang="ts">
	import { enhance } from '$app/forms';

	import { ccdSignInWithEmailAndPassword } from '$lib/client/firebase';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	use:enhance={async ({ cancel, data }) => {
		const email = `${data.get('email')}`;
		const password = `${data.get('password')}`;

		if (!email || !password) {
			toastStore.trigger({
				message: 'Please Provide Username and Password.'
			});
			cancel();
		} else {
			try {
				await ccdSignInWithEmailAndPassword({ email, password });
			} catch (err) {
				if (err instanceof Error) {
					toastStore.trigger({
						message: err.message,
						background: 'variant-filled-error'
					});
				}
			}
		}
		cancel();
	}}
>
	<div class="flex flex-col gap-4 text-token">
		<label class="label">
			<span>Email</span>
			<input class="input" name="email" type="email" placeholder="alex@codingcat.dev" />
		</label>
		<label class="label">
			<span>Password</span>
			<input class="input" name="password" type="password" />
		</label>
		<button class="btn variant-filled-primary" type="submit">Login</button>
	</div>
</form>
