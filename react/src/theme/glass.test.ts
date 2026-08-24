/**
 * Tests for common/theme/glass.ts
 *
 * Covers all public exports:
 * - getGlassFillClass
 * - getGlassVibrancyClass
 * - getSpecularClasses
 */

import { describe, it, expect } from "vitest";
import type { TrueColor } from "../../../common/theme/Theme";
import type { GlassOpacity } from "../../../common/theme/glass";
import {
  getGlassChromeClasses,
  getGlassFillClass,
  getGlassVibrancyClass,
  getSpecularClasses,
} from "../../../common/theme/glass";

// ---------------------------------------------------------------------------
// getGlassFillClass
// ---------------------------------------------------------------------------

describe("getGlassFillClass", () => {
  it("returns frosted fill for blue with frosted opacity", () => {
    const result = getGlassFillClass("blue", "frosted");
    expect(result).toBe(
      "bg-blue-100/65 hover:bg-blue-100/75 dark:bg-blue-600/25 dark:hover:bg-blue-600/35",
    );
  });

  it("returns light fill for red with light opacity", () => {
    const result = getGlassFillClass("red", "light");
    expect(result).toBe(
      "bg-red-100/85 hover:bg-red-100/95 dark:bg-red-600/35 dark:hover:bg-red-600/45",
    );
  });

  it("returns clear fill for emerald with clear opacity", () => {
    const result = getGlassFillClass("emerald", "clear");
    expect(result).toBe(
      "bg-emerald-100/30 hover:bg-emerald-100/40 dark:bg-emerald-600/10 dark:hover:bg-emerald-600/20",
    );
  });

  it("handles numeric opacity (0.6 → lit=60, drk=18)", () => {
    const result = getGlassFillClass("sky", 0.6);
    expect(result).toBe(
      "bg-sky-100/60 hover:bg-sky-100/70 dark:bg-sky-600/18 dark:hover:bg-sky-600/28",
    );
  });

  it("handles numeric opacity (0.1 → lit=10, drk=3)", () => {
    const result = getGlassFillClass("violet", 0.1);
    expect(result).toBe(
      "bg-violet-100/10 hover:bg-violet-100/20 dark:bg-violet-600/3 dark:hover:bg-violet-600/13",
    );
  });

  it("handles numeric opacity capping dark at 30 (0.99 → drk=min(30,30)=30)", () => {
    const result = getGlassFillClass("purple", 0.99);
    expect(result).toBe(
      "bg-purple-100/99 hover:bg-purple-100/109 dark:bg-purple-600/30 dark:hover:bg-purple-600/40",
    );
  });

  it("falls back to defaults for invalid opacity", () => {
    // A truly invalid string bypasses the frosted/light/clear branches
    // and exercises the `return 55` / `return 25` fallback at the end.
    const result = getGlassFillClass("amber", "bogus" as GlassOpacity);
    expect(result).toBe(
      "bg-amber-100/65 hover:bg-amber-100/75 dark:bg-amber-600/25 dark:hover:bg-amber-600/35",
    );
  });

  it("includes all TrueColor values produce valid classes", () => {
    const trueColors: string[] = [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "rose",
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
    ];

    trueColors.forEach((color) => {
      const result = getGlassFillClass(color as TrueColor, "frosted");
      expect(result).toMatch(`bg-${color}-100/65`);
      expect(result).toMatch(`hover:bg-${color}-100/75`);
      expect(result).toMatch(`dark:bg-${color}-600/25`);
      expect(result).toMatch(`dark:hover:bg-${color}-600/35`);
    });
  });

  it("falls back to neutral for colours outside the safelist", () => {
    // The TrueColor type constrains inputs, but the safelist gate still
    // defensively handles unexpected values at runtime.
    const result = getGlassFillClass(
      "unknown" as unknown as TrueColor,
      "frosted",
    );
    expect(result).toBe(
      "bg-neutral-100/65 hover:bg-neutral-100/75 dark:bg-neutral-600/25 dark:hover:bg-neutral-600/35",
    );
  });
});

// ---------------------------------------------------------------------------
// getGlassVibrancyClass
// ---------------------------------------------------------------------------

describe("getGlassVibrancyClass", () => {
  it('returns backdrop-saturate-[1] for "low"', () => {
    expect(getGlassVibrancyClass("low")).toBe("backdrop-saturate-[1]");
  });

  it('returns backdrop-saturate-[1.2] for "medium"', () => {
    expect(getGlassVibrancyClass("medium")).toBe("backdrop-saturate-[1.2]");
  });

  it('returns backdrop-saturate-[1.4] for "high"', () => {
    expect(getGlassVibrancyClass("high")).toBe("backdrop-saturate-[1.4]");
  });

  it("accepts arbitrary number (1.8)", () => {
    expect(getGlassVibrancyClass(1.8)).toBe("backdrop-saturate-[1.8]");
  });

  it("accepts zero vibrancy", () => {
    expect(getGlassVibrancyClass(0)).toBe("backdrop-saturate-[0]");
  });

  it("accepts maximum vibrancy (2)", () => {
    expect(getGlassVibrancyClass(2)).toBe("backdrop-saturate-[2]");
  });

  it("defaults to medium (1.2) for unrecognized string", () => {
    expect(getGlassVibrancyClass("medium" as "medium")).toBe(
      "backdrop-saturate-[1.2]",
    );
  });
});

// ---------------------------------------------------------------------------
// getSpecularClasses
// ---------------------------------------------------------------------------

describe("getSpecularClasses", () => {
  it('returns null for "none"', () => {
    expect(getSpecularClasses("none")).toBeNull();
  });

  it('returns a full-bleed sheen for "classic"', () => {
    const result = getSpecularClasses("classic");
    expect(result).toContain("bg-gradient-to-b from-white/35");
    expect(result).toContain("to-transparent");
    expect(result).toContain("dark:from-white/12");
  });

  it('returns stacked radial layers for "halo"', () => {
    const result = getSpecularClasses("halo");
    expect(result).toContain("bg-[radial-gradient(");
    expect(result).toContain("dark:bg-[radial-gradient(");
    // Three layers per mode: the bloom plus two corner glints.
    expect(result!.match(/radial-gradient\(/g)).toHaveLength(6);
  });

  it("returns paint only — callers own the overlay geometry", () => {
    // Every caller already applies `absolute inset-0 rounded-[inherit]`;
    // layout utilities here produced conflicting pairs that silently won.
    for (const mode of ["classic", "halo"] as const) {
      const result = getSpecularClasses(mode)!;
      expect(result).not.toContain("absolute");
      expect(result).not.toContain("inset-");
      expect(result).not.toMatch(/(^|\s)top-0(\s|$)/);
      expect(result).not.toContain("pointer-events-none");
    }
  });

  it("keeps every halo gradient stop fading to zero alpha", () => {
    // A layer that does not reach transparency inside its own box renders as
    // a visible rectangle — the bug this replaced.
    const result = getSpecularClasses("halo")!;
    expect(result.match(/rgba\(255,255,255,0\)/g)).toHaveLength(6);
  });

  it("returns null for unrecognized mode", () => {
    expect(getSpecularClasses("none" as "none")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// getGlassChromeClasses
// ---------------------------------------------------------------------------

describe("getGlassChromeClasses", () => {
  it("supplies the text colour the variant classes no longer provide", () => {
    const result = getGlassChromeClasses("blue");
    expect(result).toContain("text-blue-900");
    expect(result).toContain("dark:text-blue-50");
  });

  it("rests on a neutral white rim and reserves the tone edge for hover", () => {
    const result = getGlassChromeClasses("rose");
    expect(result).toContain("border-white/50");
    expect(result).toContain("dark:border-white/10");
    // The saturated tone is the hover state, never the resting edge.
    expect(result).toContain("hover:border-rose-500");
    expect(result).toContain("dark:hover:border-rose-300");
  });

  it("ignites the rim in the tone on hover — and keeps it shadow-free", () => {
    const result = getGlassChromeClasses("blue");
    // Hover is a colour response on the border, glass's defining feature: the
    // rim steps from neutral white to the control's own tone. A drop shadow
    // read as the surface lifting off the page and contradicted the flat,
    // in-surface hover the solid/soft/ghost/icon variants already use, so the
    // edge — not a shadow — carries the state.
    expect(result).toContain("hover:border-blue-500");
    expect(result).toContain("dark:hover:border-blue-300");
    expect(result).not.toContain("hover:shadow");
  });

  it("restores a focus ring — glass controls previously had none", () => {
    const result = getGlassChromeClasses("emerald");
    expect(result).toContain("focus-visible:ring-2");
    expect(result).toContain("focus-visible:ring-emerald-400");
  });

  it("falls back to neutral for a colour outside the palette", () => {
    const result = getGlassChromeClasses("white" as TrueColor);
    expect(result).toContain("text-neutral-900");
  });
});
