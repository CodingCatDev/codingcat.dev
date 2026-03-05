import MoreContent from "@/components/more-content";
import type { DocCountResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";

import PaginateList from "@/components/paginate-list";
import { docCount } from "@/sanity/lib/queries";
import { groq } from "next-sanity";

const LIMIT = 10;

type Params = Promise<{ num: string }>;

export const revalidate = 60;

export async function generateStaticParams() {
	const { data } = await sanityFetch({
		query: groq`count(*[_type == "course" && defined(slug.current)])`,
		tags: ["course-list"],
		stega: false,
	});
	const count = data as number;
	const perPage = LIMIT;
	const pages = Math.ceil(count / perPage);
	return Array.from({ length: pages }, (_, i) => ({ num: String(i + 1) }));
}

export default async function Page({ params }: { params: Params }) {
	const [count] = (
		await Promise.all([
			sanityFetch({
				query: docCount,
				params: {
					type: "course",
				},
				tags: ["course-list", "course"],
			}),
		])
	).map((res) => res.data) as [DocCountResult];

	const { num } = await params;
	const pageNumber = Number(num);
	const offset = (pageNumber - 1) * LIMIT;
	const limit = offset + LIMIT;

	return (
		<div className="container px-5 mx-auto mb-32">
			<MoreContent type="course" limit={limit} offset={offset} showHeader />
			<PaginateList
				base="podcasts"
				num={Number(num)}
				limit={LIMIT}
				count={count}
			/>
		</div>
	);
}
