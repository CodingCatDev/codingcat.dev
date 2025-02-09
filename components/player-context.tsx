"use client";
import type { PodcastQueryResult } from "@/sanity/types";
import {
	type Dispatch,
	type MutableRefObject,
	type SetStateAction,
	createContext,
	useEffect,
	useRef,
	useState,
} from "react";

export const PlayerContext = createContext<{
	podcast: PodcastQueryResult;
	setPodcast: Dispatch<SetStateAction<PodcastQueryResult>>;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	isMinimized: boolean;
	setIsMinimized: Dispatch<SetStateAction<boolean>>;
	audio: {
		id: number;
		src: string;
		title: string;
		artist: string;
		isPlaying: boolean;
		curTime: number;
		duration: number;
		playbackRate: number;
	};
	setAudio: Dispatch<
		SetStateAction<{
			id: number;
			src: string;
			title: string;
			artist: string;
			isPlaying: boolean;
			curTime: number;
			duration: number;
			playbackRate: number;
		}>
	>;
	audioRef: MutableRefObject<HTMLAudioElement | undefined> | undefined;
	volume: number;
	setVolume: Dispatch<SetStateAction<number>>;
}>({
	podcast: null,
	setPodcast: () => null,
	isOpen: false,
	setIsOpen: () => null,
	isMinimized: false,
	setIsMinimized: () => null,
	audio: {
		id: 1,
		src: "",
		title: "",
		artist: "",
		isPlaying: false,
		curTime: 0,
		duration: 100,
		playbackRate: 1.0,
	},
	setAudio: () => null,
	audioRef: undefined,
	volume: 100,
	setVolume: () => null,
});

export const PlayerProvider = ({ children }: { children: JSX.Element }) => {
	const [podcast, setPodcast] = useState<PodcastQueryResult>(null);
	const [isOpen, setIsOpen] = useState(true);
	const [isMinimized, setIsMinimized] = useState(false);
	//TODO: make this recent
	const [audio, setAudio] = useState({
		id: 1,
		src: "",
		title: "",
		artist: "",
		isPlaying: false,
		curTime: 0,
		duration: 100,
		playbackRate: 1.0,
	});
	const audioRef = useRef<HTMLAudioElement>();
	const [volume, setVolume] = useState(100);

	useEffect(() => {
		const src = podcast?.spotify?.enclosures?.at(0)?.url;
		if (!src) return;
		if (src === audio.src) return;
		setAudio((p) => {
			return { ...p, src };
		});
		setIsOpen(true);
	}, [podcast, audio.src]);

	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		if (audioRef?.current && podcast) {
			setIsOpen(true);
		}
	}, [podcast]);

	useEffect(() => {
		if (audioRef.current) audioRef.current.playbackRate = audio.playbackRate;
	}, [audio.playbackRate]);

	useEffect(() => {
		if (!audio?.src || audioRef.current?.src === audio.src) return;

		audioRef.current = new Audio(audio.src);

		// play and pause
		audioRef.current.addEventListener("play", () => {
			setAudio((p) => {
				return { ...p, isPlaying: true };
			});
		});
		audioRef.current.addEventListener("pause", () => {
			setAudio((p) => {
				return { ...p, isPlaying: false };
			});
		});

		//lets trigger when audio is ready
		audioRef.current.addEventListener("canplay", () => {
			audioRef.current?.play();
		});

		// time and duration
		audioRef.current.addEventListener("loadedmetadata", (e) => {
			setAudio((p) => {
				if (!audioRef?.current) return p;
				return {
					...p,
					curTime: audioRef.current.currentTime,
					duration: audioRef.current.duration,
				};
			});
		});
		audioRef.current.addEventListener("timeupdate", () => {
			setAudio((p) => {
				if (!audioRef?.current) return p;
				return {
					...p,
					curTime: audioRef.current.currentTime,
				};
			});
		});

		return () => {
			audioRef.current?.pause();
		};
	}, [audio.src]);

	return (
		<PlayerContext.Provider
			value={{
				podcast,
				setPodcast,
				isOpen,
				setIsOpen,
				isMinimized,
				setIsMinimized,
				audio,
				setAudio,
				audioRef,
				volume,
				setVolume,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};
