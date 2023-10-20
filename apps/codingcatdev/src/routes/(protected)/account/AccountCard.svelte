<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	import { openStripePortal } from '$lib/client/firebase';
	import LogoutButton from '../../login/LogoutButton.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
</script>

<div class="flex flex-col justify-between w-full gap-2 card md:flex-row md:gap-8">
	<div class="flex flex-col w-full gap-4 p-8 md:flex-row md:justify-between md:gap-8">
		<div class="md:w-1/3">
			<h2 class="mb-8">Account</h2>
			<p>Your account details</p>
		</div>
		<div class="flex flex-col gap-4 p-8 card variant-filled md:w-2/3">
			<div class="flex items-center gap-4">
				<p class="text-lg">Your Email:</p>
				<p>{data?.user?.email}</p>
			</div>
			<div class="flex items-center gap-4">
				<p class="text-lg">Your Avatar:</p>
				<Avatar
					class="w-20 h-20 text-4xl"
					src={data.user ? data.user.picture : '/images/avatar.png'}
					alt="User Photo"
					referrerpolicy="no-referrer"
				/>
			</div>
			<LogoutButton />
		</div>
	</div>
</div>
