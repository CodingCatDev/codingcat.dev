
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import type { PageQueryResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SponsorshipForm } from "./sponsorship-form";

const sponsorshipTiers = [
	{
		name: "Dedicated Video",
		price: "$4,000 USD",
		description:
			"A full video dedicated to your product or service. Includes a permanent logo and link on our sponsors page.",
		value: "dedicated-video",
	},
	{
		name: "Integrated Mid-Roll Ad (60 seconds)",
		price: "$1,800 USD",
		description:
			"A 60-second ad integrated into the middle of a video. Includes a permanent logo and link on our sponsors page.",
		value: "mid-roll-ad",
	},
	{
		name: "Quick Shout-Out (30 seconds)",
		price: "$900 USD",
		description:
			"A 30-second shout-out at the beginning of a video. Includes a permanent logo and link on our sponsors page.",
		value: "shout-out",
	},
	{
		name: "Blog Post / Newsletter Sponsorship",
		price: "$500 USD",
		description:
			"Sponsor a blog post or our weekly newsletter. Your logo and a link will be featured.",
		value: "blog-newsletter",
	},
	{
		name: "Video Series (Custom Pricing)",
		price: "Contact for pricing",
		description:
			"Sponsor a whole series of videos. Contact us for custom pricing and packages.",
		value: "video-series",
	},
];

type Props = {
	params: { slug: string };
};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const page = (await sanityFetch({
		query: pageQuery,
		params: { slug: "sponsorships" },
		tags: ["page:sponsorships"],
	})).data as PageQueryResult;

	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(page?.coverImage);

	return {
		title: page?.title,
		description: page?.excerpt,
		openGraph: {
			images: ogImage ? [ogImage] : previousImages,
		},
	};
}

export default async function SponsorshipsPage() {

	return (
		<div className="container px-5 mx-auto">
			<div className="w-full flex flex-col gap-4 md:gap-8 my-8 md:my-12">
				<div className="flex flex-col gap-2 md:gap-4">
					<h1 className="text-3xl font-bold leading-tight tracking-tighter text-balance md:text-4xl md:leading-none lg:text-5xl">
						Sponsor CodingCat.dev
					</h1>
					<p className="text-lg text-muted-foreground">
						Reach a large audience of developers, students, and tech
						enthusiasts.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{sponsorshipTiers.map((tier) => (
						<Card key={tier.value}>
							<CardHeader>
								<CardTitle>{tier.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">{tier.price}</p>
								<p className="mt-2 text-muted-foreground">
									{tier.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<SponsorshipForm sponsorshipTiers={sponsorshipTiers} />
			</div>
		</div>
	);
}
