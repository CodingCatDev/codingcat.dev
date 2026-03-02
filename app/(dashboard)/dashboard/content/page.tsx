export default function ContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Content Management
        </h1>
        <p className="text-muted-foreground">
          Manage content ideas and automated video pipeline.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Content Ideas</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            List of contentIdea records from Sanity — topics, status, priority,
            and assigned categories. Will support filtering by status (draft,
            approved, published, flagged).
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            📋 Data table coming in Phase 1a
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Automated Videos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            List of automatedVideo records — YouTube publish status, view
            counts, and linked content ideas. Will show pipeline progress from
            idea → script → video → published.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            🎬 Video pipeline view coming in Phase 1a
          </div>
        </div>
      </div>
    </div>
  )
}
