"use client"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/lib/hooks"
import { useEffect } from "react";
import { FaPlay } from "react-icons/fa6";

export default function PlayerPlayButton({ src }: { src: string }) {

    const { audioRef, podcast, setPodcast } = usePlayer();

    useEffect(() => {
        if (src) {
            setPodcast((pod) => {
                return {
                    ...pod,
                    src
                }
            })
        }
    }, [src]);

    useEffect(() => {
        if (src === audioRef.current?.src &&
            podcast?.duration === audioRef.current?.duration) {
            audioRef.current?.play();
        }
    }, [podcast]);


    return (
        <Button variant="ghost" size="icon" onClick={() => audioRef.current?.play()}>
            <FaPlay className="h-5 w-5" />
        </Button>
    )
}
