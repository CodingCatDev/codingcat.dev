export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { dashboardQuery } from "@/lib/sanity/dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ReviewDetailClient } from "./review-detail-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;

  const video = await dashboardQuery(
    `*[_type == "automatedVideo" && _id == $id][0] {
      _id,
      title,
      qualityScore,
      qualityIssues,
      status,
      _updatedAt,
      script,
      "infographicsHorizontal": infographicsHorizontal[] {
        _key,
        "asset": asset-> { url }
      }
    }`,
    { id }
  );

  if (!video) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/review">
          <Button variant="ghost" size="sm" className="min-h-[44px] gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Review Queue
          </Button>
        </Link>
      </div>
      <ReviewDetailClient video={video as any} />
    </div>
  );
}
