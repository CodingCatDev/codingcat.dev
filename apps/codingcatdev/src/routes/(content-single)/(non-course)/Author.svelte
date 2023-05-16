<script lang="ts">
	import 'prism-themes/themes/prism-shades-of-purple.min.css';

	import { ContentType, type Author, type Content, type Podcast, type Course } from '$lib/types';
	import { pluralize } from '$lib/utils';
	import Image from '$lib/components/content/Image.svelte';
	import CopyCodeInjector from '$lib/components/content/CopyCodeInjector.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {
		Devdotto,
		Discord,
		Facebook,
		Github,
		Instagram,
		Linkedin,
		Mastodon,
		Medium,
		Polywork,
		Stackoverflow,
		Tiktok,
		Twitch,
		Twitter,
		Youtube
	} from '@steeze-ui/simple-icons';
	import { GlobeAmericas } from '@steeze-ui/heroicons';
	import ContentList from './ContentList.svelte';
	export let data: {
		content: Author;
		authorCourses?: Course[];
		authorPosts?: Content[];
	};
	$: title = pluralize({ type: data.content.type } as Content);
</script>

{#if data?.content}
	<div class="flex justify-center">
		<section class="flex flex-col justify-center w-full gap-8 p-2 xl:flex-row xl:p-8">
			<div class="flex flex-col w-full gap-2 md:gap-8 max-w-7xl">
				<ol class="bcu-breadcrumb">
					<li class="capitalize bcu-crumb">
						<a href={`/${title}`}>{title}</a>
					</li>
					<li class="bcu-crumb-separator" aria-hidden>&rsaquo;</li>
					<li>{data.content.name}</li>
				</ol>
				<h1>{data?.content?.name}</h1>
				{#if data?.content?.cover}
					<div class="w-40 md:w-80">
						{#key data.content.cover}
							<Image
								src={data.content.cover}
								alt={data.content.name}
								classes="object-cover w-full bg-cover rounded bg-black/50 aspect-square"
							/>
						{/key}
					</div>
				{/if}
				<section class="flex flex-wrap gap-8 m-2 md:gap-4 socials">
					{#if data?.content?.socials}
						{#if data.content?.socials?.devto}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.devto}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Devdotto} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.discord}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.discord}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Discord} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.facebook}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.facebook}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Facebook} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.github}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.github}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Github} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.instagram}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.instagram}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Instagram} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.linkedin}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.linkedin}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Linkedin} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.mastodon}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.mastodon}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Mastodon} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.medium}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.medium}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Medium} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.polywork}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.polywork}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Polywork} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.stackoverflow}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.stackoverflow}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Stackoverflow} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.tiktok}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.tiktok}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Tiktok} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.twitch}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.twitch}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Twitch} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.twitter}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.twitter}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Twitter} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.socials?.youtube}
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={data.content?.socials?.youtube}
								class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
							>
								<Icon src={Youtube} class="w-8" theme="solid" />
							</a>
						{/if}
						{#if data.content?.websites}
							{#each data.content?.websites as website}
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={website}
									class="hover:!text-primary-500 !text-surface-900 dark:!text-surface-300 dark:hover:!text-primary-500 hover:!scale-110"
								>
									<Icon src={GlobeAmericas} class="w-8" theme="solid" />
								</a>
							{/each}
						{/if}
					{/if}
				</section>
				<section class="flex flex-col flex-grow w-full gap-2 markdown md:gap-8">
					<CopyCodeInjector>
						<slot />
					</CopyCodeInjector>
				</section>
				{#if data?.authorCourses?.length}
					<h2>Courses</h2>
					<ContentList contentItems={data.authorCourses} contentType={ContentType.course} />
				{/if}
				{#if data?.authorPosts?.length}
					<h2>Posts</h2>
					<ContentList contentItems={data.authorPosts} contentType={ContentType.post} />
				{/if}
			</div>
		</section>
	</div>
{:else}
	<p>No data found yet</p>
{/if}
