<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import { openStripePortal } from '$lib/client/firebase';
	import LogoutButton from '../../login/LogoutButton.svelte';
</script>

<div class="bcu-card flex flex-col md:flex-row justify-between gap-2 md:gap-8 w-full">
	<div class="flex flex-col md:flex-row md:justify-between w-full p-8 gap-4 md:gap-8">
		<div class="md:w-1/3">
			<h2 class="mb-8">Account</h2>
			<p>Your account details</p>
		</div>
		<div class="bcu-card variant-filled p-8 flex flex-col gap-4 md:w-2/3">
			<div class="flex items-center gap-4">
				<p class="text-lg">Your Email:</p>
				<p>{data?.user?.email}</p>
			</div>
			<div class="flex items-center gap-4">
				<p class="text-lg">Your Avatar:</p>
				<img
					class="w-20"
					src={data.user ? data.user.picture : '/images/avatar.png'}
					alt="User's avatar"
				/>
			</div>
			<LogoutButton />
		</div>
	</div>
</div>
