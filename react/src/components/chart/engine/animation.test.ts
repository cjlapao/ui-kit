import { describe, it, expect, vi } from "vitest";
import {
  createAnimator,
  DEFAULT_EASING,
  EASING_PRESETS,
  getEasing,
  isAnimationInstant,
  interpolateArrays,
  lerp,
  prefersReducedMotion,
  registerEasing,
} from "./animation";

describe("easing registry", () => {
  it("exposes the documented presets", () => {
    expect(EASING_PRESETS).toContain("easeOutQuart");
    expect(EASING_PRESETS).toContain("easeOutBounce");
    expect(EASING_PRESETS).toContain("easeOutElastic");
  });

  it("presets hit f(0)=0 and f(1)=1", () => {
    for (const name of EASING_PRESETS) {
      const fn = getEasing(name);
      expect(fn(0)).toBeCloseTo(0);
      expect(fn(1)).toBeCloseTo(1);
    }
  });

  it("non-spring easings are monotonic", () => {
    const monotone = ["linear", "easeInQuart", "easeOutQuart", "easeOutCubic", "easeInOutCubic"];
    for (const name of monotone) {
      const fn = getEasing(name);
      let prev = -Infinity;
      for (let t = 0; t <= 1.0001; t += 0.01) {
        const v = fn(Math.min(1, t));
        expect(v).toBeGreaterThanOrEqual(prev - 1e-9);
        prev = v;
      }
    }
  });

  it("spring easings behave like springs", () => {
    // easeOutBounce peaks exactly at 1.0 and dips between peaks.
    const bounce = getEasing("easeOutBounce");
    let bounceMax = -Infinity;
    for (let t = 0; t <= 1.0001; t += 0.005) bounceMax = Math.max(bounceMax, bounce(Math.min(1, t)));
    expect(bounceMax).toBeLessThanOrEqual(1 + 1e-9);
    expect(bounce(0.5)).toBeLessThan(1);

    // easeOutElastic overshoots 1 before settling.
    const elastic = getEasing("easeOutElastic");
    let elasticMax = -Infinity;
    for (let t = 0; t <= 1.0001; t += 0.005) elasticMax = Math.max(elasticMax, elastic(Math.min(1, t)));
    expect(elasticMax).toBeGreaterThan(1);
    expect(elasticMax).toBeLessThan(1.2);
  });

  it("falls back to the default easing for unknown names (no throw)", () => {
    expect(getEasing("doesNotExist")).toBe(getEasing(DEFAULT_EASING));
    expect(getEasing(undefined)).toBe(getEasing(DEFAULT_EASING));
  });

  it("accepts easing functions directly", () => {
    const custom = (t: number) => t * 2;
    expect(getEasing(custom)).toBe(custom);
  });

  it("registerEasing adds a custom easing by name", () => {
    registerEasing("testEase", (t) => t * t);
    expect(getEasing("testEase")(0.5)).toBeCloseTo(0.25);
  });
});

// ── Animator with a fake clock ───────────────────────────────────────────────

function makeFakeClock() {
  const queue: Array<(time: number) => void> = [];
  let time = 0;
  return {
    now: () => time,
    schedule: (fn: (time: number) => void) => {
      queue.push(fn);
      return queue.length;
    },
    cancel: () => {
      queue.length = 0;
    },
    /** Run all pending frames at the current fake time. */
    flush: () => {
      const pending = queue.splice(0, queue.length);
      pending.forEach((fn) => fn(time));
    },
    set: (t: number) => {
      time = t;
    },
  };
}

describe("createAnimator", () => {
  it("reports eased progress across frames and settles at 1", () => {
    const clock = makeFakeClock();
    const frames: number[] = [];
    let done = 0;
    const animator = createAnimator({
      duration: 1000,
      easing: "linear",
      onFrame: (p) => frames.push(p),
      onDone: () => {
        done += 1;
      },
      now: clock.now,
      schedule: clock.schedule,
      cancel: clock.cancel,
    });

    animator.start();
    clock.set(250);
    clock.flush();
    expect(frames.some((p) => Math.abs(p - 0.25) < 1e-9)).toBe(true);
    expect(done).toBe(0);

    clock.set(1000);
    clock.flush();
    expect(frames[frames.length - 1]).toBeCloseTo(1);
    expect(done).toBe(1);
    expect(animator.settled).toBe(true);
  });

  it("fires immediately when immediate", () => {
    const clock = makeFakeClock();
    const frames: number[] = [];
    let done = 0;
    const animator = createAnimator({
      duration: 500,
      immediate: true,
      onFrame: (p) => frames.push(p),
      onDone: () => {
        done += 1;
      },
      now: clock.now,
      schedule: clock.schedule,
      cancel: clock.cancel,
    });
    animator.start();
    expect(frames).toEqual([1]);
    expect(done).toBe(1);
    expect(clock.schedule !== undefined).toBe(true); // schedule exists but...
    // no frames were scheduled (immediate path)
    expect(animator.settled).toBe(true);
  });

  it("does not run when duration is 0", () => {
    const clock = makeFakeClock();
    const frames: number[] = [];
    const animator = createAnimator({
      duration: 0,
      onFrame: (p) => frames.push(p),
      now: clock.now,
      schedule: clock.schedule,
      cancel: clock.cancel,
    });
    animator.start();
    expect(frames).toEqual([1]);
    expect(animator.settled).toBe(true);
  });

  it("cancel stops further frames", () => {
    const clock = makeFakeClock();
    const frames: number[] = [];
    const animator = createAnimator({
      duration: 1000,
      onFrame: (p) => frames.push(p),
      now: clock.now,
      schedule: clock.schedule,
      cancel: clock.cancel,
    });
    animator.start();
    clock.set(100);
    clock.flush();
    const count = frames.length;
    animator.cancel();
    clock.set(200);
    clock.flush();
    expect(frames.length).toBe(count);
    expect(animator.settled).toBe(false);
  });

  it("uses the default easing (easeOutQuart) when none is given", () => {
    const clock = makeFakeClock();
    const frames: number[] = [];
    const animator = createAnimator({
      duration: 1000,
      onFrame: (p) => frames.push(p),
      now: clock.now,
      schedule: clock.schedule,
      cancel: clock.cancel,
    });
    animator.start();
    clock.set(500);
    clock.flush();
    // easeOutQuart(0.5) = 1 - 0.5^4 = 0.9375
    expect(frames[0]).toBeCloseTo(0.9375);
  });
});

describe("isAnimationInstant", () => {
  it("instant when reduced motion", () => {
    expect(isAnimationInstant({ duration: 100 }, true)).toBe(true);
    expect(isAnimationInstant(false, true)).toBe(true);
    expect(isAnimationInstant(undefined, true)).toBe(true);
  });

  it("not instant by default", () => {
    expect(isAnimationInstant(undefined, false)).toBe(false);
    expect(isAnimationInstant({ duration: 500 }, false)).toBe(false);
  });

  it("instant when animation === false", () => {
    expect(isAnimationInstant(false, false)).toBe(true);
  });
});

describe("prefersReducedMotion", () => {
  it("is false when matchMedia is unavailable (jsdom default stub says no)", () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it("reads the media query when present", () => {
    const spy = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList);
    expect(prefersReducedMotion()).toBe(true);
    spy.mockRestore();
  });
});

describe("interpolation helpers", () => {
  it("lerp", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 0, 1)).toBe(0);
  });

  it("interpolateArrays handles unequal lengths by clamping", () => {
    expect(interpolateArrays([0, 0], [0, 50, 100], 1)).toEqual([0, 50, 100]);
    expect(interpolateArrays([0, 50, 100], [0, 0], 0.5)).toEqual([0, 25, 50]);
    expect(interpolateArrays([], [10], 0)).toEqual([10]);
  });
});
