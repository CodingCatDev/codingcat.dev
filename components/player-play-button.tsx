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
                <Button variant="ghost" size="icon" onClick={() => audioRef.current?.pause()}>
                    <FaCirclePause className="h-5 w-5" />
                </Button>
            ) :
                (
                    <Button variant="ghost" size="icon" onClick={setCurrent}>
                        <FaPlay className="h-5 w-5" />
                    </Button>
                )
            }
        </>
    )
}