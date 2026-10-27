/**
 * Canonical Types & Bone Pivot Metadata for AJ the Cat (`#aj-rig`).
 * Zero em-dashes used in comments or labels.
 */

export type AjAnimationState =
	| "canonical-rest"
	| "idle-wave"
	| "podcast-groove"
	| "point-diagram"
	| "celebrate"
	| "search-curious"
	| "404-confused"
	| "peek-corner"
	| "bored-nap"
	| "chase-yarn"
	| "ship-it-laptop"
	| "coffee-sip"
	| "mind-blown"
	| "cool-shades";

export type AjTurnaroundAngle = "three-quarter-right" | "three-quarter-left";

export type AjMascotVariant = "full-body" | "head";

export type AjMouthViseme = "smile-open" | "grin" | "surprised-o" | "talking";

export interface AjBonePivotSpec {
	id: string;
	boneSelector: string;
	label: string;
	x: number;
	y: number;
	color: string;
	description: string;
}

export const AJ_BONE_PIVOTS: AjBonePivotSpec[] = [
	{
		id: "aj-headphones",
		boneSelector: ".aj-bone-headphones",
		label: "#aj-headphones",
		x: 295,
		y: 200,
		color: "#C084FC",
		description: "2px secondary spring lag on headband arch and earcups",
	},
	{
		id: "aj-ears-left",
		boneSelector: ".aj-bone-ear-left",
		label: "#aj-ears-left",
		x: 165,
		y: 225,
		color: "#F472B6",
		description: "Left ear cone + pink inner ear independent twitch pivot",
	},
	{
		id: "aj-ears-right",
		boneSelector: ".aj-bone-ear-right",
		label: "#aj-ears-right",
		x: 415,
		y: 215,
		color: "#F472B6",
		description: "Right ear cone + pink inner ear independent twitch pivot",
	},
	{
		id: "aj-eyes-group",
		boneSelector: ".aj-bone-eyes",
		label: "#aj-eyes-group",
		x: 298,
		y: 362,
		color: "#38BDF8",
		description: "Clamped rAF cursor pupil tracking + randomized double-blink",
	},
	{
		id: "aj-mouth",
		boneSelector: ".aj-bone-mouth",
		label: "#aj-mouth",
		x: 388,
		y: 505,
		color: "#FCA5A5",
		description:
			"Switchable mouth visemes (smile-open, grin, surprised-o, talking)",
	},
	{
		id: "aj-head-group",
		boneSelector: ".aj-bone-head",
		label: "#aj-head-group",
		x: 295,
		y: 555,
		color: "#C5E86C",
		description:
			"Neck pivot for head tilt, 120 BPM nod, and scroll section glance",
	},
	{
		id: "aj-collar",
		boneSelector: ".aj-bone-hex-tag",
		label: "#aj-hex-tag",
		x: 340,
		y: 585,
		color: "#C084FC",
		description: "Overlapping pendulum swing on pastel-rainbow AJ collar tag",
	},
	{
		id: "aj-arm-right",
		boneSelector: ".aj-bone-arm-right",
		label: "#aj-arm-right",
		x: 200,
		y: 615,
		color: "#FACC15",
		description:
			"Foreground left-side shoulder pivot (resting hip follow-through & cheer)",
	},
	{
		id: "aj-arm-left",
		boneSelector: ".aj-bone-arm-left",
		label: "#aj-arm-left",
		x: 385,
		y: 615,
		color: "#C5E86C",
		description:
			"Articulated waving, pointing, coding, and celebrating right-side arm",
	},
	{
		id: "aj-tail",
		boneSelector: ".aj-bone-tail",
		label: "#aj-tail",
		x: 186,
		y: 650,
		color: "#FCA5A5",
		description:
			"Continuous sine-wave tail wag tucked along 3D shoulder/hip seam",
	},
	{
		id: "aj-torso",
		boneSelector: ".aj-bone-torso",
		label: "#aj-torso",
		x: 295,
		y: 725,
		color: "#86EFAC",
		description:
			"Smooth 3D pear-shaped torso + charcoal oval belly breathing loop",
	},
	{
		id: "aj-leg-left",
		boneSelector: ".aj-bone-leg-left",
		label: "#aj-leg-left",
		x: 242,
		y: 860,
		color: "#38BDF8",
		description: "Planted left hind leg squash-and-stretch pivot",
	},
	{
		id: "aj-leg-right",
		boneSelector: ".aj-bone-leg-right",
		label: "#aj-leg-right",
		x: 342,
		y: 855,
		color: "#38BDF8",
		description: "Planted right hind leg squash-and-stretch pivot",
	},
	{
		id: "aj-shadow",
		boneSelector: ".aj-bone-shadow",
		label: "#aj-shadow",
		x: 300,
		y: 1008,
		color: "#94A3B8",
		description: "Ground contact shadow scaling inversely with vertical bounce",
	},
];
