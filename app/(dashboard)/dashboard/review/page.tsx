export const dynamic = "force-dynamic";

import Link from "next/link";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReviewVideo {
  _id: string;
  title: string;
  qualityScore: number | null;
  qualityIssues: string[] | null;
  status: string;
  _updatedAt: string;
  thumbnailUrl: string | null;
  scriptQualityScore: number | null;
}

function QualityBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return <Badge variant="outline">No score</Badge>;
  }
  if (score >= 80) return <Badge className="bg-green-600 hover:bg-green-700">{score}</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-600 hover:bg-yellow-700">{score}</Badge>;
  return <Badge variant="destructive">{score}</Badge>;
}

export default async function ReviewQueuePage() {
  const videos = await dashboardQuery<ReviewVideo[]>(
    `*[_type == "automatedVideo" && status == "pending_review"] | order(_updatedAt desc) {
      _id, title, qualityScore, qualityIssues, status, _updatedAt,
      "thumbnailUrl": thumbnailHorizontal.asset->url,
      scriptQualityScore
    }`
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
        <p className="text-muted-foreground">
          Videos awaiting your review before publishing.
        </p>
      </div>

      {videos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-muted-foreground">
              No videos pending review
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Videos will appear here when they pass quality checks.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Link
              key={video._id}
              href={`/dashboard/review/${video._id}`}
              className="block"
            >
              <Card className="h-full transition-colors hover:border-primary/50">
                {video.thumbnailUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title || "Video thumbnail"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2 text-base">
                    {video.title || "Untitled Video"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">Pending Review</Badge>
                  <QualityBadge score={video.qualityScore} />
                  {video.scriptQualityScore !== null && video.scriptQualityScore !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      Script: {video.scriptQualityScore}
                    </Badge>
                  )}
                  {video.qualityIssues && video.qualityIssues.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {video.qualityIssues.length} issue{video.qualityIssues.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(video._updatedAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
