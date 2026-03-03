import { dashboardQuery } from "@/lib/sanity/dashboard";
import { ContentIdeasTable } from "./content-ideas-table";

interface ContentIdea {
	_id: string;
	_createdAt: string;
	title: string;
	status: "new" | "approved" | "rejected" | "published";
	source?: string;
	category?: string;
}

const CONTENT_IDEAS_QUERY = `*[_type == "contentIdea"] | order(_createdAt desc) {
	_id,
	_createdAt,
	title,
	status,
	source,
	category
}`;

export default async function ContentPage() {
	let ideas: ContentIdea[] = [];

	try {
		ideas = await dashboardQuery<ContentIdea[]>(CONTENT_IDEAS_QUERY);
	} catch (error) {
		console.error("Failed to fetch content ideas:", error);
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Content Ideas
				</h1>
				<p className="text-muted-foreground">
					Manage content ideas \u2014 approve, reject, or review incoming topics.
				</p>
			</div>

			<ContentIdeasTable ideas={ideas} />
		</div>
	);
}
