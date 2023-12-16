<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';

	let monthly = true;
	import { getModalStore, getToastStore, ProgressRadial } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	import { addSubscription } from '$lib/client/firebase';
	import { onSnapshot } from 'firebase/firestore';
	import GoogleAuth from './GoogleAuth.svelte';
	import GitHubAuth from './GitHubAuth.svelte';
	import SignupAuth from './SignupAuth.svelte';
	import EmailAuth from './EmailAuth.svelte';

	let redirecting = false;
	const onSubscribe = async (products: { role: string; price: string }[], uid: string) => {
		const price = products.at(0)?.price;
		if (!price) {
			console.error('Missing Pricing');
			toastStore.trigger({
				message: 'Missing price data, contact Alex!',
				background: 'variant-filled-error'
			});
		} else {
			redirecting = true;
			const docRef = await addSubscription(price, uid);

			onSnapshot(docRef, (snap) => {
				const { error, url } = snap.data() as { error: Error; url: string };
				if (error) {
					toastStore.trigger({
						message: error.message,
						background: 'variant-filled-error'
					});
				}
				if (url) {
					// We have a Stripe Checkout URL, let's redirect.
					window.location.assign(url);
				}
			});
		}
	};
	import { FirebaseApp, SignedIn, SignedOut } from 'sveltefire';
	import { auth, firestore, storage } from '$lib/client/firebase';
	let signin = false;
</script>

<div class="card p-2 md:p-8 flex flex-col gap-2 md:gap-8">
	{#if redirecting}
		<button class="btn variant-filled-surface flex self-end gap-2">
			Redirecting
			<ProgressRadial
				stroke={100}
				meter="stroke-primary-50"
				track="stroke-primary-500/30"
				class="w-8"
			/>
		</button>
	{:else}
		<FirebaseApp {auth} {firestore} {storage}>
			<SignedIn let:user let:signOut>
				<div class="flex gap-2 align-middle items-start">
					<p>{user.displayName}</p>
					<button class="btn variant-filled btn-sm" on:click={signOut}>Sign Out</button>
				</div>
				<h2>{$modalStore[0]?.meta?.title}</h2>
				<button
					class="btn variant-filled-surface flex self-end gap-2"
					on:click|once={() => onSubscribe($modalStore[0].meta?.products, user.uid)}
				>
					Continue to Stripe
					<Icon src={ArrowTopRightOnSquare} theme="mini" class="w-8" />
				</button>
			</SignedIn>

			<SignedOut let:auth>
				<section class="card flex flex-col gap-4 p-4">
					{#if signin}
						<EmailAuth />
						<button on:click={() => (signin = false)}>Signup Instead</button>
					{:else}
						<SignupAuth />
						<button on:click={() => (signin = true)}>Login Instead</button>
					{/if}
					<hr />

					<GoogleAuth />
					<!-- <TwitterAuth /> -->
					<GitHubAuth />
				</section>
			</SignedOut>
		</FirebaseApp>
	{/if}
</div>
