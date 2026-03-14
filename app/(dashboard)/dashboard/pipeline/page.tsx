export const dynamic = "force-dynamic";

import { dashboardQuery } from "@/lib/sanity/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-500" },
  researching: { label: "Researching", color: "bg-blue-500" },
  research_complete: { label: "Research Complete", color: "bg-blue-600" },
  scripting: { label: "Scripting", color: "bg-indigo-500" },
  script_complete: { label: "Script Complete", color: "bg-indigo-600" },
  generating_images: { label: "Generating Images", color: "bg-purple-500" },
  images_complete: { label: "Images Complete", color: "bg-purple-600" },
  generating_audio: { label: "Generating Audio", color: "bg-pink-500" },
  video_gen: { label: "Video Generation", color: "bg-orange-500" },
  pending_review: { label: "Pending Review", color: "bg-yellow-500" },
  approved: { label: "Approved", color: "bg-green-500" },
  published: { label: "Published", color: "bg-green-700" },
  rejected: { label: "Rejected", color: "bg-red-500" },
  failed: { label: "Failed", color: "bg-red-700" },
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

const IN_PROGRESS_STATUSES = [
  "researching",
  "scripting",
  "generating_images",
  "generating_audio",
  "video_gen",
];

interface PipelineVideo {
  _id: string;
  title: string;
  status: string;
  _updatedAt: string;
}

export default async function PipelinePage() {
  // Fetch counts for all statuses in a single query
  const counts = await dashboardQuery<Record<string, number>>(
    `{
      ${ALL_STATUSES.map(
        (s) =>
          `"${s}": count(*[_type == "automatedVideo" && status == "${s}"])`
      ).join(",\n      ")}
    }`
  );

  // Fetch active workflows (in-progress videos)
  const activeVideos = await dashboardQuery<PipelineVideo[]>(
    `*[_type == "automatedVideo" && status in $statuses] | order(_updatedAt desc) [0..19] {
      _id, title, status, _updatedAt
    }`,
    { statuses: IN_PROGRESS_STATUSES }
  );

  // Fetch recent completions and failures
  const recentCompleted = await dashboardQuery<PipelineVideo[]>(
    `*[_type == "automatedVideo" && status in ["published", "approved", "rejected", "failed"]] | order(_updatedAt desc) [0..9] {
      _id, title, status, _updatedAt
    }`
  );

  const totalVideos = Object.values(counts || {}).reduce(
    (sum, count) => sum + (count || 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pipeline Status</h1>
        <p className="text-muted-foreground">
          Overview of {totalVideos} videos across all pipeline stages.
        </p>
      </div>

      {/* Status Count Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {ALL_STATUSES.map((status) => {
          const info = STATUS_LABELS[status];
          const count = counts?.[status] ?? 0;
          return (
            <Card key={status} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${info.color}`}
                  />
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {info.label}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Active Workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            {activeVideos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No videos currently in progress.
              </p>
            ) : (
              <div className="space-y-3">
                {activeVideos.map((video) => {
                  const info = STATUS_LABELS[video.status] || {
                    label: video.status,
                    color: "bg-gray-500",
                  };
                  return (
                    <div
                      key={video._id}
                      className="flex items-center gap-3 rounded-md border p-3"
                    >
                      <span
                        className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${info.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {video.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {info.label} •{" "}
                          {new Date(video._updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Completions / Failures */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Completions & Failures</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCompleted.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent completions or failures.
              </p>
            ) : (
              <div className="space-y-3">
                {recentCompleted.map((video) => {
                  const info = STATUS_LABELS[video.status] || {
                    label: video.status,
                    color: "bg-gray-500",
                  };
                  return (
                    <div
                      key={video._id}
                      className="flex items-center gap-3 rounded-md border p-3"
                    >
                      <Badge
                        variant={
                          video.status === "published" || video.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs shrink-0"
                      >
                        {info.label}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {video.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(video._updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
