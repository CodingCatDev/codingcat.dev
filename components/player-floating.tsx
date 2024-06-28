"use client"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useContext } from "react"
import { FaCirclePause, FaPlay, FaForward, FaBackward, FaVolumeHigh, FaShare, FaChevronDown, FaX, FaVolumeXmark, FaChevronUp } from "react-icons/fa6";
import { PlayerContext } from "@/components/player-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image';

export default function PlayerFloating() {
    const { audioRef, audio, volume, setVolume, isOpen, setIsOpen, podcast, setIsMinimized, isMinimized } = useContext(PlayerContext)

    const mute = () => {
        setVolume(0)
    }

    const max = () => {
        setVolume(100)
    }

    const close = () => {
        setIsOpen(false)
        if (audioRef?.current) {
            audioRef.current?.pause();
        }
    }

    return (
        <>
            {audioRef?.current && isOpen && (
                <div className="sticky inset-x-0 bottom-0 z-50 bg-background shadow-lg md:rounded-t-xl flex flex-col">
                    <div className="px-4 py-3 md:px-6 md:py-4">
                        <div className="flex items-center justify-between gap-2 md:gap-4">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={() => audioRef.current!.currentTime -= 30.0}>
                                    <FaBackward className="h-5 w-5" />
                                </Button>
                                {audio?.isPlaying ? (
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
                                    max={audio.duration}
                                    value={[audio.curTime]}
                                    onChange={(val) => {
                                        audioRef.current!.currentTime = +val;
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <Select
                                    onValueChange={(val) => {
                                        audio.playbackRate = Number(val)
                                    }}

                                >
                                    <SelectTrigger value={audio.playbackRate} className="w-20">
                                        <SelectValue placeholder="1x" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0.5">0.5x</SelectItem>
                                        <SelectItem value="1.0">1x</SelectItem>
                                        <SelectItem value="1.5">1.5x</SelectItem>
                                        <SelectItem value="2.0">2.0x</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-4">
                                {volume === 0 ?
                                    <Button variant="ghost" size="icon" onClick={max}>
                                        <FaVolumeXmark className="h-5 w-5" />
                                    </Button>
                                    :
                                    <Button variant="ghost" size="icon" onClick={mute}>
                                        <FaVolumeHigh className="h-5 w-5" />
                                    </Button>
                                }
                                <Slider
                                    className="w-20 [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                                    value={[volume]}
                                    min={0}
                                    max={100}
                                    onValueChange={(val) => {
                                        setVolume(+val)
                                    }}
                                />
                            </div>
                            <div className="ml-auto flex items-center gap-4">
                                {isMinimized ? (
                                    <Button variant="ghost" size="icon" onClick={() => setIsMinimized(false)}>
                                        <FaChevronUp className="h-5 w-5" />
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)}>
                                        <FaChevronDown className="h-5 w-5" />
                                    </Button>
                                )}
                                <Button variant="ghost" size="icon" onClick={close}>
                                    <FaX className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        {podcast && !isMinimized && (
                            <div className="hidden lg:flex">
                                <div className="w-48">
                                    {podcast?.spotify?.itunes?.image?.href && (
                                        <Image
                                            src={podcast.spotify.itunes.image.href}
                                            alt={podcast.title}
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-bold text-2xl line-clamp-1">
                                        {podcast.title}
                                    </div>
                                    <div className="text-lg line-clamp-2">
                                        {podcast.excerpt}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
