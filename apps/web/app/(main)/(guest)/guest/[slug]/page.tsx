import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type {
	GuestQueryResult,
	GuestQueryWithRelatedResult,
} from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchMetadata,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";
import {
	guestQuery,
	guestQueryWithRelated,
	guestSlugsQuery,
} from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import CoverMedia from "@/components/cover-media";
import { BreadcrumbLinks } from "@/components/breadrumb-links";

import UserSocials from "@/components/user-socials";
import UserRelated from "@/components/user-related";
import Avatar from "@/components/avatar";
import { draftMode } from "next/headers";
import { Suspense } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
	const { data } = await sanityFetchStaticParams({ query: guestSlugsQuery });
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

	const guest = (
		await sanityFetchMetadata({
			query: guestQuery,
			params: { slug },
			perspective,
		})
	).data as GuestQueryResult;
	const previousImages = (await parent).openGraph?.images || [];
	const ogImage = resolveOpenGraphImage(guest?.coverImage);

	return {
		title: guest?.title,
		description: guest?.excerpt,
		openGraph: {
			images: ogImage ? ogImage : previousImages,
		},
	} satisfies Metadata;
}

export default async function GuestPage({ params }: { params: Params }) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicGuestPage params={params} />
			</Suspense>
		);
	}
	const { slug } = await params;
	return <CachedGuestPage slug={slug} perspective="published" stega={false} />;
}

async function DynamicGuestPage({ params }: { params: Params }) {
	const [{ slug }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return <CachedGuestPage slug={slug} perspective={perspective} stega={stega} />;
}

async function CachedGuestPage({
	slug,
	perspective,
	stega,
}: { slug: string } & DynamicFetchOptions) {
	"use cache";
	const guest = (
		await sanityFetch({
			query: guestQueryWithRelated,
			params: { slug },
			perspective,
			stega,
		})
	).data as GuestQueryWithRelatedResult;

	if (!guest?._id) {
		return notFound();
	}

	return (
		<div className="container px-5 mx-auto">
			<BreadcrumbLinks links={[{ title: "Guests", href: "/guests/page/1" }]} />
			<div className="w-full flex flex-col gap-4 md:gap-8">
				<div className="flex gap-2 md:gap-8">
					{guest?.coverImage && (
						<div>
							<Avatar
								coverImage={guest?.coverImage}
								imgSize="w-24 h-24 mr-4"
								height={96}
								width={96}
							/>
						</div>
					)}
					<div className="flex flex-col gap-2 md:gap-">
						<h1 className="text-xl font-bold leading-tight tracking-tighter text-balance md:text-2xl md:leading-none lg:text-4xl">
							{guest.title}
						</h1>
						{guest?.socials && (
							<div className="flex flex-wrap gap-2">
								<UserSocials socials={guest.socials} />
							</div>
						)}
					</div>
				</div>
				<article>
					{guest.content?.length && (
						<PortableText
							className="prose-violet lg:prose-xl dark:prose-invert"
							value={guest.content as PortableTextBlock[]}
						/>
					)}
				</article>
			</div>
			<UserRelated {...guest?.related} />
		</div>
	);
}
