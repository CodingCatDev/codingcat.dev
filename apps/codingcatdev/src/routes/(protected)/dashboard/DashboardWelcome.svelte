<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div
	class="bcu-card variant-filled min-h-full flex flex-col w-full justify-center items-start gap-4 p-8"
>
	<div class="flex items-center gap-4">
		<img src={data.user ? data.user.picture : '/images/avatar.png'} alt="User's avatar" />
		<h2 class="text-md">Welcome, {data.user?.email}!</h2>
	</div>
	<p class="p-2">Now that you're here, get involved!</p>
</div>
