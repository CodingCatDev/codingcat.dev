import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { PodcastQueryResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { podcastQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import Podcast from "../Podcast";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
	{ params }: { params: Params },
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { slug } = await params;

	const podcast = (
		await sanityFetch({
			query: podcastQuery,
			params: { slug },
			stega: false,
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
	const { slug } = await params;

	const [podcast] = (
		await Promise.all([
			sanityFetch({
				query: podcastQuery,
				params: { slug },
			}),
		])
	).map((res) => res.data) as [PodcastQueryResult];

	if (!podcast?._id) {
		return notFound();
	}

	return <Podcast podcast={podcast} />;
}
