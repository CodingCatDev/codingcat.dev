import MoreContent from "@/components/more-content";
import type { DocCountResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";

import PaginateList from "@/components/paginate-list";
import { docCount } from "@/sanity/lib/queries";

const LIMIT = 10;

type Props = {
	params: { num: string };
};

export default async function Page({ params }: Props) {
	const [count] = (
		await Promise.all([
			sanityFetch({
				query: docCount,
				params: {
					type: "guest",
				},
			}),
		])
	).map((res) => res.data) as [DocCountResult];

	const { num } = await params;
	const pageNumber = Number(num);
	const offset = (pageNumber - 1) * LIMIT;
	const limit = offset + LIMIT;

	return (
		<div className="container px-5 mx-auto mb-32">
			<MoreContent type="guest" limit={limit} offset={offset} showHeader />
			<PaginateList
				base="guests"
				num={Number(num)}
				limit={LIMIT}
				count={count}
			/>
		</div>
	);
}
