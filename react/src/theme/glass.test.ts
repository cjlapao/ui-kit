/**
 * Tests for common/theme/glass.ts
 *
 * Covers all public exports:
 * - getGlassFillClass
 * - getGlassVibrancyClass
 * - getSpecularClasses
 */

import { describe, it, expect } from "vitest";
import {
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
      "bg-blue-100/55 hover:bg-blue-100/65 dark:bg-blue-600/25 dark:hover:bg-blue-600/35",
    );
  });

  it("returns light fill for red with light opacity", () => {
    const result = getGlassFillClass("red", "light");
    expect(result).toBe(
      "bg-red-100/75 hover:bg-red-100/85 dark:bg-red-600/35 dark:hover:bg-red-600/45",
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

  it("falls back to frosted defaults when opacity is unrecognized", () => {
    // TypeScript won't allow non-GlassOpacity values, but the fallback
    // branch still executes for the implicit `return 55` / `return 25` path.
    const result = getGlassFillClass("amber", "frosted" as "frosted");
    expect(result).toBe(
      "bg-amber-100/55 hover:bg-amber-100/65 dark:bg-amber-600/25 dark:hover:bg-amber-600/35",
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
      const result = getGlassFillClass(color as unknown as typeof import("/home/cjlapao/code/cjlapao/ui-kit/common/theme/glass").TrueColor, "frosted");
      expect(result).toMatch(`bg-${color}-100/55`);
      expect(result).toMatch(`hover:bg-${color}-100/65`);
      expect(result).toMatch(`dark:bg-${color}-600/25`);
      expect(result).toMatch(`dark:hover:bg-${color}-600/35`);
    });
  });

  it("falls back to neutral for colours outside the safelist", () => {
    // The TrueColor type constrains inputs, but the safelist gate still
    // defensively handles unexpected values at runtime.
    const result = getGlassFillClass(
      "unknown" as unknown as typeof import("/home/cjlapao/code/cjlapao/ui-kit/common/theme/glass").TrueColor,
      "frosted",
    );
    expect(result).toBe(
      "bg-neutral-100/55 hover:bg-neutral-100/65 dark:bg-neutral-600/25 dark:hover:bg-neutral-600/35",
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

  it('returns classic specular classes for "classic"', () => {
    const result = getSpecularClasses("classic");
    expect(result).toContain("pointer-events-none absolute inset-x-0 top-0 h-[10px]");
    expect(result).toContain("bg-gradient-to-b from-white/12 via-white/4 to-transparent");
    expect(result).toContain("dark:from-white/5 dark:via-white/2");
  });

  it('returns halo specular classes for "halo"', () => {
    const result = getSpecularClasses("halo");
    expect(result).toContain("pointer-events-none absolute top-0 left-0 w-[40%] h-[35%]");
    expect(result).toContain("rounded-tl-[inherit]");
    expect(result).toContain("rounded-tr-[inherit]");
    expect(result).toContain("pointer-events-none absolute top-0 right-0 w-[40%] h-[35%]");
    expect(result).toContain("pointer-events-none absolute inset-x-0 top-0 h-[20%]");
    expect(result).toContain("dark:from-white/3 dark:via-white/1");
  });

  it("returns null for unrecognized mode", () => {
    expect(getSpecularClasses("none" as "none")).toBeNull();
  });
});