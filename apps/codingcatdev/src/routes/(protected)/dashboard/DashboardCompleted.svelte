<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import Image from '$lib/components/content/Image.svelte';
	import { Bookmark, CheckCircle } from '@steeze-ui/heroicons';
	import ProButton from '../ProButton.svelte';
	import type { PageData } from './$types';
	import { collectionStore, userStore } from 'sveltefire';
	import { auth, firestore } from '$lib/client/firebase';
	import type { Saved } from '$lib/types';
	import { collection, orderBy, query } from 'firebase/firestore';
	const user = userStore(auth);

	export let data: PageData;
	const bookmarkedRef = 'users/' + $user?.uid + `/completed`;
	const q: any = query(collection(firestore, bookmarkedRef), orderBy('savedUpdated', 'desc'));
	const completed = collectionStore<Saved>(firestore, q);
</script>

<div>
	<div class="flex gap-1">
		<div class="w-8"><Icon src={CheckCircle} theme="solid" /></div>
		<h3>Completed</h3>
	</div>
	{#if !data?.user?.stripeRole}
		<div class="flex flex-col gap-2">
			<div class="text-xl">You must be a Pro member to view completed lessons.</div>
			<ProButton products={data.products} uid={data.user?.uid} />
		</div>
	{:else if $user?.uid}
		<div class="flex flex-col gap-4 p-2">
			<div class="p-4 sm:p-10">
				<section class="relative grid gap-4 grid-cols-fit sm:gap-10">
					{#each $completed as completed (completed)}
						<div class="ccd-grid-card relative max-w-sm">
							<a class="self-start" href={`/${completed.type}/${completed.slug}`}>
								{#if completed?.cover}
									<Image
										src={completed.cover}
										alt={completed.title || 'Missing Alt Sorry'}
										classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
									/>
								{:else}
									<Image
										src="https://media.codingcat.dev/image/upload/dev-codingcatdev-photo/v60h88eohd7ufghkspgo"
										alt={completed.title || 'Missing Alt Sorry'}
										classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video rounded-md rounded-b-none cursor-pointer"
									/>
								{/if}
								<section class="grid h-full grid-cols-1 gap-2 p-4">
									<div class="flex justify-between">
										<h3 class="font-sans text-lg tracking-wide text-bold">
											{completed.title}
										</h3>
									</div>
								</section>

								{#if completed?.lesson}
									<div class="p-2 md:p-4">
										<nav class="nav-list-nav">
											<ul>
												{#each completed.lesson as l}
													<li class="flex justify-between">
														<a
															href={`/course/${completed?.slug}/lesson/${l.slug}`}
															class={`${l.slug} flex gap-1`}
														>
															{l.title}
														</a>
													</li>
												{/each}
											</ul>
										</nav>
									</div>
								{/if}
							</a>
						</div>
					{/each}
				</section>
			</div>
		</div>
	{/if}
</div>
