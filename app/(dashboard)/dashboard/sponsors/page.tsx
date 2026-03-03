export default function SponsorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Sponsor Pipeline
        </h1>
        <p className="text-muted-foreground">
          Manage sponsor leads, active deals, and revenue tracking.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Leads</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Incoming sponsorLead records — company, contact, status, and
            proposed deal terms. Kanban view of pipeline stages.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            🤝 Lead pipeline coming in Phase 1c
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Active Sponsors</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Current active sponsor deals with deliverable tracking, payment
            status, and content placement.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            ✅ Active deals view coming in Phase 1c
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Monthly and quarterly revenue charts, rate card performance, and
            sponsor ROI metrics.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            💰 Revenue dashboard coming in Phase 1c
          </div>
        </div>
      </div>
    </div>
  )
}
