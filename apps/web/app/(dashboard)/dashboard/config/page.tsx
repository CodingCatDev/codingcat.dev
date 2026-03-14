export const dynamic = "force-dynamic";

import { getEngineConfig } from "@/lib/config";
import { ConfigForm } from "./config-form";

export default async function ConfigPage() {
  let config = null;
  let error = null;

  try {
    config = await getEngineConfig();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load config";
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Engine Config</h1>
        <p className="text-muted-foreground">
          Configure the automated content engine. Changes propagate within 5 minutes.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
          <p className="text-sm text-destructive">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Make sure the engineConfig singleton exists in Sanity Studio.
          </p>
        </div>
      ) : config ? (
        <ConfigForm initialConfig={config} />
      ) : (
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Loading configuration...</p>
        </div>
      )}
    </div>
  );
}
