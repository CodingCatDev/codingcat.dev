import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { WordTimestamp } from "../types";

export interface KineticCaptionsProps {
	narration: string;
	wordTimestamps?: WordTimestamp[];
	durationInFrames: number;
	isVertical?: boolean;
	wordsPerGroup?: number;
}

/**
 * Cleo Abram ("Huge If True") / Better Stack style kinetic word-by-word captions.
 * Uses exact ElevenLabs/Gemini wordTimestamps when available, or computes proportional
 * character-weighted timing from narration text so vertical Shorts always have
 * high-retention synchronized captions.
 */
export const KineticCaptions: React.FC<KineticCaptionsProps> = ({
	narration,
	wordTimestamps,
	durationInFrames,
	isVertical = true,
	wordsPerGroup = 4,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentTimeMs = (frame / fps) * 1000;
	const totalDurationMs = (durationInFrames / fps) * 1000;

	const resolvedWords = useMemo<WordTimestamp[]>(() => {
		if (wordTimestamps && wordTimestamps.length > 0) {
			return wordTimestamps;
		}
		const rawWords = narration
			.trim()
			.split(/\s+/)
			.filter((w) => w.length > 0);
		if (rawWords.length === 0) return [];

		const totalChars = rawWords.reduce((sum, w) => sum + w.length + 1, 0);
		let cursorMs = 0;
		return rawWords.map((text) => {
			const weight = (text.length + 1) / totalChars;
			const wordDuration = weight * totalDurationMs;
			const entry: WordTimestamp = {
				text,
				startMs: Math.round(cursorMs),
				endMs: Math.round(cursorMs + wordDuration),
			};
			cursorMs += wordDuration;
			return entry;
		});
	}, [narration, wordTimestamps, totalDurationMs]);

	if (resolvedWords.length === 0) {
		return null;
	}

	// Find active word index based on currentTimeMs
	let activeWordIndex = resolvedWords.findIndex(
		(w) => currentTimeMs >= w.startMs && currentTimeMs <= w.endMs,
	);
	if (activeWordIndex === -1) {
		// If between words, pick the most recently started word
		for (let i = resolvedWords.length - 1; i >= 0; i--) {
			if (currentTimeMs >= resolvedWords[i].startMs) {
				activeWordIndex = i;
				break;
			}
		}
		if (activeWordIndex === -1) activeWordIndex = 0;
	}

	const groupIndex = Math.floor(activeWordIndex / wordsPerGroup);
	const groupStart = groupIndex * wordsPerGroup;
	const groupWords = resolvedWords.slice(
		groupStart,
		groupStart + wordsPerGroup,
	);

	return (
		<div
			style={{
				position: "absolute",
				left: isVertical ? 48 : 120,
				right: isVertical ? 48 : 120,
				bottom: isVertical ? 210 : 80,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				pointerEvents: "none",
				zIndex: 20,
			}}
		>
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					alignItems: "center",
					gap: isVertical ? 14 : 10,
					padding: isVertical ? "18px 28px" : "12px 22px",
					backgroundColor: "rgba(9, 9, 15, 0.82)",
					border: "2px solid rgba(124, 58, 237, 0.45)",
					borderRadius: 24,
					boxShadow: "0 16px 40px rgba(0, 0, 0, 0.65)",
				}}
			>
				{groupWords.map((wordObj, idx) => {
					const absoluteIdx = groupStart + idx;
					const isActive = absoluteIdx === activeWordIndex;
					const isNumericOrTech = /\d|%|\$|x|ms|GB|MB|AI|GPU|API|CLI/i.test(
						wordObj.text,
					);

					const wordStartFrame = Math.floor((wordObj.startMs / 1000) * fps);
					const popProgress = isActive
						? spring({
								frame: Math.max(0, frame - wordStartFrame),
								fps,
								config: { damping: 12, stiffness: 220, mass: 0.5 },
							})
						: 0;

					const scale = isActive ? 1 + 0.1 * popProgress : 1;
					const activeBg = isNumericOrTech ? "#f59e0b" : "#7c3aed";
					const activeColor = isNumericOrTech ? "#09090f" : "#ffffff";

					return (
						<span
							key={`${absoluteIdx}-${wordObj.text}`}
							style={{
								display: "inline-block",
								fontFamily: "Inter, system-ui, -apple-system, sans-serif",
								fontWeight: 900,
								fontSize: isVertical ? 44 : 32,
								lineHeight: 1.15,
								letterSpacing: -0.5,
								color: isActive ? activeColor : "rgba(255, 255, 255, 0.9)",
								backgroundColor: isActive ? activeBg : "transparent",
								padding: isActive ? "4px 14px" : "4px 6px",
								borderRadius: 12,
								transform: `scale(${scale})`,
								textShadow: isActive
									? "none"
									: "0 2px 10px rgba(0, 0, 0, 0.85)",
							}}
						>
							{wordObj.text}
						</span>
					);
				})}
			</div>
		</div>
	);
};
