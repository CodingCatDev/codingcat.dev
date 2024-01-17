<script>
	import { browser } from '$app/environment';
</script>

<svelte:head>
	{#if browser}
		<script src="https://web3forms.com/client/script.js" async defer></script>
	{/if}
</svelte:head>

<form action="https://api.web3forms.com/submit" method="POST" class="flex flex-col gap-2 card p-4">
	<input type="hidden" name="access_key" value="43c66d05-bf68-4708-a58c-8ac5da1fc4a1" />
	<input type="hidden" name="subject" value="CodingCat Sponsorship Request" />

	<label class="label"
		><span>Name</span>
		<input class="input" type="text" name="name" placeholder="Name" required />
	</label>
	<label class="label"
		><span>Email</span>

		<input class="input" type="email" name="email" placeholder="Email" required />
	</label>
	<label class="label"
		><span>Message</span>
		<textarea
			class="textarea"
			rows="4"
			placeholder="Please include anything that might help with our decision. We would love to include you to our next video or post."
			name="message"
			required
		></textarea></label
	>
	<div class="h-captcha" data-captcha="true"></div>
	<button class="btn variant-filled" type="submit">Submit Form</button>
</form>
