<script lang="ts">
	import { enhance } from '$app/forms';

	import { ccdSignUpWithEmailAndPassword } from '$lib/client/firebase';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	use:enhance={async ({ action, cancel, controller, data, form }) => {
		// `form` is the `<form>` element
		// `data` is its `FormData` object
		// `action` is the URL to which the form is posted
		// `cancel()` will prevent the submission

		const email = `${data.get('email')}`;
		const password = `${data.get('password')}`;

		if (!email || !password) {
			toastStore.trigger({
				message: 'Please Provide Username and Password.'
			});
			cancel();
		} else {
			try {
				await ccdSignUpWithEmailAndPassword({ email, password });
			} catch (err) {
				if (err instanceof Error) {
					console.error(err);
					toastStore.trigger({
						message: err.message,
						background: 'variant-filled-error'
					});
				}
			}
		}

		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the logic that would be triggered if this callback wasn't set

			update();
		};
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
		<button class="btn variant-filled-primary" type="submit">Sign Up</button>
	</div>
</form>
