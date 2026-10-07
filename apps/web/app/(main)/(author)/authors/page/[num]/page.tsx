import MoreContent from "@/components/more-content";
import type { DocCountResult } from "@/sanity/types";
import {
	sanityFetch,
	sanityFetchStaticParams,
	getDynamicFetchOptions,
	type DynamicFetchOptions,
} from "@/sanity/lib/live";

import PaginateList from "@/components/paginate-list";
import { docCount } from "@/sanity/lib/queries";
import { draftMode } from "next/headers";
import { Suspense } from "react";

const LIMIT = 10;

type Params = Promise<{ num: string }>;

export async function generateStaticParams() {
	const { data: count } = await sanityFetchStaticParams({
		query: docCount,
		params: { type: "author" },
	});
	const pages = Math.max(1, Math.ceil(((count as number) ?? 0) / LIMIT));
	return Array.from({ length: pages }, (_, i) => ({ num: String(i + 1) }));
}

export default async function Page({ params }: { params: Params }) {
	const { isEnabled: isDraftMode } = await draftMode();
	if (isDraftMode) {
		return (
			<Suspense fallback={<div className="min-h-dvh" />}>
				<DynamicPage params={params} />
			</Suspense>
		);
	}
	const { num } = await params;
	return <CachedPage num={num} perspective="published" stega={false} />;
}

async function DynamicPage({ params }: { params: Params }) {
	const [{ num }, { perspective, stega }] = await Promise.all([
		params,
		getDynamicFetchOptions(),
	]);
	return <CachedPage num={num} perspective={perspective} stega={stega} />;
}

async function CachedPage({
	num,
	perspective,
	stega,
}: { num: string } & DynamicFetchOptions) {
	"use cache";
	const count = (
		await sanityFetch({
			query: docCount,
			params: { type: "author" },
			perspective,
			stega,
		})
	).data as DocCountResult;

	const pageNumber = Number(num);
	const offset = (pageNumber - 1) * LIMIT;
	const limit = offset + LIMIT;

	return (
		<div className="container px-5 mx-auto mb-32">
			<MoreContent
				type="author"
				limit={limit}
				offset={offset}
				showHeader
				perspective={perspective}
				stega={stega}
			/>
			<PaginateList
				base="authors"
				num={pageNumber}
				limit={LIMIT}
				count={count}
			/>
		</div>
	);
}
