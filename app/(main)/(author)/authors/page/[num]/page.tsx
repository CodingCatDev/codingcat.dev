import MoreContent from "@/components/more-content";
import type { DocCountResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";

import PaginateList from "@/components/paginate-list";
import { docCount } from "@/sanity/lib/queries";
import { groq } from "next-sanity";

const LIMIT = 10;

type Params = Promise<{ num: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
	const count = await client.fetch<number>(
		groq`count(*[_type == "author" && defined(slug.current)])`,
	);
	const perPage = LIMIT;
	const pages = Math.ceil(count / perPage);
	return Array.from({ length: pages }, (_, i) => ({ num: String(i + 1) }));
}

export default async function Page({ params }: { params: Params }) {
	const { num } = await params;

	const count = (
		await sanityFetch({
			query: docCount,
			params: {
				type: "author",
			},
		})
	).data as DocCountResult;

	const pageNumber = Number(num);
	const offset = (pageNumber - 1) * LIMIT;
	const limit = offset + LIMIT;

	return (
		<div className="container px-5 mx-auto mb-32">
			<MoreContent type="author" limit={limit} offset={offset} showHeader />
			<PaginateList
				base="authors"
				num={Number(num)}
				limit={LIMIT}
				count={count}
			/>
		</div>
	);
}
