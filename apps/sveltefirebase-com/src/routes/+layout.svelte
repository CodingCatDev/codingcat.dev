<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Modal, initializeStores, Toast } from '@skeletonlabs/skeleton';
	initializeStores();

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<Modal />
<Toast />

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar background="">
			<svelte:fragment slot="lead">
				<a
					href="/"
					class="visible text-2xl font-bold text-white hover:text-brand"
					aria-label="home page"
				>
					<img
						class="inline w-12 h-12 mb-1 mr-2 lg:w-20 lg:h-20 color-white"
						src="/favicon.svg"
						alt=""
					/>
					Course
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					href="/#whatYouBuild"
					class="text-xl font-bold text-center transition-all hover:scale-105 hidden lg:inline-block"
					>What You&#39;ll Build
				</a><a
					href="/#whoIsItFor"
					class="text-xl font-bold text-center transition-all hover:scale-105 hidden lg:inline-block"
					>Who Is This For
				</a><a
					href="/#yourInstructor"
					class="text-xl font-bold text-center transition-all hover:scale-105 hidden lg:inline-block"
					>Your Instructor
				</a><a
					href="/#faq"
					class="text-xl font-bold text-center transition-all hover:scale-105 hidden lg:inline-block"
					>FAQ
				</a>

				<a
					href="/#pricing"
					class="px-6 py-3 text-sm font-bold text-primary-500 transition-transform bg-white rounded-lg sm:text-xl hover:scale-105"
				>
					Start Learning
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
