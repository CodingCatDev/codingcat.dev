import type { PodcastQueryResult } from "@/sanity/types";
import Link, { LinkProps } from "next/link";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import CoverImage from "@/components/cover-image";

export default function SponsorCard({
	sponsors,
}: {
	sponsors: NonNullable<PodcastQueryResult>["sponsor"];
}) {
	if (!sponsors?.length) return <></>;

	return (
		<div className="p-4 grid gap-6 md:p-6 lg:grid-flow-col lg:auto-cols-[1fr] justify-center">
			{sponsors?.map((sponsor) => {
				const { slug, _id, title, excerpt, coverImage, url } = sponsor;
				return (
					<Link
						href={url || `/sponsor/${slug}`}
						key={_id}
						target={url ? "_blank" : "_self"}
						className="flex"
					>
						<Card
							key={_id}
							className="grow max-w-xl overflow-hidden shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
						>
							<CardHeader className="p-0 pb-6">
								<CoverImage image={coverImage} priority={false} />
							</CardHeader>
							<CardContent className="grow">
								<h3 className="mb-3 text-3xl text-balance">{title}</h3>
							</CardContent>
							<CardFooter className="">
								{excerpt && (
									<p className="mb-4 text-lg leading-relaxed text-pretty">
										{excerpt}
									</p>
								)}
							</CardFooter>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}
