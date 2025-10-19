import { BecomeSponsorPopup } from "@/components/become-sponsor-popup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MoreContent from "@/components/more-content";
import type { DocCountResult } from "@/sanity/types";
import { sanityFetch } from "@/sanity/lib/live";

import PaginateList from "@/components/paginate-list";
import { docCount } from "@/sanity/lib/queries";

const LIMIT = 10;

type Params = Promise<{ num: string }>;

export default async function Page({ params }: { params: Params }) {
	const [count] = (
		await Promise.all([
			sanityFetch({
				query: docCount,
				params: {
					type: "sponsor",
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
			<div className="flex flex-col items-center my-8">
				<h2 className="text-2xl font-bold">Want to see your name here?</h2>
				<p className="text-lg text-muted-foreground">Become a sponsor and support our content.</p>
				<Button asChild className="mt-4">
					<Link href="/sponsorships">Become a Sponsor</Link>
				</Button>
			</div>
			<MoreContent type="sponsor" limit={limit} offset={offset} showHeader />
			<PaginateList
				base="sponsors"
				num={Number(num)}
				limit={LIMIT}
				count={count}
			/>
			<BecomeSponsorPopup />
		</div>
	);
}
