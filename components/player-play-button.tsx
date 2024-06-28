"use client"
import { Button } from "@/components/ui/button"
import { useContext, useEffect } from "react";
import { FaCirclePause, FaPlay } from "react-icons/fa6";
import { PlayerContext } from "@/components/player-context";
import { PodcastQueryResult } from "@/sanity.types";

export default function PlayerPlayButton({ podcast }: { podcast: NonNullable<PodcastQueryResult> }) {
    const { setPodcast, audio, audioRef, setIsOpen, podcast: currentPodcast } = useContext(PlayerContext);

    const setCurrent = () => {
        setIsOpen(true);
        if (audioRef?.current && podcast?.spotify?.enclosures?.at(0)?.url === audio.src) {
            audioRef.current.play();
            return;
        }
        setPodcast(() => podcast)
    }

    if (!audioRef) return null;

    return (
        <>
            {currentPodcast?._id === podcast?._id && audio?.isPlaying ? (
                <Button variant="ghost" onClick={() => audioRef.current?.pause()} className="flex gap-2">
                    <FaCirclePause className="h-5 w-5" />
                    <div className="text-xl">Play Episode</div>
                </Button>
            ) :
                (
                    <Button variant="ghost" onClick={setCurrent} className="flex gap-2">
                        <FaPlay className="h-5 w-5" />
                        <div className="text-xl">Pause Episode</div>
                    </Button>
                )
            }
        </>
    )
}