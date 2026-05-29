import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { PodcastQueryResult } from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { podcastQuery, podcastSlugsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Podcast from "../Podcast";
import { draftMode } from "next/headers";
import { Suspense } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
	const { data } = await sanityFetchStaticParams({ query: podcastSlugsQuery });
	return data as { slug: string }[];
}

export async function generateMetadata(
	{ params }: { params: Params },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const [{ slug }, { perspective }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);

	const podcast = (
		await sanityFetchMetadata({
			query: podcastQuery,
			params: { slug },
			perspective,
		})
	).data as PodcastQueryResult;
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(podcast?.coverImage);

	return {
		authors:
			podcast?.author?.map((a) => {
				return { name: a.title };
			}) || [],
		title: podcast?.title,
		description: podcast?.excerpt,
		openGraph: {
			images: ogImage ? ogImage : previousImages,
		},
	} satisfies Metadata;
}

export default async function PodcastPage({ params }: { params: Params }) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicPodcastPage params={params} />
			</Suspense>
		);
	}
	const { slug } = await params;
	return <CachedPodcastPage slug={slug} perspective="published" stega={false} />;
}

async function DynamicPodcastPage({ params }: { params: Params }) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return (
		<CachedPodcastPage slug={slug} perspective={perspective} stega={stega} />
	);
}

async function CachedPodcastPage({
	slug,
	perspective,
	stega,
}: { slug: string } & DynamicFetchOptions) {
	"use cache";
	const podcast = (
		await sanityFetch({
			query: podcastQuery,
			params: { slug },
			perspective,
			stega,
		})
	).data as PodcastQueryResult;

	if (!podcast?._id) {
		return notFound();
	}

	return <Podcast podcast={podcast} perspective={perspective} stega={stega} />;
}
