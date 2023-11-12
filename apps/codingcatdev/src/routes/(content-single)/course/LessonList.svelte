<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { storeCurrentUrl } from '$lib/stores/stores';
	import type { LayoutData } from './$types';
	import ProCourseMark from './ProCourseMark.svelte';
	export let data: LayoutData;

	// Scroll heading into view
	function scrollLessonIntoView(): void {
		const slug = window.location.href?.split('/').at(-1);
		const child: HTMLElement | null = document.querySelector(`#nav-${slug}`);
		child?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	}

	afterNavigate(() => scrollLessonIntoView());

	$: classesActive = (href: string) =>
		$storeCurrentUrl?.split('/').at(-1) === href ? 'bg-primary-active-token !text-white' : '';
</script>

{#if data?.course?.lesson}
	<div class="relative h-full">
		<div class="top-0 left-0 flex flex-col w-full h-full shadow-sm lg:absolute">
			<div class="relative flex-grow">
				<div class="inset-0 lg:absolute">
					<div class="w-full h-full">
						<div class="flex flex-col h-full">
							<div class="flex-grow overflow-hidden">
								<div class="h-full overflow-hidden">
									<div class="overflow-auto h-72 lg:h-full">
										<div class="p-2 card md:p-4 rounded-none">
											<nav class="nav-list-nav">
												<ul>
													{#each data.course.lesson as l}
														{#if l?.section}
															<div class="pb-2">
																<span class="flex py-2 mt-4 text-xl font-bold">
																	{l.section}
																</span>
																<hr />
															</div>
														{/if}
														<li class="flex justify-between relative" id={`nav-${l.slug}`}>
															<a
																href={`/course/${data?.course?.slug}/lesson/${l.slug}`}
																class={`${classesActive(l.slug)} flex gap-1`}
															>
																{l.title}
															</a>
															<div class="flex gap-1 absolute right-1 top-1">
																<ProCourseMark locked={l?.locked} lesson={l} {data} />
															</div>
														</li>
													{/each}
												</ul>
											</nav>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
