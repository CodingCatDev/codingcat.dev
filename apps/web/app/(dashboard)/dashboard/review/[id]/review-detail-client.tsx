"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X, Pencil, Loader2 } from "lucide-react";
import { approveVideo, rejectVideo, updateVideoField } from "../actions";

interface Scene {
  narration?: string;
  sceneTitle?: string;
  imagePrompt?: string;
}

interface VideoData {
  _id: string;
  title: string;
  qualityScore: number | null;
  qualityIssues: string[] | null;
  status: string;
  script?: {
    hook?: string;
    cta?: string;
    scenes?: Scene[];
  };
  infographicsHorizontal?: Array<{
    asset?: { url?: string };
    _key?: string;
  }>;
}

export function ReviewDetailClient({ video }: { video: VideoData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(video.title || "");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await approveVideo(video._id);
        toast.success("Video approved! It will proceed to publishing.");
        router.push("/dashboard/review");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to approve");
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    startTransition(async () => {
      try {
        await rejectVideo(video._id, rejectReason);
        toast.success("Video rejected.");
        router.push("/dashboard/review");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to reject");
      }
    });
  };

  const handleSaveTitle = () => {
    startTransition(async () => {
      try {
        await updateVideoField(video._id, "title", titleValue);
        setEditingTitle(false);
        toast.success("Title updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update title");
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div>
        {editingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              className="text-2xl font-bold"
              autoFocus
            />
            <Button
              size="icon"
              onClick={handleSaveTitle}
              disabled={isPending}
              className="min-h-[44px] min-w-[44px]"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setEditingTitle(false);
                setTitleValue(video.title || "");
              }}
              className="min-h-[44px] min-w-[44px]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {titleValue || "Untitled Video"}
            </h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditingTitle(true)}
              className="min-h-[44px] min-w-[44px]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Badge variant="secondary" className="mt-2">
          {video.status}
        </Badge>
      </div>

      {/* Quality Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold">
              {video.qualityScore ?? "—"}
            </div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
          {video.qualityIssues && video.qualityIssues.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Issues Found:</p>
              <ul className="space-y-1">
                {video.qualityIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-destructive">
                    <span className="mt-0.5">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Infographic Gallery */}
      {video.infographicsHorizontal && video.infographicsHorizontal.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Infographics ({video.infographicsHorizontal.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {video.infographicsHorizontal.map((img, i) => (
                <div
                  key={img._key || i}
                  className="relative aspect-video overflow-hidden rounded-md border"
                >
                  {img.asset?.url ? (
                    <img
                      src={img.asset.url}
                      alt={`Infographic ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Script Scenes */}
      {video.script?.scenes && video.script.scenes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Script ({video.script.scenes.length} scenes)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {video.script.hook && (
              <div className="rounded-md border p-3">
                <p className="text-xs font-medium uppercase text-muted-foreground">Hook</p>
                <p className="mt-1 text-sm">{video.script.hook}</p>
              </div>
            )}
            {video.script.scenes.map((scene, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Scene {i + 1}{scene.sceneTitle ? `: ${scene.sceneTitle}` : ""}
                </p>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {scene.narration || "No narration"}
                </p>
              </div>
            ))}
            {video.script.cta && (
              <div className="rounded-md border p-3">
                <p className="text-xs font-medium uppercase text-muted-foreground">CTA</p>
                <p className="mt-1 text-sm">{video.script.cta}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Approve / Reject Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Review Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showRejectForm ? (
            <div className="space-y-3">
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isPending || !rejectReason.trim()}
                  className="min-h-[44px] flex-1"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Confirm Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                  className="min-h-[44px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={handleApprove}
                disabled={isPending}
                className="min-h-[44px] flex-1"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Approve & Publish
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={() => setShowRejectForm(true)}
                disabled={isPending}
                className="min-h-[44px] flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
