<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-col justify-between w-full gap-2 card md:flex-row md:gap-8">
	<div class="flex flex-col w-full gap-4 p-8 md:flex-row md:justify-between md:gap-8">
		<div class="md:w-1/3">
			<h2 class="mb-8">User Settings</h2>
			<p>Settings for your account.</p>
		</div>
		<div class="flex flex-col gap-4 p-8 card md:w-2/3">
			<!-- TODO: Add enhanced -->
			<form method="POST" class="flex flex-col gap-2">
				<SlideToggle
					name="showDrafts"
					checked={data?.settings?.showDrafts}
					disabled={!data?.user?.stripeRole}
				>
					<div class="flex gap-2">
						Show Drafts
						<div class="chip variant-filled-primary">Pro Feature</div>
					</div>
				</SlideToggle>
				<div class="flex space-y-8">
					<button class="btn variant-filled" type="submit">Update</button>
				</div>
			</form>
		</div>
	</div>
</div>
