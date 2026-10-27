/**
 * SVG path helpers for AJ's articulated lower body, tail, and 4-digit plush capsule paws.
 */

import type { AjAnimationState } from "./ajRigTypes";
import { AJ_TRACED_PATHS as P } from "./ajTracedPaths";

export function renderTailSvg(
	state: AjAnimationState,
	isUnderlay: boolean,
): string {
	if (state === "celebrate") {
		const tailCenterline = "M 202,785 C 138,792 94,758 72,702";
		return isUnderlay
			? `<path d="${tailCenterline}" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="58" stroke-linecap="round" stroke-linejoin="round" fill="none" /><path d="${tailCenterline}" stroke="#F8FAFC" stroke-width="55.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`
			: `<path d="${tailCenterline}" stroke="#050507" stroke-width="38" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
	}
	return isUnderlay
		? `<path d="${P.bone_tail_black}" fill="#F8FAFC" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="20" fill-rule="evenodd" /><path d="${P.bone_tail_black}" fill="#F8FAFC" stroke="#F8FAFC" stroke-width="17.5" fill-rule="evenodd" />`
		: `<path d="${P.bone_tail_black}" fill="#050507" fill-rule="evenodd" />`;
}

function renderCapsuleHand(opts: {
	isUnderlay: boolean;
	armPath: string;
	palmCx: number;
	palmCy: number;
	palmR?: number;
	fingers: Array<{ d: string; w: number }>;
	creases?: string;
}): string {
	const {
		isUnderlay,
		armPath,
		palmCx,
		palmCy,
		palmR = 26,
		fingers,
		creases = "",
	} = opts;
	if (isUnderlay) {
		return [
			`<path d="${armPath}" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="64" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
			`<circle cx="${palmCx}" cy="${palmCy}" r="${palmR + 9.5}" fill="#94A3B8" fill-opacity="0.5" />`,
			...fingers.map(
				(f) =>
					`<path d="${f.d}" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="${f.w + 18}" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
			),
			`<path d="${armPath}" stroke="#F8FAFC" stroke-width="61.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
			`<circle cx="${palmCx}" cy="${palmCy}" r="${palmR + 8.25}" fill="#F8FAFC" />`,
			...fingers.map(
				(f) =>
					`<path d="${f.d}" stroke="#F8FAFC" stroke-width="${f.w + 15.5}" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
			),
		].join("\n");
	}
	return [
		`<path d="${armPath}" stroke="#050507" stroke-width="45" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
		`<circle cx="${palmCx}" cy="${palmCy}" r="${palmR}" fill="#050507" />`,
		...fingers.map(
			(f) =>
				`<path d="${f.d}" stroke="#050507" stroke-width="${f.w}" stroke-linecap="round" stroke-linejoin="round" fill="none" />`,
		),
		creases,
	].join("\n");
}

export function renderArmLeftSvg(
	state: AjAnimationState,
	isUnderlay: boolean,
): string {
	if (state === "mind-blown" || state === "cool-shades") {
		return "";
	}
	const stickerStroke = isUnderlay
		? 'fill="#F8FAFC" stroke="#F8FAFC" stroke-width="17.5" stroke-linejoin="round" stroke-linecap="round"'
		: 'fill="#050507"';
	const borderStroke = isUnderlay
		? 'fill="#F8FAFC" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"'
		: "";

	if (state === "canonical-rest" || state === "podcast-groove") {
		return isUnderlay
			? `<path d="${P.bone_arm_left_black}" ${borderStroke} fill-rule="evenodd" /><path d="${P.bone_arm_left_black}" ${stickerStroke} fill-rule="evenodd" />`
			: `<path d="${P.bone_arm_left_black}" fill="#050507" fill-rule="evenodd" /><path d="${P.bone_arm_left_creases}" fill="#2C2C2E" fill-rule="evenodd" />`;
	}

	if (state === "point-diagram" || state === "ship-it-laptop") {
		return renderCapsuleHand({
			isUnderlay,
			armPath: "M 374,626 Q 422,662 474,616",
			palmCx: 482,
			palmCy: 612,
			palmR: 25,
			fingers: [
				{ d: "M 474,598 L 480,566", w: 20 },
				{ d: "M 488,598 L 538,588", w: 21 },
				{ d: "M 488,614 L 506,614", w: 20 },
				{ d: "M 482,628 L 498,628", w: 19 },
			],
			creases: [
				'<path d="M 480,606 C 504,605 506,620 482,620 C 472,620 472,607 480,606 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
				'<path d="M 476,620 C 498,620 500,635 478,635 C 468,635 468,621 476,620 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
				'<path d="M 464,598 Q 478,604 470,624" stroke="#F8FAFC" stroke-width="3.2" stroke-linecap="round" fill="none" />',
			].join("\n"),
		});
	}

	if (
		state === "idle-wave" ||
		state === "celebrate" ||
		state === "chase-yarn"
	) {
		return renderCapsuleHand({
			isUnderlay,
			armPath: "M 374,626 Q 424,650 478,588",
			palmCx: 484,
			palmCy: 582,
			palmR: 26,
			fingers: [
				{ d: "M 466,572 L 458,542", w: 20 },
				{ d: "M 480,564 L 490,524", w: 21 },
				{ d: "M 494,570 L 518,536", w: 21 },
				{ d: "M 502,584 L 528,562", w: 20 },
			],
			creases: [
				'<path d="M 470,578 Q 490,570 502,590" stroke="#F8FAFC" stroke-width="3.2" stroke-linecap="round" fill="none" />',
				'<path d="M 473,556 L 472,570 M 491,558 L 486,571 M 504,568 L 495,578" stroke="#F8FAFC" stroke-width="3.0" stroke-linecap="round" />',
			].join("\n"),
		});
	}

	if (state === "search-curious" || state === "coffee-sip") {
		return renderCapsuleHand({
			isUnderlay,
			armPath: "M 374,626 Q 422,652 468,592",
			palmCx: 472,
			palmCy: 586,
			palmR: 24,
			fingers: [
				{ d: "M 464,574 L 468,552", w: 19 },
				{ d: "M 476,576 L 492,574", w: 19 },
				{ d: "M 474,592 L 488,592", w: 19 },
			],
			creases: [
				'<path d="M 468,568 C 490,568 492,583 470,583 C 460,583 460,570 468,568 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
				'<path d="M 466,584 C 488,584 490,599 468,599 C 458,599 458,586 466,584 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
			].join("\n"),
		});
	}

	// 404-confused: vertical index finger pointing straight up + 2 curled fingers & thumb
	return renderCapsuleHand({
		isUnderlay,
		armPath: "M 374,628 Q 426,658 476,600",
		palmCx: 482,
		palmCy: 594,
		palmR: 25,
		fingers: [
			{ d: "M 466,588 L 462,568", w: 19 },
			{ d: "M 486,582 L 490,530", w: 21 },
			{ d: "M 488,590 L 502,590", w: 19 },
			{ d: "M 486,604 L 498,604", w: 19 },
		],
		creases: [
			'<path d="M 472,592 C 472,576 485,576 485,592 C 485,604 472,604 472,592 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
			'<path d="M 485,590 C 485,574 498,574 498,590 C 498,602 485,602 485,590 Z" stroke="#F8FAFC" stroke-width="3.2" fill="#050507" />',
			'<path d="M 480,602 C 502,598 504,614 480,615" stroke="#F8FAFC" stroke-width="3.2" stroke-linecap="round" fill="#050507" />',
		].join("\n"),
	});
}

export function renderArmRightSvg(
	state: AjAnimationState,
	isUnderlay: boolean,
): string {
	if (state === "mind-blown" || state === "cool-shades") {
		return "";
	}
	const stickerStroke = isUnderlay
		? 'fill="#F8FAFC" stroke="#F8FAFC" stroke-width="17.5" stroke-linejoin="round" stroke-linecap="round"'
		: 'fill="#050507"';
	const borderStroke = isUnderlay
		? 'fill="#F8FAFC" stroke="#94A3B8" stroke-opacity="0.5" stroke-width="20" stroke-linejoin="round" stroke-linecap="round"'
		: "";

	if (state === "celebrate") {
		return renderCapsuleHand({
			isUnderlay,
			armPath: "M 206,624 Q 156,648 102,586",
			palmCx: 96,
			palmCy: 580,
			palmR: 26,
			fingers: [
				{ d: "M 114,570 L 122,540", w: 20 },
				{ d: "M 100,562 L 90,522", w: 21 },
				{ d: "M 86,568 L 62,534", w: 21 },
				{ d: "M 78,582 L 52,560", w: 20 },
			],
			creases: [
				'<path d="M 110,576 Q 90,568 78,588" stroke="#F8FAFC" stroke-width="3.2" stroke-linecap="round" fill="none" />',
				'<path d="M 107,554 L 108,568 M 89,556 L 94,569 M 76,566 L 85,576" stroke="#F8FAFC" stroke-width="3.0" stroke-linecap="round" />',
			].join("\n"),
		});
	}

	return isUnderlay
		? `<path d="${P.bone_arm_right_black}" ${borderStroke} fill-rule="evenodd" /><path d="${P.bone_arm_right_black}" ${stickerStroke} fill-rule="evenodd" />`
		: `<path d="${P.bone_arm_right_black}" fill="#050507" fill-rule="evenodd" /><path d="${P.bone_arm_right_creases}" fill="#2C2C2E" fill-rule="evenodd" />`;
}
