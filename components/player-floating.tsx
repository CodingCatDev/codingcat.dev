"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { usePlayer } from "@/lib/hooks"
import { useEffect } from "react"
import { FaCirclePause, FaPlay, FaForward, FaBackward, FaVolumeHigh, FaShare, FaChevronDown, FaX } from "react-icons/fa6";

export default function PlayerFloating() {
    const { audioRef, podcast, setPodcast } = usePlayer();

    useEffect(() => {
        if (!podcast?.src) {
            setPodcast((pod) => {
                return {
                    ...pod,
                    src: 'https://traffic.megaphone.fm/APO7656568543.mp3'
                }
            })
        }
    }, []);

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-background shadow-lg md:rounded-t-xl">
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => audioRef.current!.currentTime -= 30.0}>
                        <FaBackward className="h-5 w-5" />
                    </Button>
                    {podcast?.isPlaying ? (
                        <Button variant="ghost" size="icon" onClick={() => audioRef.current?.pause()}>
                            <FaCirclePause className="h-5 w-5" />
                        </Button>
                    ) :
                        (
                            <Button variant="ghost" size="icon" onClick={() => audioRef.current?.play()}>
                                <FaPlay className="h-5 w-5" />
                            </Button>
                        )}
                    <Button variant="ghost" size="icon" onClick={() => audioRef.current!.currentTime += 30.0}>
                        <FaForward className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex-1">
                    <Slider
                        className="[&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                        min={0}
                        max={podcast.duration}
                        value={[podcast.curTime]}
                        onChange={(val) => {
                            audioRef.current!.currentTime = +val;
                        }}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                1x
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>0.5x</DropdownMenuItem>
                            <DropdownMenuItem>1x</DropdownMenuItem>
                            <DropdownMenuItem>1.5x</DropdownMenuItem>
                            <DropdownMenuItem>2x</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Slider
                        className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                        defaultValue={[80]}
                    />
                    <Button variant="ghost" size="icon">
                        <FaVolumeHigh className="h-5 w-5" />
                    </Button>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <FaShare className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <FaChevronDown className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <FaX className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
