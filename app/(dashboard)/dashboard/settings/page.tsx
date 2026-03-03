export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your content engine — cadence, categories, and rate card.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Publishing Cadence</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Set the publishing schedule — how many videos per week, preferred
            publish days, and time slots. Controls the automated pipeline
            pacing.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            📅 Cadence settings coming in Phase 1b
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage content categories and tags — used for content idea
            classification and YouTube metadata.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            🏷️ Category management coming in Phase 1b
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Sponsor Rate Card</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Define sponsorship tiers, pricing, and deliverables. Used by the
            sponsor portal and pipeline.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            💳 Rate card editor coming in Phase 1c
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            API keys and connections — YouTube API, Sanity webhooks, and
            notification channels.
          </p>
          <div className="mt-4 rounded-md bg-muted p-4 text-sm text-muted-foreground">
            🔌 Integration settings coming in Phase 2
          </div>
        </div>
      </div>
    </div>
  )
}
