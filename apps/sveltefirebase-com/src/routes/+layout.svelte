<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { FirebaseApp } from 'sveltefire';
	import { initializeApp } from 'firebase/app';
	import { getFirestore } from 'firebase/firestore';
	import { getStorage } from 'firebase/storage';
	import { getAuth } from 'firebase/auth';

	// Initialize Firebase
	const app = initializeApp({
		apiKey: 'AIzaSyC6HNoa2QaPsqnolKbeMQUd5_RR1KG_kOs',
		authDomain: 'codingcat-dev.firebaseapp.com',
		databaseURL: 'https://codingcat-dev.firebaseio.com',
		projectId: 'codingcat-dev',
		storageBucket: 'codingcat-dev.appspot.com',
		messagingSenderId: '67840007708',
		appId: '1:67840007708:web:cce11b8a7708056a3d89d9',
		measurementId: 'G-S7B60EGPMJ'
	});
	const firestore = getFirestore(app);
	const storage = getStorage(app);
	const auth = getAuth(app);
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar
			background="bg-gradient-to-r from-primary-600 via-primary-500 via-90% to-secondary-500 to-97%"
		>
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
	<FirebaseApp {auth} {firestore} {storage}>
		<slot />
	</FirebaseApp>
</AppShell>
