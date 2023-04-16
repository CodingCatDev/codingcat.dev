<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import { ccdSignInWithEmailAndPassword } from '$lib/client/firebase';

	import { toastStore } from '@codingcatdev/blackcatui';

	export let action: string;
</script>

<form
	class="flex justify-center w-full"
	method="POST"
	{action}
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
			<input class="input" name="email" type="email" placeholder="codercatdev" />
		</label>
		<label class="label">
			<span>Password</span>
			<input class="input" name="password" type="password" placeholder="****" />
		</label>
		<button class="bcu-button variant-filled-primary" type="submit">Login</button>
	</div>
</form>
