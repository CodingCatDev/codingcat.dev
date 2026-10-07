import { Suspense } from "react";
import { SectionCardsLive } from "@/components/section-cards-live";
import { RecentActivity } from "@/components/recent-activity";
import { PipelineStatus } from "@/components/pipeline-status";

export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Content Ops Dashboard
				</h1>
				<p className="text-muted-foreground">
					Overview of your automated content engine — videos, sponsors,
					and pipeline health.
				</p>
			</div>

			{/* These live components read the current time on the client, so they
			    must sit under a Suspense boundary to be treated as dynamic holes
			    under Cache Components (they can't be prerendered statically). */}
			<Suspense fallback={<div className="h-24 rounded-lg border" />}>
				<SectionCardsLive />
			</Suspense>

			<div className="grid gap-4 md:grid-cols-2">
				<Suspense fallback={<div className="h-48 rounded-lg border" />}>
					<RecentActivity />
				</Suspense>
				<div className="rounded-lg border p-6">
					<h2 className="text-lg font-semibold">Pipeline Status</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Real-time view of content moving through the pipeline.
					</p>
					<div className="mt-4">
						<Suspense fallback={<div className="h-24" />}>
							<PipelineStatus />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
