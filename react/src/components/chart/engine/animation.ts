/**
 * The chart animation engine: easing registry + a rAF orchestrator used by
 * both renderers (SVG re-renders with progress; Canvas calls draw fns with
 * progress). The clock is injectable so tests run on a fake timeline.
 *
 * Mirrors the PrimeUI model: entrance on mount, interpolation on data
 * update, exit on series removal, `animation: false` and
 * prefers-reduced-motion short-circuit to the instant final state.
 */
import type { ChartAnimation, EasingFn, EasingName } from "./types";

export const DEFAULT_ANIMATION_DURATION = 1000;
export const DEFAULT_EASING = "easeOutQuart";

// ── Easing presets ───────────────────────────────────────────────────────────

const C_ELASTIC = (2 * Math.PI) / 3;

const EASING_FUNCTIONS: Record<string, EasingFn> = {
  linear: (t) => t,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBounce: (t) => {
    const c4 = 7.5625;
    const c3 = 2.75;
    if (t < 1 / c3) return c4 * t * t;
    if (t < 2 / c3) return c4 * Math.pow(t - 1.5 / c3, 2) + 0.75;
    if (t < 2.5 / c3) return c4 * Math.pow(t - 2.25 / c3, 2) + 0.9375;
    return c4 * Math.pow(t - 2.625 / c3, 2) + 0.984375;
  },
  easeOutElastic: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * C_ELASTIC) + 1;
  },
};

/** The built-in easing names, in display order (the demo lists derive from this). */
export const EASING_PRESETS = [
  "easeOutQuart",
  "easeOutCubic",
  "easeInOutCubic",
  "easeInQuart",
  "easeOutBounce",
  "easeOutElastic",
  "linear",
] as const;

/**
 * Register a custom easing under a name. PrimeUI's `registerEasing`
 * equivalent — call once at app startup.
 */
export function registerEasing(name: string, fn: EasingFn): void {
  if (!name) return;
  EASING_FUNCTIONS[name] = fn;
}

/**
 * Resolve an easing by name. Unknown names fall back to the default
 * (easeOutQuart) instead of throwing — a typo must not kill the chart.
 */
export function getEasing(name: EasingName | EasingFn | undefined): EasingFn {
  if (typeof name === "function") return name;
  if (!name) return EASING_FUNCTIONS[DEFAULT_EASING];
  return EASING_FUNCTIONS[name] ?? EASING_FUNCTIONS[DEFAULT_EASING];
}

// ── Reduced motion ───────────────────────────────────────────────────────────

/** SSR-safe prefers-reduced-motion check. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** True when animations must render instantly (disabled or reduced-motion). */
export function isAnimationInstant(
  config: ChartAnimation | undefined,
  reducedMotion: boolean,
): boolean {
  if (reducedMotion) return true;
  if (config === undefined) return false;
  return config === false;
}

// ── Animator ─────────────────────────────────────────────────────────────────

export interface AnimatorOptions {
  /** Milliseconds. Defaults to {@link DEFAULT_ANIMATION_DURATION}. */
  duration?: number;
  easing?: EasingName | EasingFn;
  /** Eased progress 0→1, called every frame. */
  onFrame: (progress: number) => void;
  /** Called once after the final frame (or immediately when skipped). */
  onDone?: (progress: number) => void;
  /** When true, skip straight to the final state (no frames). */
  immediate?: boolean;
  /** Injectable clock for tests. */
  now?: () => number;
  schedule?: (fn: (time: number) => void) => number;
  cancel?: (id: number) => void;
}

export interface Animator {
  start(): void;
  cancel(): void;
  /** True once the final state has been applied. */
  readonly settled: boolean;
}

/**
 * Create a one-shot progress animator.
 *
 * Frames report *eased* progress; `onDone` always receives 1. When
 * `immediate` is set, onFrame(1) and onDone(1) fire synchronously and no
 * frames are scheduled.
 */
export function createAnimator(options: AnimatorOptions): Animator {
  const now = options.now ?? performanceNow;
  const schedule =
    options.schedule ??
    ((fn) =>
      (typeof requestAnimationFrame === "function"
        ? requestAnimationFrame(fn)
        : setTimeout(() => fn(Date.now()), 16) as unknown as number));
  const cancelFn =
    options.cancel ??
    ((id) => {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(id);
      } else {
        clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
      }
    });

  const duration = Math.max(0, options.duration ?? DEFAULT_ANIMATION_DURATION);
  const ease = getEasing(options.easing);
  let rafId: number | null = null;
  let settled = false;

  function finish(): void {
    settled = true;
    options.onFrame(1);
    options.onDone?.(1);
  }

  function frame(time: number): void {
    if (settled) return;
    const start = frameStart;
    const t = duration <= 0 ? 1 : Math.min(1, (time - start) / duration);
    if (t >= 1) {
      finish();
      return;
    }
    options.onFrame(ease(t));
    rafId = schedule(() => frame(now()));
  }

  let frameStart = 0;

  return {
    start() {
      if (settled) return;
      if (options.immediate || duration <= 0) {
        finish();
        return;
      }
      frameStart = now();
      rafId = schedule(() => frame(now()));
    },
    cancel() {
      if (rafId !== null) {
        cancelFn(rafId);
        rafId = null;
      }
    },
    get settled() {
      return settled;
    },
  };
}

function performanceNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

// ── Interpolation helpers (update animations) ────────────────────────────────

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Interpolate two value arrays. `from` may be shorter (entering items) or
 * longer (exiting items): missing values clamp to the nearest endpoint so
 * geometry stays defined during the transition. An empty source means "no
 * prior geometry" — enter at the target; an empty target means "exiting" —
 * hold the last geometry until removal.
 */
export function interpolateArrays(
  from: number[],
  to: number[],
  t: number,
): number[] {
  if (from.length === 0) return [...to];
  if (to.length === 0) return [...from];
  const n = Math.max(from.length, to.length);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const a = from[Math.min(i, from.length - 1)];
    const b = to[Math.min(i, to.length - 1)];
    out[i] = lerp(a, b, t);
  }
  return out;
}
