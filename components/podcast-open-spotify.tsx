"use client"
import { Button } from "@/components/ui/button"
import { FaSpotify } from "react-icons/fa6";
import type { PodcastQueryResult } from "@/sanity/types";
import Link from "next/link";

export default function PodcastOpenSpotify({ podcast }: { podcast: NonNullable<PodcastQueryResult> }) {
    return (
        <>
            {podcast?._id && (
                <Button variant="ghost" className="flex gap-2" asChild>
                    <Link
                        href={`https://open.spotify.com/search/codingcat.dev%20${encodeURIComponent(podcast.title)}/episodes`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Listen on Spotify"
                    >
                        <FaSpotify className="h-5 w-5" />
                    </Link>
                </Button>
            )}
        </>
    )
}