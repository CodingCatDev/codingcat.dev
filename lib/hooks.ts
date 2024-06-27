import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/*
* General hooks
*
*/

export function useActivePath(): (path?: string) => boolean {
  const pathname = usePathname();

  const checkActivePath = (path?: string) => {
    return path === pathname;
  };

  return checkActivePath;
}

export function useKeyPress(callback: () => void, key: string): void {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === key) {
        callback();
      }
    });
  });
}

/*
* Player hooks
*
*/

export function usePlayer() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  //TODO: make this recent
  const [podcast, setPodcast] = useState({
    id: 1,
    src: "",
    title: "",
    artist: "",
    isPlaying: false,
    curTime: 0,
    duration: 100,
  });
  const audioRef = useRef<HTMLAudioElement>();
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    if (!podcast?.src || (audioRef.current?.src === podcast.src)) return;

    audioRef.current = new Audio(podcast.src);

    // volume changer
    audioRef.current.addEventListener("volumechange", (e: any) => {
      setVolume(+e.target.volume);
    });

    // play and pause
    audioRef.current.addEventListener("play", () => {
      setPodcast((p) => { return { ...p, isPlaying: true } });
    });
    audioRef.current.addEventListener("pause", () => {
      setPodcast((p) => { return { ...p, isPlaying: false } });
    });

    // time and duration
    audioRef.current.addEventListener("loadedmetadata", (e: any) => {
      setPodcast((p) => {
        if (!e.target) return p;
        return {
          ...p, curTime: e.target.currentTime,
          duration: e.target.duration,
        }
      });

    });
    audioRef.current.addEventListener("timeupdate", (e: any) => {
      setPodcast((p) => {
        if (!e.target) return p;
        return {
          ...p, curTime: e.target.currentTime,
        }
      });
    });

    return () => {
      audioRef.current?.pause();
    };
  }, [podcast.src]);


  return { isOpen, setIsOpen, isMinimized, setIsMinimized, podcast, setPodcast, audioRef, volume, setVolume };
}