"use client"
import { Button } from "@/components/ui/button"
import { PodcastQueryResult } from "@/sanity/types";
import Link from "next/link";
import { SiApplepodcasts } from "react-icons/si";

export default function PodcastOpenApple() {
    return (
        <Button variant="ghost" className="flex gap-2" asChild>
            <Link
                href={`https://podcasts.apple.com/us/podcast/codingcat-dev-podcast/id1491655542`}
                target="_blank"
                rel="noreferrer"
                aria-label="Listen on Spotify"
            >
                <SiApplepodcasts className="h-5 w-5" />
            </Link>
        </Button>
    )
}