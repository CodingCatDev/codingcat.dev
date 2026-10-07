import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
	SponsorQueryResult,
	SponsorQueryWithRelatedResult,
} from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import {
	sponsorQuery,
	sponsorQueryWithRelated,
	sponsorSlugsQuery,
} from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import { BreadcrumbLinks } from "@/components/breadrumb-links";

import UserSocials from "@/components/user-socials";
import UserRelated from "@/components/user-related";
import { draftMode } from "next/headers";
import { Suspense } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
	const { data } = await sanityFetchStaticParams({ query: sponsorSlugsQuery });
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

	const sponsor = (
		await sanityFetchMetadata({
			query: sponsorQuery,
			params: { slug },
			perspective,
		})
	).data as SponsorQueryResult;
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(sponsor?.coverImage);

	return {
		title: sponsor?.title,
		description: sponsor?.excerpt,
		alternates: { canonical: `/sponsor/${slug}` },
		openGraph: {
			images: ogImage ? ogImage : previousImages,
		},
	} satisfies Metadata;
}

export default async function SponsorPage({ params }: { params: Params }) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicSponsorPage params={params} />
			</Suspense>
		);
	}
	const { slug } = await params;
	return (
		<CachedSponsorPage slug={slug} perspective="published" stega={false} />
	);
}

async function DynamicSponsorPage({ params }: { params: Params }) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return (
		<CachedSponsorPage slug={slug} perspective={perspective} stega={stega} />
	);
}

async function CachedSponsorPage({
	slug,
	perspective,
	stega,
}: { slug: string } & DynamicFetchOptions) {
	"use cache";
	const sponsor = (
		await sanityFetch({
			query: sponsorQueryWithRelated,
			params: { slug },
			perspective,
			stega,
		})
	).data as SponsorQueryWithRelatedResult;

	if (!sponsor?._id) {
		return notFound();
	}

	return (
		<div className="container px-5 mx-auto">
			<BreadcrumbLinks
				links={[{ title: "Sponsors", href: "/sponsors/page/1" }]}
			/>
			<div className="w-full flex flex-col gap-4 md:gap-8">
				<CoverMedia
					cloudinaryImage={sponsor?.coverImage}
					cloudinaryVideo={sponsor?.videoCloudinary}
					youtube={sponsor?.youtube}
				/>
				<div className="flex flex-col gap-2 md:gap-">
					<h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
						{sponsor.title}
					</h1>
					{sponsor?.socials && (
						<div className="flex flex-wrap gap-2">
							<UserSocials socials={sponsor.socials} />
						</div>
					)}
				</div>
				<article>
					{sponsor.content?.length && (
						<PortableText
							className="prose-violet lg:prose-xl dark:prose-invert"
							value={sponsor.content as PortableTextBlock[]}
						/>
					)}
				</article>
			</div>
			<UserRelated {...sponsor?.related} />
		</div>
	);
}
