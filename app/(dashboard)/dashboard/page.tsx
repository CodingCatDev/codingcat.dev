export const dynamic = "force-dynamic";

import { SectionCards } from "@/components/section-cards"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Content Ops Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your automated content engine — videos, sponsors, and
          pipeline health.
        </p>
      </div>

      <SectionCards />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Activity feed will show recent content publications, sponsor
            updates, and pipeline events.
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadence calendar showing scheduled content drops and sponsor
            deliverables.
          </p>
        </div>
      </div>
    </div>
  )
}
