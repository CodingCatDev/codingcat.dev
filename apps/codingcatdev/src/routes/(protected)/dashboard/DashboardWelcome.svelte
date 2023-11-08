<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div
	class="flex flex-col items-start justify-center w-full min-h-full gap-4 p-8 card variant-filled"
>
	<div class="flex items-center gap-4">
		<Avatar
			class="w-20 h-20 text-4xl"
			src={data.user ? data.user.picture : '/images/avatar.png'}
			alt="User Photo"
			referrerpolicy="no-referrer"
		/>
		<h2 class="text-md">Welcome, {data.user?.email}!</h2>
	</div>
	<p class="p-2">Now that you're here, get involved!</p>
</div>
