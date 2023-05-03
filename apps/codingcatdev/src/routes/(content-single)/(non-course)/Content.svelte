<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ArrowTopRightOnSquare } from '@steeze-ui/heroicons';

	import Video from '$lib/components/content/Video.svelte';
	import type { Author, Content, ContentType, Podcast } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import CloudinaryImage from '$lib/components/content/CloudinaryImage.svelte';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	export let data: {
		content: Content & Podcast;
		contentType: ContentType;
		guests?: Author[];
		authors?: Author[];
	};
	$: title = pluralize({ type: data.contentType } as Content);
	$: picks = data?.content?.picks;
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col justify-center w-full gap-8 p-1 xl:flex-row xl:p-8">
			<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				<ol class="bcu-breadcrumb">
					<li class="capitalize bcu-crumb"><a href={`/${title}`}>{title}</a></li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.title}</li>
				</ol>
				{#if data?.content?.youtube}
					<Video src={data.content.youtube} title={`${data.content.title}`} />
				{:else if data?.content?.cover}
					<CloudinaryImage src={data.content.cover} alt={data.content.title} />
				{/if}

				<!-- Guest and Author Cards -->
				<div class="flex gap-2 md:gap-8">
					{#if data?.guests}
						<section class="flex gap-2 md:gap-8">
							{#each data?.guests as guest (guest.slug)}
								<a
									class="bcu-button flex gap-2 items-center variant-ghost p-2 rounded-md"
									href={`/guest/${guest.slug}`}
								>
									{#if guest?.cover}
										<div class="w-8 md:w-12">
											{#key guest.slug}
												<CloudinaryImage src={guest.cover} alt={guest?.name} />
											{/key}
										</div>
									{/if}
									<div>{guest?.name}</div>
								</a>
							{/each}
						</section>
					{/if}
					{#if data?.authors}
						<section class="flex gap-2 md:gap-8">
							{#each data?.authors as author (author.slug)}
								<a
									class="bcu-button flex gap-2 items-center variant-ghost p-2 rounded-md"
									href={`/author/${author.slug}`}
								>
									{#if author?.cover}
										<div class="w-8 md:w-12">
											{#key author.slug}
												<CloudinaryImage src={author.cover} alt={author?.name} />
											{/key}
										</div>
									{/if}
									<div>{author?.name}</div>
								</a>
							{/each}
						</section>
					{/if}
				</div>
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
										<header class="bcu-card-header flex gap-2 md:gap-8 items-center">
											{#if guest?.cover}
												<div class="w-8 md:w-12">
													{#key guest.slug}
														<CloudinaryImage src={guest.cover} alt={guest?.name} />
													{/key}
												</div>
											{/if}
											<h3>{guest?.name}</h3>
										</header>
										<section class="p-4 flex flex-wrap gap-2 md:gap-8">
											{#each picks.filter((p) => p?.author === guest?.slug) as pick (pick.name)}
												<a
													class="bcu-button variant-filled-primary flex gap-2"
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
										<header class="bcu-card-header flex gap-2 md:gap-8 items-center">
											{#if author?.cover}
												<div class="w-8 md:w-12">
													{#key author.slug}
														<CloudinaryImage src={author.cover} alt={author?.name} />
													{/key}
												</div>
											{/if}
											<h3>{author?.name}</h3>
										</header>
										<section class="p-4 flex flex-wrap gap-2 md:gap-8">
											{#each picks.filter((p) => p?.author === author?.slug) as pick (pick.name)}
												<a
													class="bcu-button variant-filled-primary flex gap-2"
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
