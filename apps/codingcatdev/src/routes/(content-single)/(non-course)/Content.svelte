<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';

	import Video from '$lib/components/content/Video.svelte';
	import type { Author, Content, ContentType, Podcast, Sponsor } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import Image from '$lib/components/content/Image.svelte';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	export let data: {
		content: Content & Podcast;
		contentType: ContentType;
		guests?: Author[];
		authors?: Author[];
		sponsors?: Sponsor[];
	};
	$: title = pluralize({ type: data.contentType } as Content);
	$: picks = data?.content?.picks;
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col justify-center w-full gap-8 p-2 xl:flex-row xl:p-8">
			<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				<ol class="bcu-breadcrumb">
					<li class="capitalize bcu-crumb"><a href={`/${title}`}>{title}</a></li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.title}</li>
				</ol>
				{#if data?.content?.youtube}
					<Video src={data.content.youtube} title={`${data.content.title}`} />
				{:else if data?.content?.cover}
					<Image src={data.content.cover} alt={data.content.title} />
				{/if}

				<div class="flex gap-2 md:gap-8">
					<!-- Guests -->
					{#if data?.guests}
						<section class="flex gap-2 md:gap-8">
							{#each data?.guests as guest (guest.slug)}
								<a
									class="flex items-center gap-2 p-2 rounded-md bcu-button variant-ghost"
									href={`/guest/${guest.slug}`}
								>
									{#if guest?.cover}
										<div class="w-8 md:w-12">
											{#key guest.slug}
												<Image
													src={guest.cover}
													alt={guest?.name}
													classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square"
												/>
											{/key}
										</div>
									{/if}
									<div>{guest?.name}</div>
								</a>
							{/each}
						</section>
					{/if}

					<!-- Authors -->
					{#if data?.authors}
						<section class="flex gap-2 md:gap-8">
							{#each data?.authors as author (author.slug)}
								<a
									class="flex items-center gap-2 p-2 rounded-md bcu-button variant-ghost"
									href={`/author/${author.slug}`}
								>
									{#if author?.cover}
										<div class="w-8 md:w-12">
											{#key author.slug}
												<Image
													src={author.cover}
													alt={author?.name}
													classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square"
												/>
											{/key}
										</div>
									{/if}
									<div>{author?.name}</div>
								</a>
							{/each}
						</section>
					{/if}
				</div>

				<!-- Sponsors -->
				{#if data?.sponsors}
					<hr />

					<h2>Sponsors</h2>
					<section class="flex flex-col gap-2 md:flex-row md:gap-8">
						{#each data?.sponsors as sponsor (sponsor.slug)}
							<a
								class="max-w-sm overflow-hidden bcu-card bg-initial card-hover"
								href={`${sponsor.url}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<header>
									{#if sponsor?.cover}
										<Image
											src={sponsor.cover}
											alt={sponsor?.name}
											classes="object-cover w-full bg-cover rounded bg-black/50 aspect-video"
										/>
									{/if}
								</header>
								<div class="p-4 space-y-4">
									<h3 data-toc-ignore="">{sponsor?.name}</h3>
									<article>
										<p>
											{sponsor?.description}
										</p>
									</article>
								</div>
							</a>
						{/each}
					</section>
				{/if}

				<!-- Main Content -->
				<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
					<CopyCodeInjector>
						{@html data.content.html}
					</CopyCodeInjector>
				</section>

				<!-- Podcast Picks -->
				{#if picks?.length}
					<div class="flex flex-col gap-2 md:gap-8">
						{#if data?.guests}
							<h2>Guest Picks</h2>

							<section class="flex flex-col gap-2 md:gap-8">
								{#each data?.guests as guest (guest.slug)}
									<div class="bcu-card">
										<header class="flex items-center gap-2 bcu-card-header md:gap-8">
											{#if guest?.cover}
												<div class="w-8 md:w-12">
													{#key guest.slug}
														<Image src={guest.cover} alt={guest?.name} />
													{/key}
												</div>
											{/if}
											<h3>{guest?.name}</h3>
										</header>
										<section class="flex flex-wrap gap-2 p-4 md:gap-8">
											{#each picks.filter((p) => p?.author === guest?.slug) as pick (pick.name)}
												<a
													class="flex gap-2 bcu-button variant-soft-primary"
													href={pick.site}
													target="_blank"
													rel="noopener noreferrer"
												>
													{pick.name}
													<Icon src={ArrowTopRightOnSquare} theme="solid" class="w-6" />
												</a>
											{/each}
										</section>
									</div>
								{/each}
							</section>
						{/if}

						{#if data?.authors}
							<h2>Host Picks</h2>

							<section class="flex flex-col gap-2 md:gap-8">
								{#each data?.authors as author (author.slug)}
									<div class="bcu-card">
										<header class="flex items-center gap-2 bcu-card-header md:gap-8">
											{#if author?.cover}
												<div class="w-8 md:w-12">
													{#key author.slug}
														<Image src={author.cover} alt={author?.name} />
													{/key}
												</div>
											{/if}
											<h3>{author?.name}</h3>
										</header>
										<section class="flex flex-wrap gap-2 p-4 md:gap-8">
											{#each picks.filter((p) => p?.author === author?.slug) as pick (pick.name)}
												<a
													class="flex gap-2 bcu-button variant-soft-primary"
													href={pick.site}
													target="_blank"
													rel="noopener noreferrer"
												>
													{pick.name}
													<Icon src={ArrowTopRightOnSquare} theme="solid" class="w-6" />
												</a>
											{/each}
										</section>
									</div>
								{/each}
							</section>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
