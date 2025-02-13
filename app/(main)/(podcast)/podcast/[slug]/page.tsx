import type { Metadata, ResolvingMetadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DateComponent from "@/components/date";
import MoreContent from "@/components/more-content";
import PortableText from "@/components/portable-text";

import type { PodcastQueryResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { podcastQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import MoreHeader from "@/components/more-header";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import SponsorCard from "@/components/sponsor-card";
import Avatar from "@/components/avatar";
import Picks from "./picks";
import PlayerPlayButton from "@/components/player-play-button";
import PodcastOpenSpotify from "@/components/podcast-open-spotify";
import PodcastOpenApple from "@/components/podcast-open-apple";
import PodcastOpenYouTube from "@/components/podcast-open-youtube";
import CarbonAdBanner from "@/components/carbon-ad-banner";

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

	const src = podcast?.spotify?.enclosures?.at(0)?.url;

	return (
		<div className="container px-5 mx-auto">
			<BreadcrumbLinks
				links={[{ title: "Podcasts", href: "/podcasts/page/1" }]}
			/>
			<article>
				<h1 className="mb-12 text-4xl font-bold leading-tight tracking-tighter text-balance md:text-7xl md:leading-none lg:text-8xl">
					{podcast.title}
				</h1>

				<div className="mb-8 sm:mx-0 md:mb-16">
					<CoverMedia
						cloudinaryImage={podcast?.coverImage}
						cloudinaryVideo={podcast?.videoCloudinary}
						youtube={podcast?.youtube}
					/>
				</div>

				<div className="max-w-2xl sm:max-w-none">
					<div className="flex flex-wrap justify-between">
						<div className="flex-1">
							<div className="mb-6">
								{(podcast?.author || podcast?.guest) && (
									<div className="flex flex-wrap gap-2">
										{podcast?.author?.map((a) => (
											<Avatar
												key={a._id}
												name={a.title}
												href={`/author/${a?.slug}`}
												coverImage={a?.coverImage}
											/>
										))}
										{podcast?.guest?.map((a) => (
											<Avatar
												key={a._id}
												name={a.title}
												href={`/guest/${a?.slug}`}
												coverImage={a?.coverImage}
											/>
										))}
									</div>
								)}
							</div>
							<div className="mb-4 text-lg">
								<DateComponent dateString={podcast.date} />
							</div>
						</div>
						<CarbonAdBanner />
					</div>

					{src && (
						<div className="flex flex-col sm:flex-row justify-start flex-wrap w-full p-2 sm:p-4 border border-foreground gap-2 sm:gap-4 items-center">
							<h2 className="text-xl font-bold w-full text-center sm:text-start">
								Listening Options
							</h2>
							<PlayerPlayButton podcast={podcast} />
							<span className="text-xl">or</span>
							<div className="flex gap-1">
								<PodcastOpenSpotify podcast={podcast} />
								<PodcastOpenApple />
								<PodcastOpenYouTube podcast={podcast} />
							</div>
						</div>
					)}
				</div>
				{podcast?.sponsor?.length && (
					<section className="flex flex-col mt-10 mb-10">
						<h2 className="mb-4 text-2xl font-bold">Sponsors</h2>
						<hr className="border-accent-2" />
						<div className="my-12 ">
							<SponsorCard sponsors={podcast.sponsor} />
						</div>
						<hr className="border-accent-2" />
					</section>
				)}

				{podcast?.content?.length && (
					<PortableText
						className="mx-auto prose-violet lg:prose-xl dark:prose-invert"
						value={podcast.content as PortableTextBlock[]}
					/>
				)}
			</article>
			{podcast?.pick?.length && (
				<>
					<hr className="mb-8 sm:mb-24 border-accent-2 mt-8 sm:mt-28" />
					<div className="flex flex-col md:flex-row md:justify-between">
						<h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
							Picks
						</h2>
					</div>

					<section className="p-0 sm:p-12">
						<div className="grid gap-2 sm:gap-8">
							<Picks picks={podcast.pick} />
						</div>
					</section>
				</>
			)}
			<aside>
				<MoreHeader title="Recent Podcasts" href="/podcasts/page/1" />
				<Suspense>
					<MoreContent type={podcast._type} skip={podcast._id} limit={2} />
				</Suspense>
			</aside>
		</div>
	);
}
