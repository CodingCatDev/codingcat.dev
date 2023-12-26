---
type: podcast
authors:
  - alex-patterson
episode: 4
recording_date: December 20, 2023 12:00 PM
season: 1
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1702737519/main-codingcatdev-photo/2023-12-20-benniks.png
devto:
excerpt: Tim teaches Alex how to make your own SaaS using Supabase, Algolia and Nuxt.
guests:
  - tim-benniks
hashnode:
picks:
slug: cwcc-2023-12-20-building-your-own-sass
sponsors:
  - algolia
spotify:
start: Dec 18, 2023
title: Building your Own SaSS
youtube: https://www.youtube.com/live/G1JabZnaoNA?si=ciTR8oJGuq5ZgTQ2
---

<script>
  import OpenIn from '$lib/components/content/OpenIn.svelte'
</script>

<OpenIn url="https://github.com/CodingCatDev/cwcc-sass-supabase-nuxt-algolia"  />

Creating a SaaS platform using [Supabase](https://supabase.com/), [Nuxt](https://nuxt.com/), and [Algolia](https://www.algolia.com/) is an exciting project that combines powerful technologies for a robust end product. Let's walk through the steps to set this up:

## Setting up a Nuxt Project

First, you need to set up a Nuxt project. Nuxt is a powerful [Vue.js](https://vuejs.org/) framework that simplifies web development. You can create a new Nuxt.js project using the create-nuxt-app.

```bash
npx create-nuxt-app my-project
```

Follow the prompts to set up your project. For this example, we are using Supabase for our backend, so you can skip choosing an Axios module or any backend framework.

## Installing Necessary Packages

To integrate Supabase with your Nuxt project, you need to install the Supabase JavaScript client.

```bash
npm install @nuxtjs/supabase @nuxt/ui @nuxt/devtools @nuxt/ui-pro @nuxtjs/algolia
```

## Integrating Supabase with Nuxt

### Connecting Nuxt to Supabase

Now, you will need to initialize Supabase in your Nuxt project. This can be done using Nuxt Modules.

- [Supabase Module](https://nuxt.com/modules/supabase)

### Example: Authentication in Nuxt with Supabase

Below is a basic example of how you might handle user authentication in your application.

`login.vue`

```vue
<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const state = reactive({
	email: ''
});

const loginError = ref(false);
const loginSuccess = ref(false);

async function onSubmit() {
	const { error } = await supabase.auth.signInWithOtp({
		email: state.email,
		options: {
			emailRedirectTo: 'http://localhost:3000/confirm'
		}
	});

	if (error) {
		loginError.value = true;
		loginSuccess.value = false;
	} else {
		loginSuccess.value = true;
		loginError.value = false;
	}
}

watch(
	user,
	() => {
		if (user.value) {
			return navigateTo('/');
		}
	},
	{ immediate: true }
);
</script>

<template>
	<UContainer :ui="{ constrained: 'max-w-xl' }">
		<UCard class="mt-10">
			<template #header>
				<div class="flex justify-between">
					<h1 class="font-bold text-xl">Log in</h1>
					<UColorModeButton />
				</div>
			</template>

			<section>
				<UForm
					v-if="!loginError && !loginSuccess"
					:state="state"
					class="space-y-4"
					@submit="onSubmit"
				>
					<UFormGroup label="Email" name="email" v-slot="{ error }">
						<UInput
							v-model="state.email"
							type="email"
							placeholder="Enter email"
							:icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : 'i-heroicons-envelope'"
						/>
					</UFormGroup>

					<UButton type="submit"> Submit </UButton>
				</UForm>
				<UAlert
					v-if="loginError"
					color="red"
					variant="subtle"
					icon="i-heroicons-exclamation-triangle-20-solid"
					title="There was an error"
					description="Please reload this page to try again."
				/>
				<UAlert
					v-if="loginSuccess"
					color="green"
					variant="subtle"
					icon="i-heroicons-check-badge"
					title="Check your email"
					description="A magic login link has been send to your email address."
				/>
			</section>
		</UCard>
	</UContainer>
</template>
```

## Integrating Algolia with Nuxt

### Connecting Nuxt to Aloglia

Now, you will need to initialize Algolia in your Nuxt project. This can be done using Nuxt Modules.

- [Algolia Module](https://nuxt.com/modules/algolia)

### Example: Adding Search

This is a simple but very powerful feature to quickly add search into your frontend application.

`algolia.vue`

```vue
<script setup lang="ts">
import {
	AisInstantSearch,
	AisSearchBox,
	AisHits,
	AisRefinementList,
	AisConfigure
} from 'vue-instantsearch/vue3/es';

import { history } from 'instantsearch.js/es/lib/routers';
import { simple } from 'instantsearch.js/es/lib/stateMappings';

const routing = {
	router: history(),
	stateMapping: simple()
};

// import { translateLabel } from "../lib/helpers";

const indexName = 'codingcatdev-cats';
const algolia = useAlgoliaRef();

const links = [
	{
		label: 'Cat overview',
		icon: 'i-heroicons-list-bullet',
		to: '/cats'
	}
];

const columns = [
	{
		key: 'name',
		label: 'Name'
	},
	{
		key: 'color',
		label: 'Color'
	},
	{
		key: 'vacinated',
		label: 'vacinated'
	}
];

const selectedColumns = ref([...columns]);

function transformItems(items: any) {
	return items.map((item: any) => ({
		...item,
		label: item.label
	}));
}

function mapToTableRows(items: any) {
	return items.map((item: any) => {
		return {
			id: item.id,
			name: item.name,
			color: item.color,
			vacinated: item.vacinated,
			class: 'bg-gray-50 dark:bg-gray-950'
		};
	});
}
</script>

<template>
	<ais-instant-search :index-name="indexName" :search-client="algolia" :routing="routing">
		<ais-configure :hitsPerPage="100" />
		<UPage :ui="{ wrapper: 'max-w-full', left: 'pl-8' }">
			<template #left>
				<UAside>
					<h3 class="font-bold mb-2">Color</h3>
					<ais-refinement-list attribute="color" operator="and" :transform-items="transformItems">
						<template v-slot:item="{ item, refine }">
							<UCheckbox
								color="primary"
								:checked="item.isRefined"
								:model-value="item.value"
								@change="refine(item.value)"
								:ui="{ wrapper: 'mb-1' }"
							>
								<template #label>
									<span class="space-x-2">
										<span>{{ item.label }}</span>
										<UBadge variant="subtle" size="xs" :ui="{ rounded: 'rounded-full' }">
											{{ item.count }}
										</UBadge>
									</span>
								</template>
							</UCheckbox>
						</template>
					</ais-refinement-list>

					<UDivider type="solid" class="my-6" />

					<h3 class="font-bold mb-2">Vacinated</h3>
					<ais-refinement-list attribute="vacinated">
						<template v-slot:item="{ item, refine }">
							<UCheckbox
								color="primary"
								:checked="item.isRefined"
								:model-value="item.value"
								@change="refine(item.value)"
								:ui="{ wrapper: 'mb-1' }"
							>
								<template #label>
									<span class="space-x-2">
										<span>{{ item.label }}</span>
										<UBadge variant="subtle" size="xs" :ui="{ rounded: 'rounded-full' }">
											{{ item.count }}
										</UBadge>
									</span>
								</template>
							</UCheckbox>
						</template>
					</ais-refinement-list>

					<template #top>
						<UPageLinks :links="links" />
					</template>
				</UAside>
			</template>
			<UPageBody>
				<ais-hits>
					<template v-slot="{ items }">
						<div class="flex justify-between pr-4 mb-8">
							<div class="flex gap-4">
								<ais-search-box>
									<template v-slot="{ currentRefinement, isSearchStalled, refine }">
										<UInput
											type="search"
											placeholder="Search Cat"
											icon="i-heroicons-magnifying-glass-20-solid"
											:loading="isSearchStalled"
											:modelValue="currentRefinement"
											color="primary"
											variant="outline"
											@input="refine($event.currentTarget.value)"
										/>
									</template>
								</ais-search-box>
							</div>
							<USelectMenu
								v-model="selectedColumns"
								:options="columns"
								multiple
								placeholder="Columns"
							/>
						</div>

						<UTable :columns="selectedColumns" :rows="mapToTableRows(items)" />
					</template>
				</ais-hits>
			</UPageBody>
		</UPage>
	</ais-instant-search>
</template>
```

## Add all features of a SaaS

Check the full video above to see how you can add Supabase and Algolia into a Nuxt framework and build an amazing application in a weekend. Dive in even further by building out your own custom functions with Supabase to push your database directly to Algolia.
