"use client";
import { Button } from "@/components/ui/button";
import { FaYoutube } from "react-icons/fa6";
import type { PodcastQueryResult } from "@/sanity/types";
import Link from "next/link";

export default function PodcastOpenYouTube({
	podcast,
}: {
	podcast: NonNullable<PodcastQueryResult>;
}) {
	return (
		<>
			{podcast?.youtube && (
				<Button variant="ghost" className="flex gap-2" asChild>
					<Link
						href={podcast.youtube}
						target="_blank"
						rel="noreferrer"
						aria-label="Listen on Spotify"
					>
						<FaYoutube className="h-5 w-5" />
					</Link>
				</Button>
			)}
		</>
	);
}
