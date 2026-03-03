export const dynamic = "force-dynamic";

import { SectionCardsLive } from "@/components/section-cards-live";
import { RecentActivity } from "@/components/recent-activity";

export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Content Ops Dashboard
				</h1>
				<p className="text-muted-foreground">
					Overview of your automated content engine \u2014 videos, sponsors,
					and pipeline health.
				</p>
			</div>

			<SectionCardsLive />

			<div className="grid gap-4 md:grid-cols-2">
				<RecentActivity />
				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Pipeline Status</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Real-time view of content moving through the pipeline.
					</p>
					{/* Pipeline status will be added here */}
				</div>
			</div>
		</div>
	);
}
