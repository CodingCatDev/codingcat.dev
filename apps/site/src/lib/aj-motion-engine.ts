/**
 * Deterministic Motion Physics, Seeded Noise, Closed-Form Springs & Audio Beat Sync
 * File: `apps/site/src/lib/aj-motion-engine.ts`
 *
 * Implements the code-rendered motion architecture from the 2026 Opus 5.5 Motion Design
 * specification (`@0xnicc0` / `@seeconvm`):
 *
 * 1. `closedFormSpring(dt, omega, zeta)`: Pure function of elapsed time `dt` with zero
 *    state accumulation so frame 812 renders identically without simulating frames 0..811.
 * 2. `evaluateSpringTrack(t, initialValue, impulses, omega, zeta)`: Stacks impulses
 *    (`track(t) = v0 + Σ (v_i - v_(i-1)) * spring(t - t_i)`) for multi-target changes.
 * 3. `seededNoise1D(seed, x)`: Deterministic hash noise (never `Math.random()`).
 * 4. `computeAjPoseAtTime(t, state, options)`: Evaluates exact bone angles, jaw viseme scale,
 *    pupil offsets, and blink state at timestamp `t` (in seconds) for both 2D SVG and 3D Three.js rigs.
 */

import type { AjAnimationState } from "@/components/aj-rig/ajRigTypes";

export interface SpringImpulse {
	time: number;
	target: number;
}

export interface BeatTimeline {
	bpm: number;
	beats: number[];
	downbeats: number[];
	hits: number[];
}

export interface AjDeterminsticFramePose {
	time: number;
	bodyTranslateY: number;
	bodyScaleX: number;
	bodyScaleY: number;
	headRotateDeg: number;
	headNodY: number;
	earLeftRotateDeg: number;
	earRightRotateDeg: number;
	armRightRotateDeg: number;
	armLeftRotateDeg: number;
	tailRotateDeg: number;
	jawOpenScaleY: number;
	isBlinking: boolean;
	beatPulse: number;
}

/**
 * Deterministic 32-bit hash & 1D value noise (`seededNoise1D`).
 * Never calls `Math.random()`, ensuring `render(frame 300)` produces identical hashes.
 */
export function hashUint32(n: number): number {
	let x = (n | 0) + 0x9e3779b9;
	x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
	x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
	return (x ^ (x >>> 16)) >>> 0;
}

export function seededUnitFloat(seed: number, step: number): number {
	return hashUint32(seed * 747796405 + step * 2891336453) / 4294967295;
}

export function seededNoise1D(seed: number, t: number): number {
	const i = Math.floor(t);
	const f = t - i;
	const u = f * f * (3 - 2 * f);
	const a = seededUnitFloat(seed, i) * 2 - 1;
	const b = seededUnitFloat(seed, i + 1) * 2 - 1;
	return a + (b - a) * u;
}

/**
 * Closed-form underdamped / critically-damped harmonic oscillator unit step response `spring(dt)`.
 * Returns 0 for `dt <= 0` and converges to `1.0` with physical mass & overshoot as `dt -> ∞`.
 *
 * @param dt Elapsed time in seconds since impulse (`t - t_i`)
 * @param omega Natural angular frequency `ω_0` (stiffness feel, default `18` rad/s for snappy mascot)
 * @param zeta Damping ratio `ζ` (`0.55` = playful mascot bounce, `0.85` = UI panel settle)
 */
export function closedFormSpring(
	dt: number,
	omega = 18.0,
	zeta = 0.58,
): number {
	if (dt <= 0) {
		return 0;
	}
	if (dt > 6) {
		return 1;
	}

	if (zeta < 1) {
		const omegaD = omega * Math.sqrt(1 - zeta * zeta);
		const env = Math.exp(-zeta * omega * dt);
		const cosTerm = Math.cos(omegaD * dt);
		const sinTerm = (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * dt);
		return 1 - env * (cosTerm + sinTerm);
	}
	// Critically damped fallback
	const env = Math.exp(-omega * dt);
	return 1 - env * (1 + omega * dt);
}

/**
 * Evaluates `track(t) = v0 + Σ (v_i - v_(i-1)) * spring(t - t_i)`
 * across an arbitrary list of target changes without state accumulation.
 */
export function evaluateSpringTrack(
	t: number,
	initialValue: number,
	impulses: SpringImpulse[],
	omega = 18.0,
	zeta = 0.58,
): number {
	let value = initialValue;
	let prevTarget = initialValue;
	for (let i = 0; i < impulses.length; i++) {
		const imp = impulses[i];
		const delta = imp.target - prevTarget;
		if (t >= imp.time) {
			value += delta * closedFormSpring(t - imp.time, omega, zeta);
		}
		prevTarget = imp.target;
	}
	return value;
}

/**
 * Evaluates deterministic blink state at timestamp `t` using seeded intervals.
 */
export function isDeterministicBlinkAt(t: number, seed = 42): boolean {
	if (t < 0) {
		return false;
	}
	const cycleIndex = Math.floor(t / 4.2);
	const cycleStart = cycleIndex * 4.2;
	const jitter = seededUnitFloat(seed, cycleIndex) * 1.4;
	const blinkStart = cycleStart + 1.8 + jitter;
	const dt = t - blinkStart;
	// Primary blink (115ms)
	if (dt >= 0 && dt <= 0.115) {
		return true;
	}
	// 55% chance of natural double-blink 125ms later
	if (
		seededUnitFloat(seed + 99, cycleIndex) > 0.45 &&
		dt >= 0.24 &&
		dt <= 0.35
	) {
		return true;
	}
	return false;
}

/**
 * Computes the complete deterministic pose for AJ (2D & 3D) at second `t`.
 */
export function computeAjPoseAtTime(
	t: number,
	state: AjAnimationState = "idle-wave",
	options: {
		bpm?: number;
		audioAmplitude?: number;
		celebrateImpulses?: number[];
		seed?: number;
	} = {},
): AjDeterminsticFramePose {
	const bpm = options.bpm ?? 120;
	const seed = options.seed ?? 1337;
	const beatPeriod = 60 / bpm;
	const beatPhase = (t % beatPeriod) / beatPeriod;
	const beatPulse = Math.exp(-beatPhase * 5.5);

	// Optional celebrate jump impulses driven by closed-form springs
	let jumpY = 0;
	let squashX = 1;
	let stretchY = 1;
	if (options.celebrateImpulses?.length) {
		for (const t0 of options.celebrateImpulses) {
			const dt = t - t0;
			if (dt >= 0 && dt <= 0.8) {
				const s = closedFormSpring(dt, 22, 0.45);
				const arc = Math.sin(Math.min(dt / 0.55, 1) * Math.PI);
				jumpY -= 26 * arc * s;
				squashX += 0.05 * Math.cos(dt * 18) * Math.exp(-dt * 4);
				stretchY -= 0.05 * Math.cos(dt * 18) * Math.exp(-dt * 4);
			}
		}
	}

	const breath = Math.sin(t * 2.4) * 3.2;
	const subtleNoise = seededNoise1D(seed, t * 1.2) * 1.8;

	let headRotateDeg = Math.sin(t * 1.9) * 3.5 + subtleNoise;
	let headNodY = breath * 0.4;
	let armRightRotateDeg = Math.sin(t * 4.8) * 14;
	let armLeftRotateDeg = Math.cos(t * 2.1) * 4;
	let tailRotateDeg = Math.sin(t * 3.4) * 12;
	let earLeftRotateDeg = Math.sin(t * 2.8) * 3;
	let earRightRotateDeg = -Math.sin(t * 2.8) * 3;
	let jawOpenScaleY = 0.52;

	if (state === "podcast-groove") {
		const grooveNod = Math.sin((t / beatPeriod) * Math.PI * 2);
		headNodY = grooveNod * 6.5;
		headRotateDeg = Math.cos((t / beatPeriod) * Math.PI) * 5.5;
		earLeftRotateDeg = beatPulse * -8;
		earRightRotateDeg = beatPulse * 8;
		tailRotateDeg = Math.sin((t / beatPeriod) * Math.PI * 2) * 16;
	} else if (state === "celebrate") {
		const bounce = Math.abs(Math.sin(t * 5.2));
		jumpY -= bounce * 20;
		armRightRotateDeg = -25 + Math.sin(t * 9) * 18;
		armLeftRotateDeg = 25 - Math.sin(t * 9) * 18;
		jawOpenScaleY = 1.05;
	} else if (state === "point-diagram") {
		armRightRotateDeg = -32 + Math.sin(t * 3.0) * 4;
		headRotateDeg = -4 + Math.sin(t * 1.5) * 2;
	} else if (state === "mind-blown") {
		headNodY = -6 + Math.sin(t * 12) * 2;
		jawOpenScaleY = 1.22;
	}

	// Audio-reactive lip-sync override when podcast audio or voiceover is active
	if (
		typeof options.audioAmplitude === "number" &&
		options.audioAmplitude > 0.02
	) {
		const amp = Math.min(options.audioAmplitude, 1);
		jawOpenScaleY = 0.42 + amp * 0.95;
		headNodY += amp * 4.5;
	} else if (state === "podcast-groove") {
		jawOpenScaleY = 0.5 + beatPulse * 0.45;
	}

	return {
		time: t,
		bodyTranslateY: breath + jumpY,
		bodyScaleX: squashX,
		bodyScaleY: stretchY,
		headRotateDeg,
		headNodY,
		earLeftRotateDeg,
		earRightRotateDeg,
		armRightRotateDeg,
		armLeftRotateDeg,
		tailRotateDeg,
		jawOpenScaleY,
		isBlinking: isDeterministicBlinkAt(t, seed),
		beatPulse,
	};
}
